from fastapi.testclient import TestClient
from app.main import app
from app.services.graph_analyzer import GraphAnalyzer

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

def test_networkx_graph_analyzer():
    analyzer = GraphAnalyzer(SYNTHETIC_TXS)

    source = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    target = "0x28C6c06298d514Db089934071355E5743bf21d60"

    shortest_path = analyzer.find_shortest_path(source, target)
    assert shortest_path == [
        "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "0x3a4b9982cd11093e098dfb751b7401b5f6d89999",
        "0x8f2c1144882a1100998dfb751b7401b5f6d88888",
        "0x28C6c06298d514Db089934071355E5743bf21d60"
    ]

    metrics = analyzer.calculate_path_metrics(shortest_path)
    assert metrics["hop_count"] == 3
    assert len(metrics["intermediary_wallets"]) == 2
    assert metrics["value_retention_ratio"] == 0.98

def test_graph_analyze_endpoint():
    payload = {
        "investigation_id": "i1111111-1111-1111-1111-111111111111",
        "starting_wallet": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        "target_wallet": "0x28C6c06298d514Db089934071355E5743bf21d60",
        "max_hops": 4,
        "min_transfer_threshold": 0.1,
        "transactions": SYNTHETIC_TXS
    }

    response = client.post("/analytics/graph/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["investigation_id"] == "i1111111-1111-1111-1111-111111111111"
    assert data["shortest_path_hops"] == 3
    assert data["total_paths_found"] == 1
    assert data["path_metrics"]["value_retention_ratio"] == 0.98
