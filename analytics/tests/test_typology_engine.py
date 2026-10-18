from fastapi.testclient import TestClient
from app.main import app
from app.services.typology_engine import TypologyEngine

client = TestClient(app)

SYNTHETIC_TXS = [
    {
        "from_address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "to_address": "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
        "tx_hash": "0x9999...0001",
        "amount": 10.0,
        "timestamp": "2026-10-06T12:00:00Z"
    },
    {
        "from_address": "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
        "to_address": "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
        "tx_hash": "0x9999...0002",
        "amount": 9.85,
        "timestamp": "2026-10-07T12:00:00Z"
    },
    {
        "from_address": "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
        "to_address": "0x28C6c06298d514Db089934071355E5743bf21d60",
        "tx_hash": "0x9999...0003",
        "amount": 9.80,
        "timestamp": "2026-10-08T12:00:00Z"
    }
]

def test_typology_engine_evaluation():
    engine = TypologyEngine(SYNTHETIC_TXS)
    res = engine.evaluate_all()

    assert res["risk_score"] > 0
    assert len(res["risk_indicators"]) >= 2
    assert len(res["limitations"]) == 3

    types = [ind["type"] for ind in res["risk_indicators"]]
    assert "PEELING_CHAIN" in types
    assert "RAPID_MOVEMENT" in types

def test_risk_evaluate_endpoint():
    payload = {
        "investigation_id": "i1111111-1111-1111-1111-111111111111",
        "transactions": SYNTHETIC_TXS,
        "address_labels": {
            "0x28C6c06298d514Db089934071355E5743bf21d60": "VASP_DEPOSIT"
        }
    }

    response = client.post("/analytics/risk/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["investigation_id"] == "i1111111-1111-1111-1111-111111111111"
    assert data["risk_score"] > 0
    assert "limitations" in data
