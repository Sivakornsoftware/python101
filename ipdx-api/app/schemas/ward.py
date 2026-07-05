"""Pydantic models mirroring the frontend contract in
`ipdpaperless/src/lib/types.ts`.

Fields are declared in snake_case but serialized to camelCase (via
`alias_generator=to_camel`), so the JSON returned to the web app matches the
TypeScript types exactly (e.g. `wardName`, `ageYears`, `losDays`).
"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

PriorityLevel = Literal["P0", "P1", "P2", "P3", "P4"]
Sex = Literal["M", "F"]
BedStatus = Literal["occupied", "empty", "reserved"]


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class Ward(CamelModel):
    id: str
    name: str
    name_th: str


class PendingCounts(CamelModel):
    lab: int = 0
    consult: int = 0
    task: int = 0
    med: int = 0
    order: Optional[int] = None
    other: Optional[int] = None


class Patient(CamelModel):
    id: str
    hn: str
    an: Optional[str] = None
    name: str
    age_years: int
    sex: Sex
    diagnosis: str
    los_days: int
    priority: PriorityLevel
    pending: PendingCounts
    has_alert: bool = False
    ward: Optional[str] = None


class Bed(CamelModel):
    bed: str
    status: BedStatus
    patient: Optional[Patient] = None


class WardSummary(CamelModel):
    total_beds: int
    occupied_beds: int
    admitted: int
    admitted_pct: float
    close_monitor: int
    close_monitor_pct: float
    pending: int
    pending_pct: float
    ready_discharge: int
    ready_discharge_pct: float
    trend: list[int] = []
    trend_labels: Optional[list[str]] = None


class LastUpdated(CamelModel):
    vitals: str
    lab: str
    orders: str
    tasks: str


class WardCensus(CamelModel):
    ward_id: str
    ward_name: str
    ward_name_th: str
    summary: WardSummary
    beds: list[Bed]
    last_updated: LastUpdated
