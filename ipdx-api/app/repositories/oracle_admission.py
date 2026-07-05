"""Oracle-backed admission repository (real HIS schema).

Queries the live HIS tables (ipdtrans / patients / places / doc_dbfs /
blood_groups) and maps the rows onto the clean Patient/WardCensus contract.
This is the anti-corruption layer: legacy table/column names live only here.

Column ALIASES in the SQL (`AS xxx`) must stay in sync with the keys read in
the mapping functions below.
"""

from __future__ import annotations

from datetime import datetime

from app.db.oracle import get_connection, rows_as_dicts
from app.schemas.ward import (
    Bed,
    LastUpdated,
    Patient,
    PendingCounts,
    Ward,
    WardCensus,
    WardSummary,
)
from app.utils.age import age_display_th, age_parts, days_between
from .base import AdmissionRepository

# --- SQL against the real HIS schema -------------------------------------- #

# IPD ward master list (pt_place_type_code='2' = ward), used by the ward picker.
WARDS_SQL = """
    SELECT
        placecode AS id,
        halfplace AS name,
        halfplace AS name_th
    FROM places
    WHERE del_flag IS NULL
      AND pt_place_type_code = '2'
    ORDER BY halfplace
"""

WARD_SQL = """
    SELECT
        placecode AS id,
        halfplace AS name,
        halfplace AS name_th
    FROM places
    WHERE placecode = :ward_id
"""

# Optional bed master (to show empty beds). Leave "" to build from admissions.
WARD_BEDS_SQL = ""

# Currently admitted patients in a ward — based on the query provided by the HIS.
# NOTE: add a `sex` and a `diagnosis` column here when available; they are
# mapped automatically (see _to_patient).
CENSUS_PATIENTS_SQL = """
    SELECT
        i.pla_placecode                             AS ward_code,
        pl.halfplace                                AS ward_name,
        i.bed_no                                    AS bed,
        i.an                                        AS an,
        i.hn                                        AS hn,
        pt.prename || pt.name || ' ' || pt.surname  AS patient_name,
        pt.sex                                      AS sex,
        pt.birthday                                 AS birthday,
        b.name                                      AS blood_group,
        i.dateadmit                                 AS dateadmit,
        i.prediagnos                                AS diagnosis,
        dd.prename || dd.name || ' ' || dd.surname  AS doctor_name
    FROM ipdtrans i
    JOIN patients pt          ON i.hn = pt.hn
    LEFT JOIN blood_groups b  ON pt.bg_blood_gr_id = b.blood_gr_id
    LEFT JOIN doc_dbfs dd     ON i.dd_doc_code = dd.doc_code
    JOIN places pl            ON i.pla_placecode = pl.placecode
    WHERE i.datedisch IS NULL
      AND i.pla_placecode = :ward_id
    ORDER BY LENGTH(i.bed_no), i.bed_no
"""


def _map_sex(value: object) -> str:
    """Map various HIS sex encodings to 'M' / 'F'. Defaults to 'M'."""
    s = str(value or "").strip().upper()
    if s in ("F", "2", "W", "FEMALE", "หญิง", "ญ"):
        return "F"
    return "M"


def _clean(value: object) -> str:
    return str(value).strip() if value is not None else ""


def _to_patient(row: dict, ward_id: str) -> Patient:
    hn = _clean(row.get("hn"))
    birthday = row.get("birthday")
    parts = age_parts(birthday)
    years, months, days = parts if parts else (0, None, None)

    return Patient(
        id=hn or _clean(row.get("an")) or f"bed-{row.get('bed')}",
        hn=hn,
        an=(_clean(row["an"]) or None) if row.get("an") is not None else None,
        name=_clean(row.get("patient_name")),
        age_years=years,
        age_months=months,
        age_days=days,
        age_display=age_display_th(birthday),
        # `sex`/`diagnosis` are not in the base query yet — mapped if present.
        sex=_map_sex(row.get("sex")),  # type: ignore[arg-type]
        diagnosis=_clean(row.get("diagnosis")),
        los_days=days_between(row.get("dateadmit")),
        priority="P3",  # enriched later (clinical scoring / NEWS)
        pending=PendingCounts(lab=0, consult=0, task=0, med=0),
        has_alert=False,
        ward=ward_id,
        attending_doctor=_clean(row.get("doctor_name")) or None,
        blood_group=_clean(row.get("blood_group")) or None,
    )


class OracleAdmissionRepository(AdmissionRepository):
    def get_wards(self) -> list[Ward]:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute(WARDS_SQL)
            rows = rows_as_dicts(cur)
        return [
            Ward(id=_clean(r["id"]), name=_clean(r["name"]), name_th=_clean(r["name_th"]))
            for r in rows
        ]

    def get_ward_census(self, ward_id: str) -> WardCensus | None:
        with get_connection() as conn:
            cur = conn.cursor()

            cur.execute(WARD_SQL, ward_id=ward_id)
            ward_rows = rows_as_dicts(cur)

            bed_master: list[dict] = []
            if WARD_BEDS_SQL.strip():
                cur.execute(WARD_BEDS_SQL, ward_id=ward_id)
                bed_master = rows_as_dicts(cur)

            cur.execute(CENSUS_PATIENTS_SQL, ward_id=ward_id)
            patient_rows = rows_as_dicts(cur)

        # Ward name: prefer places row, else fall back to the census rows.
        if ward_rows:
            ward_name = _clean(ward_rows[0]["name"]) or ward_id
        elif patient_rows:
            ward_name = _clean(patient_rows[0].get("ward_name")) or ward_id
        else:
            return None

        patients_by_bed = {_clean(r["bed"]): r for r in patient_rows}

        beds: list[Bed] = []
        if bed_master:
            for b in bed_master:
                bed_no = _clean(b["bed"])
                prow = patients_by_bed.get(bed_no)
                beds.append(
                    Bed(bed=bed_no, status="occupied", patient=_to_patient(prow, ward_id))
                    if prow
                    else Bed(bed=bed_no, status="empty", patient=None)
                )
        else:
            for r in patient_rows:
                beds.append(
                    Bed(
                        bed=_clean(r["bed"]),
                        status="occupied",
                        patient=_to_patient(r, ward_id),
                    )
                )

        occupied = sum(1 for b in beds if b.status == "occupied")
        total = len(beds) if bed_master else occupied
        admitted_pct = round((occupied / total * 100), 1) if total else 0.0

        summary = WardSummary(
            total_beds=total,
            occupied_beds=occupied,
            admitted=occupied,
            admitted_pct=admitted_pct,
            close_monitor=0,
            close_monitor_pct=0.0,
            pending=0,
            pending_pct=0.0,
            ready_discharge=0,
            ready_discharge_pct=0.0,
            trend=[],
            trend_labels=None,
        )

        now = datetime.now().strftime("%I:%M %p")
        return WardCensus(
            ward_id=ward_id,
            ward_name=ward_name,
            ward_name_th=ward_name,
            summary=summary,
            beds=beds,
            last_updated=LastUpdated(vitals=now, lab=now, orders=now, tasks=now),
        )
