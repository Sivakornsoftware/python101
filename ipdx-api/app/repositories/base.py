from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas.ward import Ward, WardCensus


class AdmissionRepository(ABC):
    """Data-access interface for admission / ward-census data.

    Implementations must return the same shapes regardless of the underlying
    source (mock or Oracle), so the routers/services never change.
    """

    @abstractmethod
    def get_wards(self) -> list[Ward]:
        ...

    @abstractmethod
    def get_ward_census(self, ward_id: str) -> WardCensus | None:
        ...
