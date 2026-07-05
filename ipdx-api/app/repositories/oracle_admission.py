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

# Bed-centric census: one row per bed in the ward. A bed with occupy_flag NULL
# (or no admission row) is an empty bed. Left joins bring in the current
# admission / patient / doctor when the bed is occupied.
CENSUS_BEDS_SQL = """
    SELECT
        b.pla_placecode                             AS ward_code,
        pl.halfplace                                AS ward_name,
        b.code                                      AS bed,
        b.occupy_flag                               AS occupy_flag,
        i.an                                        AS an,
        i.hn                                        AS hn,
        pt.prename || pt.name || ' ' || pt.surname  AS patient_name,
        pt.sex                                      AS sex,
        bg.name                                     AS blood_group,
        pt.birthday                                 AS birthday,
        i.dateadmit                                 AS dateadmit,
        i.prediagnos                                AS diagnosis,
        dd.prename || dd.name || ' ' || dd.surname  AS doctor_name
    FROM beds b
    LEFT JOIN places pl        ON b.pla_placecode = pl.placecode
    LEFT JOIN ipdtrans i       ON b.pla_placecode = i.pla_placecode
                              AND b.code = i.bed_no
                              AND i.datedisch IS NULL
    LEFT JOIN patients pt      ON i.hn = pt.hn
    LEFT JOIN blood_groups bg  ON pt.bg_blood_gr_id = bg.blood_gr_id
    LEFT JOIN doc_dbfs dd      ON i.dd_doc_code = dd.doc_code
    WHERE b.pla_placecode = :ward_id
      AND b.del_flag IS NULL
    ORDER BY LENGTH(b.code), b.code
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

            cur.execute(CENSUS_BEDS_SQL, ward_id=ward_id)
            bed_rows = rows_as_dicts(cur)

        # Ward name: prefer the places row, else fall back to a bed row.
        if ward_rows:
            ward_name = _clean(ward_rows[0]["name"]) or ward_id
        elif bed_rows:
            ward_name = _clean(bed_rows[0].get("ward_name")) or ward_id
        else:
            return None

        beds: list[Bed] = []
        for r in bed_rows:
            bed_no = _clean(r.get("bed"))
            # Empty when occupy_flag is NULL or there is no admitted patient.
            occupied = r.get("occupy_flag") is not None and bool(_clean(r.get("hn")))
            if occupied:
                beds.append(
                    Bed(bed=bed_no, status="occupied", patient=_to_patient(r, ward_id))
                )
            else:
                beds.append(Bed(bed=bed_no, status="empty", patient=None))

        occupied = sum(1 for b in beds if b.status == "occupied")
        total = len(beds)
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
