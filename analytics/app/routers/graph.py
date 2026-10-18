from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.services.graph_analyzer import GraphAnalyzer

router = APIRouter()

TxItem = Dict[str, Any]

class GraphAnalysisRequest(BaseModel):
    investigation_id: str
    starting_wallet: str
    target_wallet: Optional[str] = None
    max_hops: int = 4
    min_transfer_threshold: float = 0.0
    transactions: List[Dict[str, Any]]

class GraphAnalysisResponse(BaseModel):
    investigation_id: str
    starting_wallet: str
    shortest_path: Optional[List[str]] = None
    shortest_path_hops: int = 0
    all_paths: List[List[str]] = []
    total_paths_found: int = 0
    path_metrics: Optional[Dict[str, Any]] = None
    centrality_metrics: Dict[str, float] = {}

@router.post("/analytics/graph/analyze", response_model=GraphAnalysisResponse)
@router.post("/api/v1/graph/analyze", response_model=GraphAnalysisResponse)
def analyze_graph(req: GraphAnalysisRequest):
    analyzer = GraphAnalyzer(req.transactions)

    shortest_path = None
    shortest_path_hops = 0
    all_paths = []
    path_metrics = None

    if req.target_wallet:
        shortest_path = analyzer.find_shortest_path(req.starting_wallet, req.target_wallet)
        if shortest_path:
            shortest_path_hops = len(shortest_path) - 1
            path_metrics = analyzer.calculate_path_metrics(shortest_path)
        all_paths = analyzer.find_all_paths(req.starting_wallet, req.target_wallet, max_hops=req.max_hops)

    centrality = analyzer.compute_centrality_metrics()

    return GraphAnalysisResponse(
        investigation_id=req.investigation_id,
        starting_wallet=req.starting_wallet,
        shortest_path=shortest_path,
        shortest_path_hops=shortest_path_hops,
        all_paths=all_paths,
        total_paths_found=len(all_paths),
        path_metrics=path_metrics,
        centrality_metrics=centrality
    )
