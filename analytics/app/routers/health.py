from fastapi import APIRouter
from pydantic import BaseModel
import datetime

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: str

@router.get("/health", response_model=HealthResponse)
@router.get("/api/v1/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(
        status="healthy",
        service="tracex-analytics-service",
        version="v1.0.0",
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
