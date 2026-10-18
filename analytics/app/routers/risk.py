from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.typology_engine import TypologyEngine

router = APIRouter()

class RiskEvaluationRequest(BaseModel):
    investigation_id: str
    transactions: List[Dict[str, Any]]
    address_labels: Optional[Dict[str, str]] = {}

class RiskIndicator(BaseModel):
    type: str
    severity: str
    confidence: float
    description: str
    evidence: List[str]

class RiskEvaluationResponse(BaseModel):
    investigation_id: str
    risk_score: float
    risk_level: str
    risk_indicators: List[RiskIndicator]
    limitations: List[str]

@router.post("/analytics/risk/evaluate", response_model=RiskEvaluationResponse)
@router.post("/api/v1/risk/evaluate", response_model=RiskEvaluationResponse)
def evaluate_risk(req: RiskEvaluationRequest):
    engine = TypologyEngine(req.transactions, req.address_labels)
    eval_result = engine.evaluate_all()

    return RiskEvaluationResponse(
        investigation_id=req.investigation_id,
        risk_score=eval_result["risk_score"],
        risk_level=eval_result["risk_level"],
        risk_indicators=eval_result["risk_indicators"],
        limitations=eval_result["limitations"]
    )
