from fastapi import APIRouter, Depends, HTTPException

from app.deps import get_admission_repository
from app.repositories.base import AdmissionRepository
from app.schemas.ward import Ward, WardCensus

router = APIRouter(prefix="/api", tags=["wards"])


# NOTE: these are `def` (sync) endpoints so FastAPI runs the blocking Oracle
# calls in a threadpool, keeping the event loop responsive.


@router.get("/wards", response_model=list[Ward])
def list_wards(
    repo: AdmissionRepository = Depends(get_admission_repository),
) -> list[Ward]:
    return repo.get_wards()


@router.get("/wards/{ward_id}/census", response_model=WardCensus)
def ward_census(
    ward_id: str,
    repo: AdmissionRepository = Depends(get_admission_repository),
) -> WardCensus:
    census = repo.get_ward_census(ward_id)
    if census is None:
        raise HTTPException(status_code=404, detail=f"Ward '{ward_id}' not found")
    return census
