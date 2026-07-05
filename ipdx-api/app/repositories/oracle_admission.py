"""Oracle-backed admission repository.

===========================================================================
  THIS IS THE ONLY FILE YOU NEED TO EDIT TO CONNECT THE REAL HIS SCHEMA.
===========================================================================

Replace the SQL templates below with queries against your HIS (Oracle 11g)
tables/views. Keep the column ALIASES (the `AS xxx` names) exactly as they
are — the mapping code relies on them. That way the legacy table/column names
stay contained here (anti-corruption layer) and never leak to the web app.

Tips for Oracle 11g:
  * Compute length of stay in SQL, e.g.  TRUNC(SYSDATE) - TRUNC(a.admit_date) AS los_days
  * Bind variables use :name syntax (already used below).
  * If you expose a VIEW over the legacy tables, point the FROM clause at it.
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
from .base import AdmissionRepository

# --- SQL templates: ADJUST TO YOUR REAL SCHEMA ---------------------------- #

WARDS_SQL = """
    SELECT
        ward_id     AS id,
        ward_name   AS name,
        ward_name   AS name_th
    FROM ipd_ward_master
    ORDER BY ward_id
"""

WARD_SQL = """
    SELECT
        ward_id     AS id,
        ward_name   AS name,
        ward_name   AS name_th
    FROM ipd_ward_master
    WHERE ward_id = :ward_id
"""

# Optional: list every bed of a ward so empty beds also appear.
# Leave as "" (empty string) to build the census only from admitted patients.
WARD_BEDS_SQL = ""
# Example once you have a bed master:
# WARD_BEDS_SQL = """
#     SELECT bed_no AS bed
#     FROM ipd_bed_master
#     WHERE ward_id = :ward_id
#     ORDER BY bed_no
# """

# Currently admitted patients in a ward (the core admission query).
CENSUS_PATIENTS_SQL = """
    SELECT
        a.bed_no                              AS bed,
        a.hn                                  AS hn,
        a.an                                  AS an,
        p.patient_name                        AS name,
        p.age_years                           AS age_years,
        p.sex                                 AS sex,
        a.diagnosis                           AS diagnosis,
        TRUNC(SYSDATE) - TRUNC(a.admit_date)  AS los_days
    FROM ipd_admission a
    JOIN patient p ON p.hn = a.hn
    WHERE a.ward_id = :ward_id
      AND a.discharge_date IS NULL
    ORDER BY a.bed_no
"""


def _to_patient(row: dict, ward_id: str) -> Patient:
    """Map a DB row (keyed by SQL alias) onto the Patient contract.

    Priority and pending counts are NOT part of admission data — they get
    enriched later from clinical scoring (NEWS) and the PostgreSQL side.
    Defaults are used here so the admission endpoint works on its own.
    """
    sex = (str(row.get("sex") or "M")).upper()
    sex = "F" if sex in ("F", "2", "หญิง") else "M"
    return Patient(
        id=f"p{row.get('bed')}",
        hn=str(row.get("hn") or ""),
        an=(str(row["an"]) if row.get("an") is not None else None),
        name=str(row.get("name") or ""),
        age_years=int(row.get("age_years") or 0),
        sex=sex,  # type: ignore[arg-type]
        diagnosis=str(row.get("diagnosis") or ""),
        los_days=int(row.get("los_days") or 0),
        priority="P3",  # enriched later
        pending=PendingCounts(lab=0, consult=0, task=0, med=0),
        has_alert=False,
        ward=ward_id,
    )


class OracleAdmissionRepository(AdmissionRepository):
    def get_wards(self) -> list[Ward]:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute(WARDS_SQL)
            rows = rows_as_dicts(cur)
        return [
            Ward(id=str(r["id"]), name=str(r["name"]), name_th=str(r["name_th"]))
            for r in rows
        ]

    def get_ward_census(self, ward_id: str) -> WardCensus | None:
        with get_connection() as conn:
            cur = conn.cursor()

            cur.execute(WARD_SQL, ward_id=ward_id)
            ward_rows = rows_as_dicts(cur)
            if not ward_rows:
                return None
            ward = ward_rows[0]

            bed_master: list[dict] = []
            if WARD_BEDS_SQL.strip():
                cur.execute(WARD_BEDS_SQL, ward_id=ward_id)
                bed_master = rows_as_dicts(cur)

            cur.execute(CENSUS_PATIENTS_SQL, ward_id=ward_id)
            patient_rows = rows_as_dicts(cur)

        patients_by_bed = {str(r["bed"]): r for r in patient_rows}

        beds: list[Bed] = []
        if bed_master:
            for b in bed_master:
                bed_no = str(b["bed"])
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
                        bed=str(r["bed"]),
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
            ward_id=str(ward["id"]),
            ward_name=str(ward["name"]),
            ward_name_th=str(ward["name_th"]),
            summary=summary,
            beds=beds,
            last_updated=LastUpdated(vitals=now, lab=now, orders=now, tasks=now),
        )
