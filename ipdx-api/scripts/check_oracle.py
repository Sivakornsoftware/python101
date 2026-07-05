"""Quick Oracle connectivity / query checker.

Run from the ipdx-api folder (with .venv active and .env configured):

    python scripts/check_oracle.py
    python scripts/check_oracle.py "SELECT * FROM ipd_admission WHERE ROWNUM <= 5"

It reads the same ORACLE_* settings from .env, opens a thick-mode connection,
runs the query (default: SELECT 1 FROM dual) and prints the rows. Use it to
confirm the connection works BEFORE wiring the real SQL into the repository.
"""

import sys
from pathlib import Path

# Allow running as `python scripts/check_oracle.py` from the project root.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import get_settings  # noqa: E402
from app.db import oracle  # noqa: E402


def main() -> int:
    settings = get_settings()
    print("--- Oracle connection settings ---")
    print(f"  DSN     : {settings.oracle_dsn}")
    print(f"  USER    : {settings.oracle_user}")
    print(f"  LIB_DIR : {settings.oracle_lib_dir or '(auto-detect)'}")
    print("----------------------------------")

    sql = sys.argv[1] if len(sys.argv) > 1 else "SELECT 1 AS ok FROM dual"
    print(f"Running: {sql}\n")

    try:
        with oracle.get_connection() as conn:
            cur = conn.cursor()
            cur.execute(sql)
            rows = oracle.rows_as_dicts(cur)
    except Exception as exc:  # noqa: BLE001
        print("❌ CONNECTION/QUERY FAILED")
        print(f"   {type(exc).__name__}: {exc}")
        return 1

    print(f"✅ OK — {len(rows)} row(s)")
    for r in rows[:20]:
        print("  ", r)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
