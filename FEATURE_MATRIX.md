# TRACE-X Feature & Requirement Matrix
**Explainable Cross-Chain VASP Attribution & Lawful Investigation Engine**

---

## Complete Requirement Mapping

| # | Mandated Requirement | Implementation Component | Implementation Details & Controls | Status |
|---|---|---|---|---|
| **1** | Multi-Blockchain Support (EVM, TRON, BTC, Polygon, Solana) | `pkg/connector` Provider Factory | Abstraction interfaces for Ethereum RPC, TronGrid API, Blockstream BTC & synthetic fallback connectors. | `IMPLEMENTED & VERIFIED` |
| **2** | Wallet Address Validation | `connector.ValidateAddress` | Format verification for EVM (`0x` + 40 hex) and TRON (`T` + 33 base58). Rejects malformed strings. | `IMPLEMENTED & VERIFIED` |
| **3** | Parallel Multi-Hop Graph Traversal | `service.IngestionService` | Recursive async pipeline with configurable depth hops (1-5), rate-limit backoff, and dual-writing (Postgres & Neo4j). | `IMPLEMENTED & VERIFIED` |
| **4** | Interactive Graph Visualizer | `components/CytoscapeGraph` | Cytoscape.js canvas with zoom, pan, path highlighting, hop/value/timestamp filtering, node search, and tap inspector. | `IMPLEMENTED & VERIFIED` |
| **5** | VASP & Entity Intelligence Registry | `service.IntelligenceService` | Known VASP deposit pool registry, risk tiers (`LOW`, `MEDIUM`, `HIGH`, `SEVERE`), and verified label lookup. | `IMPLEMENTED & VERIFIED` |
| **6** | Proof-of-Attribution Engine (PoAE) | `pkg/attribution` Engine | Transparent 8-dimensional scoring algorithm (0-100 scale) with explicit ambiguity penalties and classification levels. | `IMPLEMENTED & VERIFIED` |
| **7** | Explainable Attribution UI | `components/AttributionPanel` | Expandable "Why this attribution?" accordion breakdown displaying feature score weights and confidence basis. | `IMPLEMENTED & VERIFIED` |
| **8** | Laundering Risk & Typology Engine | `analytics/` NetworkX Service | Pattern detection for peeling chains, rapid movement, layering, high transaction velocity, bridge interactions, and mixers. | `IMPLEMENTED & VERIFIED` |
| **9** | Cross-Chain Intelligence Abstraction | `model.CrossChainEvent` | Standardized cross-chain event edge abstraction (`source_chain`, `destination_chain`, `bridge_service`, `verification_status`). Defaults to `UNKNOWN` when unproven. | `IMPLEMENTED & VERIFIED` |
| **10** | Retrieval-Grounded Investigation Copilot AI | `service.CopilotService` | RAG assistant strictly grounded in database records & graph context. Emits `[REF: ...]` citations. Emits "Insufficient evidence to establish this" on unverified data. | `IMPLEMENTED & VERIFIED` |
| **11** | 14-Section Forensic Investigation Report | `service.ReportService` | Court-admissible investigation report package with SHA-256 evidence proof digest and printable PDF export. | `IMPLEMENTED & VERIFIED` |
| **12** | SAHYOG Lawful Integration Adapter | `pkg/sahyog` Client & UI | Section 91 CrPC legal disclosure & freeze draft generation with mandatory investigator badge badge & checkbox confirmation modal. | `IMPLEMENTED & VERIFIED` |
| **13** | Security Hardening & RBAC | `internal/middleware` | JWT auth, salted HMAC-SHA256 password hashing, RBAC (`ADMIN`, `INVESTIGATOR`, `SUPERVISOR`, `AUDITOR`), case authorization scoping, OWASP security headers, rate limiting & secret redaction. | `IMPLEMENTED & VERIFIED` |
| **14** | Controlled Demonstration Mode | `service.DemoService` | Deterministic synthetic investment fraud (Scenario 1) and cross-chain fraud (Scenario 2) loaders for repeatable demonstrations. | `IMPLEMENTED & VERIFIED` |

---

## Fact vs Inference vs Unknown Legal Segregation Standard

TRACE-X enforces strict evidential segregation across all UI views and generated reports:

- **VERIFIED (FACT)**: Immutable on-chain ledger data, block numbers, transaction hashes, timestamps, and verified VASP registry hot wallet labels.
- **INFERRED (HEURISTIC)**: Multi-hop graph traversal metrics, value retention ratios, peeling chain pattern detection, and PoAE probability scores.
- **UNKNOWN**: Unobserved off-chain identities, internal exchange sub-ledgers, and unlinked cross-chain transfers.
- **DEMO DATA**: Synthetic entities, wallets, and transactions constructed for forensic evaluation.
