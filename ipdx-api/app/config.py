from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables / .env."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "IPDX API"
    debug: bool = False

    # Comma-separated list of allowed browser origins for CORS.
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Which repository implementation to use: "mock" or "oracle".
    # Start with "mock" to connect the frontend, then switch to "oracle".
    db_backend: str = "mock"

    # --- Oracle 11g (legacy HIS) connection ---------------------------------
    # DSN format: "host:port/service_name"  e.g. "10.0.0.10:1521/ORCL"
    oracle_user: str = ""
    oracle_password: str = ""
    oracle_dsn: str = ""
    # Oracle 11g requires python-oracledb THICK mode, which needs the Oracle
    # Instant Client. Set this to the Instant Client directory, e.g.
    # "/opt/oracle/instantclient_19_24". Leave empty to let the driver find it
    # via PATH / LD_LIBRARY_PATH.
    oracle_lib_dir: str = ""
    oracle_pool_min: int = 1
    oracle_pool_max: int = 4

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
