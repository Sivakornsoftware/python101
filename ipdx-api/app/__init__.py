"""IPDX API — FastAPI service that exposes data from the legacy HIS (Oracle 11g)
as a clean, modern JSON contract consumed by the IPD Paperless web app.

Acts as an anti-corruption layer: legacy table/column quirks stay inside the
repository layer; everything above works with well-named Pydantic models that
match the frontend's `src/lib/types.ts` contract.
"""

__version__ = "0.1.0"
