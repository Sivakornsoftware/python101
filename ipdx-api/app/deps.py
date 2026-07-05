from functools import lru_cache

from app.config import get_settings
from app.repositories.base import AdmissionRepository
from app.repositories.mock import MockAdmissionRepository


@lru_cache
def get_admission_repository() -> AdmissionRepository:
    """Return the configured repository implementation.

    Import of the Oracle repository is deferred so the app can run in mock
    mode without the Oracle client / driver being configured.
    """
    settings = get_settings()
    if settings.db_backend == "oracle":
        from app.repositories.oracle_admission import OracleAdmissionRepository

        return OracleAdmissionRepository()
    return MockAdmissionRepository()
