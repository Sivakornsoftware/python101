"""In-memory sample data so the API is runnable and the frontend can be wired
up before the Oracle queries are finalized. Mirrors the frontend contract.
"""

from __future__ import annotations

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

_WARDS = [
    Ward(id="5A", name="Ward 5A", name_th="อายุรกรรมชาย 5A"),
    Ward(id="5B", name="Ward 5B", name_th="อายุรกรรมหญิง 5B"),
    Ward(id="ICU", name="ICU", name_th="หอผู้ป่วยวิกฤต"),
]


def _bed(
    bed: str,
    hn: str,
    name: str,
    age: int,
    dx: str,
    los: int,
    priority: str,
    lab: int,
    consult: int,
    task: int,
    med: int,
    alert: bool = False,
) -> Bed:
    return Bed(
        bed=bed,
        status="occupied",
        patient=Patient(
            id=f"p{bed}",
            hn=hn,
            an=f"AN68{bed}",
            name=name,
            age_years=age,
            sex="M",
            diagnosis=dx,
            los_days=los,
            priority=priority,  # type: ignore[arg-type]
            pending=PendingCounts(lab=lab, consult=consult, task=task, med=med),
            has_alert=alert,
            ward="5A",
        ),
    )


class MockAdmissionRepository(AdmissionRepository):
    def get_wards(self) -> list[Ward]:
        return _WARDS

    def get_ward_census(self, ward_id: str) -> WardCensus | None:
        ward = next((w for w in _WARDS if w.id == ward_id), _WARDS[0])
        beds = [
            _bed("101", "1234567", "นายสมชาย ใจดี", 68, "AKI, CHF", 5, "P0", 6, 1, 4, 18, alert=True),
            _bed("102", "1234589", "นายสันติ สุขเจ", 72, "HTN", 2, "P1", 1, 0, 0, 7),
            _bed("103", "1234590", "นายวิชัย คำสา", 65, "COPD", 7, "P1", 3, 1, 2, 12, alert=True),
            _bed("104", "1234591", "นายประสิทธิ์ แซ่ตั้ง", 71, "Stroke, DM", 3, "P2", 7, 4, 3, 20),
            _bed("105", "1234592", "นายอุดม ศรีสุข", 60, "DHF", 4, "P3", 0, 0, 1, 8),
            Bed(bed="106", status="empty", patient=None),
        ]
        return WardCensus(
            ward_id=ward.id,
            ward_name=ward.name,
            ward_name_th=ward.name_th,
            summary=WardSummary(
                total_beds=36,
                occupied_beds=32,
                admitted=28,
                admitted_pct=77.8,
                close_monitor=8,
                close_monitor_pct=28.6,
                pending=14,
                pending_pct=50.0,
                ready_discharge=3,
                ready_discharge_pct=10.7,
                trend=[24, 27, 25, 29, 26, 30, 28],
                trend_labels=["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."],
            ),
            beds=beds,
            last_updated=LastUpdated(
                vitals="09:45 AM", lab="09:45 AM", orders="10:10 AM", tasks="10:15 AM"
            ),
        )
