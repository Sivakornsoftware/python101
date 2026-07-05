"""Oracle 11g connection handling using python-oracledb in THICK mode.

Oracle 11g (11.2) is only supported by python-oracledb's thick mode, which
requires the Oracle Instant Client to be installed on the server. Set
`ORACLE_LIB_DIR` in the environment if the client is not on PATH/LD_LIBRARY_PATH.
"""

from __future__ import annotations

import threading
from contextlib import contextmanager
from typing import Iterator

import oracledb

from app.config import get_settings

_pool: oracledb.ConnectionPool | None = None
_lock = threading.Lock()
_thick_initialized = False


def _init_client() -> None:
    """Initialize the Oracle client in thick mode when required.

    Thick mode is mandatory for Oracle 11g. For 12.1+ (e.g. a PDB) thin mode
    can be used, in which case no Instant Client is needed and nothing is done.
    """
    global _thick_initialized
    if _thick_initialized:
        return
    settings = get_settings()
    if settings.oracle_thick:
        lib_dir = settings.oracle_lib_dir or None
        oracledb.init_oracle_client(lib_dir=lib_dir)
    _thick_initialized = True


def get_pool() -> oracledb.ConnectionPool:
    """Lazily create a shared connection pool."""
    global _pool
    if _pool is not None:
        return _pool
    with _lock:
        if _pool is None:
            _init_client()
            settings = get_settings()
            _pool = oracledb.create_pool(
                user=settings.oracle_user,
                password=settings.oracle_password,
                dsn=settings.oracle_dsn,
                min=settings.oracle_pool_min,
                max=settings.oracle_pool_max,
                increment=1,
            )
    return _pool


@contextmanager
def get_connection() -> Iterator[oracledb.Connection]:
    """Acquire a pooled connection and return it automatically."""
    pool = get_pool()
    conn = pool.acquire()
    try:
        yield conn
    finally:
        pool.release(conn)


def rows_as_dicts(cursor: oracledb.Cursor) -> list[dict]:
    """Convert a cursor result set into a list of dicts keyed by lowercase
    column alias — so SQL `AS` aliases map directly onto our field names."""
    columns = [d[0].lower() for d in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]
