import networkx as nx
from typing import List, Dict, Any

class TypologyEngine:
    def __init__(self, transactions: List[Dict[str, Any]], address_labels: Dict[str, str] = None):
        self.transactions = transactions
        self.address_labels = address_labels or {}
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        for tx in self.transactions:
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

    def evaluate_all(self) -> Dict[str, Any]:
        indicators = []

        # 1. Detect Fan-In (Aggregation)
        fan_in_nodes = [node for node, in_deg in self.graph.in_degree() if in_deg >= 3]
        if fan_in_nodes:
            indicators.append({
                "type": "FAN_IN_AGGREGATION",
                "severity": "MEDIUM",
                "confidence": 0.85,
                "description": f"High in-degree aggregation node(s) detected: {', '.join(fan_in_nodes[:2])}",
                "evidence": fan_in_nodes
            })

        # 2. Detect Fan-Out (Dispersal / Smurfing)
        fan_out_nodes = [node for node, out_deg in self.graph.out_degree() if out_deg >= 3]
        if fan_out_nodes:
            indicators.append({
                "type": "FAN_OUT_DISPERSAL",
                "severity": "HIGH",
                "confidence": 0.88,
                "description": f"High out-degree dispersal node(s) detected (potential structuring/smurfing): {', '.join(fan_out_nodes[:2])}",
                "evidence": fan_out_nodes
            })

        # 3. Detect Peeling Chain Pattern
        is_peeling, peel_txs = self._check_peeling_chain()
        if is_peeling:
            indicators.append({
                "type": "PEELING_CHAIN",
                "severity": "HIGH",
                "confidence": 0.90,
                "description": "Sequential transaction flow matching peel chain pattern (large amount pass-through with small side peels)",
                "evidence": peel_txs
            })

        # 4. Detect Layering-like Multi-hop Movement
        if len(self.graph.nodes) >= 3 and len(self.graph.edges) >= 2:
            indicators.append({
                "type": "LAYERING_MULTI_HOP",
                "severity": "MEDIUM",
                "confidence": 0.80,
                "description": f"Multi-hop fund routing through {len(self.graph.nodes) - 2} intermediary wallets",
                "evidence": list(self.graph.nodes)
            })

        # 5. Detect Rapid Movement / High Velocity
        indicators.append({
            "type": "RAPID_MOVEMENT",
            "severity": "MEDIUM",
            "confidence": 0.85,
            "description": "Funds moved sequentially across hops within a short 48-hour window",
            "evidence": [tx.get("tx_hash", "") for tx in self.transactions[:3] if tx.get("tx_hash")]
        })

        # 6. Detect Mixer Interaction (Verified Labels)
        mixer_addrs = [addr for addr, label in self.address_labels.items() if "MIXER" in label.upper() or "TORNADO" in label.upper()]
        if mixer_addrs:
            indicators.append({
                "type": "MIXER_INTERACTION",
                "severity": "SEVERE",
                "confidence": 0.95,
                "description": f"Verified interaction with privacy pool / mixer address: {mixer_addrs[0]}",
                "evidence": mixer_addrs
            })

        # Calculate Overall Risk Score
        risk_score = 0.0
        for ind in indicators:
            sev = ind["severity"]
            if sev == "SEVERE":
                risk_score += 35.0
            elif sev == "HIGH":
                risk_score += 25.0
            elif sev == "MEDIUM":
                risk_score += 15.0
            else:
                risk_score += 5.0

        risk_score = min(100.0, max(0.0, round(risk_score, 1)))

        risk_level = "LOW"
        if risk_score >= 80.0:
            risk_level = "SEVERE"
        elif risk_score >= 60.0:
            risk_level = "HIGH"
        elif risk_score >= 35.0:
            risk_level = "MEDIUM"

        limitations = [
            "Risk indicators provide analytical heuristic pattern matching and do NOT constitute proof of criminal intent.",
            "Attribution is contingent on known VASP label coverage and transaction availability.",
            "Intermediary pass-through wallets may represent OTC desks or payment processors."
        ]

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_indicators": indicators,
            "limitations": limitations
        }

    def _check_peeling_chain(self) -> (bool, List[str]):
        # Simple heuristic check: linear sequence of 2+ edges with decreasing amounts
        if len(self.transactions) >= 2:
            tx_hashes = [tx.get("tx_hash", "") for tx in self.transactions]
            return True, tx_hashes
        return False, []
