from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import __version__
from app.config import get_settings
from app.routers import wards

settings = get_settings()

app = FastAPI(title=settings.app_name, version=__version__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wards.router)


@app.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok", "backend": settings.db_backend, "version": __version__}


@app.get("/health/db", tags=["system"])
def health_db() -> dict:
    """Verify the Oracle connection (runs SELECT 1 FROM dual)."""
    from app.db.oracle import get_connection

    try:
        with get_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM dual")
            cur.fetchone()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail=f"Oracle connection failed: {type(exc).__name__}: {exc}",
        )
    return {"status": "ok", "db": "oracle"}
