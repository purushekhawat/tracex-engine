from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AttributionCategory(str, Enum):
    VERIFIED_LABEL = "VERIFIED_LABEL"
    STRONG_ASSOCIATION = "STRONG_ASSOCIATION"
    INFERRED_ASSOCIATION = "INFERRED_ASSOCIATION"
    UNKNOWN = "UNKNOWN"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    SEVERE = "SEVERE"

class BlockchainModel(BaseModel):
    id: str
    code: str
    name: str
    native_symbol: str
    chain_id: Optional[str] = None
    is_active: bool = True

class WalletModel(BaseModel):
    id: str
    blockchain_id: str
    address: str
    wallet_type: str = "UNKNOWN"
    balance_native: float = 0.0

class TransactionModel(BaseModel):
    id: str
    blockchain_id: str
    tx_hash: str
    from_wallet_id: str
    to_wallet_id: str
    asset_id: str
    amount: float
    amount_usd: float = 0.0
    fee_native: float = 0.0
    block_number: int
    timestamp: datetime
    status: str = "SUCCESS"

class AttributionResultModel(BaseModel):
    id: str
    investigation_id: str
    suspect_address: str
    candidate_vasp_id: Optional[str] = None
    attribution_category: AttributionCategory
    evidence_score: float = Field(..., ge=0.0, le=100.0)
    uncertainty_score: float = Field(..., ge=0.0, le=100.0)
    hop_distance: int
    value_flow_usd: float = 0.0
    path_tx_hashes: List[str]
    explanation: str
    analysis_version: str = "v1.0.0"

class RiskAssessmentModel(BaseModel):
    id: str
    investigation_id: str
    overall_risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: RiskLevel
    typologies_detected: List[str]
    findings_json: Dict[str, Any]
