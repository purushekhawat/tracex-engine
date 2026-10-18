import pytest
from app.models import AttributionResultModel, AttributionCategory, RiskAssessmentModel, RiskLevel

def test_attribution_model_validation():
    attr = AttributionResultModel(
        id="res11111",
        investigation_id="inv11111",
        suspect_address="0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        attribution_category=AttributionCategory.STRONG_ASSOCIATION,
        evidence_score=87.5,
        uncertainty_score=12.5,
        hop_distance=3,
        value_flow_usd=31360.0,
        path_tx_hashes=["0x1", "0x2", "0x3"],
        explanation="Multi-hop flow to Binance"
    )
    assert attr.evidence_score == 87.5
    assert attr.attribution_category == AttributionCategory.STRONG_ASSOCIATION

def test_risk_assessment_validation():
    risk = RiskAssessmentModel(
        id="r11111",
        investigation_id="inv11111",
        overall_risk_score=85.0,
        risk_level=RiskLevel.HIGH,
        typologies_detected=["PEEL_CHAIN", "HIGH_PASS_THROUGH"],
        findings_json={"peel_chain_length": 3}
    )
    assert risk.risk_level == RiskLevel.HIGH
    assert len(risk.typologies_detected) == 2
