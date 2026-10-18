import networkx as nx
from typing import List, Dict, Any, Optional

class GraphAnalyzer:
    def __init__(self, transactions: List[Dict[str, Any]]):
        self.graph = nx.DiGraph()
        self._build_graph(transactions)

    def _build_graph(self, transactions: List[Dict[str, Any]]):
        for tx in transactions:
            from_addr = tx["from_address"]
            to_addr = tx["to_address"]
            amount = float(tx.get("amount", 0.0))
            tx_hash = tx.get("tx_hash", "")
            timestamp = tx.get("timestamp", "")

            self.graph.add_node(from_addr)
            self.graph.add_node(to_addr)
            self.graph.add_edge(
                from_addr,
                to_addr,
                amount=amount,
                tx_hash=tx_hash,
                timestamp=timestamp
            )

    def find_shortest_path(self, source: str, target: str) -> Optional[List[str]]:
        try:
            return nx.shortest_path(self.graph, source=source, target=target)
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return None

    def find_all_paths(self, source: str, target: str, max_hops: int = 4) -> List[List[str]]:
        try:
            return list(nx.all_simple_paths(self.graph, source=source, target=target, cutoff=max_hops))
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []

    def calculate_path_metrics(self, path: List[str]) -> Dict[str, Any]:
        if not path or len(path) < 2:
            return {}

        hop_count = len(path) - 1
        intermediaries = path[1:-1]
        tx_hashes = []
        total_amount_received = 0.0
        initial_sent = 0.0

        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            edge_data = self.graph.get_edge_data(u, v)
            if edge_data:
                amt = edge_data.get("amount", 0.0)
                if i == 0:
                    initial_sent = amt
                if i == len(path) - 2:
                    total_amount_received = amt
                tx_hashes.append(edge_data.get("tx_hash", ""))

        retention_ratio = 0.0
        if initial_sent > 0:
            retention_ratio = min(1.0, round(total_amount_received / initial_sent, 4))

        return {
            "hop_count": hop_count,
            "intermediary_wallets": intermediaries,
            "path_tx_hashes": tx_hashes,
            "initial_sent": initial_sent,
            "amount_received": total_amount_received,
            "value_retention_ratio": retention_ratio
        }

    def compute_centrality_metrics(self) -> Dict[str, float]:
        if len(self.graph) == 0:
            return {}
        degree = nx.degree_centrality(self.graph)
        return {node: round(score, 4) for node, score in degree.items()}
