# TRACE-X: Development & Implementation Plan
## Phased Execution Strategy (SIH 2026 - Problem Statement 26182)

---

## 📅 Roadmap Overview

```
Phase 1: Architecture & Infra Setup (Completed)
 └── Phase 2: Data Models & Synthetic Provider Layer
      └── Phase 3: Go Backend Core API & Chain Connectors
           └── Phase 4: Neo4j Graph Engine & Multi-hop Traversal
                └── Phase 5: Python Analytics & Scoring Engine
                     └── Phase 6: LEA Investigator Dashboard (Cytoscape.js)
                          └── Phase 7: Forensic Report & Audit Provenance
                               └── Phase 8: SAHYOG Integration & Final Polish
```

---

## Phase 1: Architecture & Infrastructure Setup 🟢 (Current Phase)
- [x] Inspect workspace and confirm empty state.
- [x] Establish target directory layout (Frontend, Backend, Analytics, Docker).
- [x] Define system architecture and technical specs (`ARCHITECTURE.md`).
- [x] Setup `.env.example` with database, RPC, and mock configuration keys.
- [x] Configure `docker-compose.yml` for PostgreSQL 16, Neo4j 5 (APOC), and Redis 7.
- [x] Write PostgreSQL initial relational database schema (`docker/postgres/init.sql`).

---

## Phase 2: Core Data Models & Synthetic Dataset Provider ⏳
- **Target Deliverables**:
  - Go domain models (`internal/model/`) for Cases, Investigations, Attributions, Transactions, VASP Labels.
  - Python graph models (`analytics-service/app/models.py`).
  - Synthetic Data Generator (`backend/internal/connector/synthetic/`):
    - Synthetic Ethereum & TRON transaction generator.
    - Pre-populated VASP label database (Binance, WazirX, CoinDCX, Kraken, Tornado Cash mock labels).
    - Multi-hop peel chain & structuring synthetic scenarios for testing.

---

## Phase 3: Go Core Backend API & Chain Connectors ⏳
- **Target Deliverables**:
  - Go REST API server setup (Gin/Fiber or standard `net/http` router).
  - Healthcheck endpoints (`/health`, `/ready`).
  - JWT Authentication & LEA Role-Based Access Control (RBAC).
  - `BlockchainConnector` Interface:
    - `EthereumConnector` (Etherscan API / RPC client).
    - `TronConnector` (TronGrid API client).
    - `SyntheticConnector` (Fallback for dev/offline demo).
  - Transaction Normalization Pipeline (normalizes native + ERC20/TRC20 token transfers into a unified schema).

---

## Phase 4: Neo4j Graph Engine & Multi-hop Traversal ⏳
- **Target Deliverables**:
  - Neo4j driver initialization in Go backend.
  - Cypher query builder for graph ingestion:
    - Nodes: `(:Address {address, chain, label, entity, is_vasp})`
    - Edges: `[:TRANSFERRED {tx_hash, value, token, timestamp}]`
  - Multi-hop graph traversal algorithm ($\le N$ hops).
  - Candidate VASP matching query (identifying nearest downstream/upstream VASP deposit addresses).

---

## Phase 5: Python Graph Analytics & Evidence-Strength Scoring Engine ⏳
- **Target Deliverables**:
  - FastAPI python microservice container (`analytics-service/`).
  - Graph algorithms using NetworkX/igraph:
    - Shortest path & flow weight calculation.
    - Peel chain detection algorithm.
    - Smurfing / structuring heuristics.
  - Proof-of-Attribution Scorer:
    - Multi-factor score computation (Hop distance decay, volume ratio, temporal recency, clustering).
    - Uncertainty estimation ($0 - 100\%$).
    - Natural language attribution explanation generator.

---

## Phase 6: LEA Investigator Dark Dashboard & Cytoscape Graph Visualizer ⏳
- **Target Deliverables**:
  - React + TypeScript + Vite app initialization.
  - Tailwind CSS + shadcn/ui setup with Cyber Dark LEA theme (slate/navy palette with vibrant status colors).
  - Cytoscape.js interactive graph component:
    - Custom node icons for Wallets, VASPs, Mixers, and Contracts.
    - Edge thickness based on transaction value.
    - Interactive node expansion (fetching next hop on click).
  - Case Overview & Suspect Wallet Investigation views.

---

## Phase 7: Forensic Report Generator & Audit Provenance ⏳
- **Target Deliverables**:
  - Executive forensic report generator (PDF & JSON export).
  - Proof of Attribution summary breakdown table.
  - Cryptographic hash signature on generated report for legal court admissibility.
  - Immutable LEA Audit Log system tracking all investigator activities.

---

## Phase 8: SAHYOG Integration Abstraction & Final Validation ⏳
- **Target Deliverables**:
  - SAHYOG abstraction layer interface for Indian LEA inter-agency intelligence exchange.
  - End-to-end integration test with synthetic suspect wallets.
  - Verification of non-custodial / read-only security constraints.
  - Final documentation update and demo walk-through guide.
