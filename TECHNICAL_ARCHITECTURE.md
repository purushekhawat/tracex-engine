# TRACE-X Technical Architecture Document
**Explainable Cross-Chain VASP Attribution & Lawful Investigation Engine**

---

## 1. High-Level System Architecture Topology

```
+---------------------------------------------------------------------------------+
|                                 FRONTEND WORKSPACE                              |
|                   Vite + React + TypeScript + TailwindCSS                       |
|   +-------------------+  +--------------------+  +--------------------------+   |
|   | Cytoscape.js      |  | PoAE Attribution   |  | RAG Copilot Chat         |   |
|   | Graph Visualizer  |  | Evidence Scorecard |  | Interactive Assistant    |   |
|   +-------------------+  +--------------------+  +--------------------------+   |
|   +-------------------+  +--------------------+  +--------------------------+   |
|   | 14-Section Report |  | SAHYOG Disclosure  |  | Controlled Demo Loader   |   |
|   | PDF Generator     |  | CrPC Sec 91 Adapter|  | Scenario 1 & Scenario 2  |   |
|   +-------------------+  +--------------------+  +--------------------------+   |
+----------------------------------------+----------------------------------------+
                                         | REST / JSON APIs (HTTPS / JWT Auth)
                                         v
+---------------------------------------------------------------------------------+
|                               TRACEX BACKEND ENGINE                             |
|                                    Go (1.22+)                                   |
|   +-------------------------------------------------------------------------+   |
|   | Security & Compliance Pipeline                                          |   |
|   | - JWT Auth & Salted Password Hash  - IP Token Bucket Rate Limiter       |   |
|   | - RBAC (ADMIN/INVESTIGATOR/etc.)  - Secret Redaction Audit Logger       |   |
|   | - OWASP Security Headers          - Input Sanitization (XSS / SQLi)    |   |
|   +-------------------------------------------------------------------------+   |
|   +--------------------+  +--------------------+  +-------------------------+   |
|   | Multi-Hop Ingestion|  | PoAE Scoring       |  | Report Engine           |   |
|   | Async Pipeline     |  | Evaluation Engine  |  | SHA-256 Digest Proof    |   |
|   +--------------------+  +--------------------+  +-------------------------+   |
|   +--------------------+  +--------------------+  +-------------------------+   |
|   | SAHYOG Adapter     |  | Demo Service       |  | Connector Provider      |   |
|   | Sec 91 CrPC Drafts |  | Scenario Seeders   |  | Factory (EVM/TRON/BTC)  |   |
|   +--------------------+  +--------------------+  +-------------------------+   |
+-------------------+------------------------------------+------------------------+
                    |                                    |
                    v                                    v
+-------------------+--------------------+  +------------+------------------------+
|           DATA STORAGE LAYER           |  |      PYTHON ANALYTICS MICROSERVICE     |
| - PostgreSQL: Cases & Audits           |  |               Python 3.11              |
| - Neo4j: Multi-hop Transaction Graph   |  | - NetworkX Typology Engine             |
| - Memory Caches: Transient Pipelines   |  | - Peeling Chain & Velocity Analytics   |
+----------------------------------------+  +----------------------------------------+
```

---

## 2. Core Service Modules & Package Breakdown

### 2.1 Backend Core (`backend/`)
- `pkg/attribution`: Implements `PoAEEngine` evaluating candidate VASP attributions using an 8-dimensional weighted scoring model.
- `pkg/auth`: JWT generation, claim parsing, salted HMAC-SHA256 password hashing.
- `pkg/audit`: Structured JSON audit logger with regex-based automatic secret redaction.
- `pkg/sahyog`: `SahyogClient` interface and `MockSahyogClient` generating CrPC Section 91 disclosure and freeze request drafts.
- `internal/connector`: Provider Factory registering EVM, TRON, BTC, and synthetic mock blockchain RPC connectors.
- `internal/service`: Ingestion pipeline (`IngestionService`), graph traversal (`GraphTraversalService`), intelligence registry (`IntelligenceService`), report compiler (`ReportService`), RAG copilot (`CopilotService`), and demo seeder (`DemoService`).
- `internal/middleware`: OWASP headers, rate limiting, JWT auth, RBAC role check (`RequireRole`), and case access scoping (`RequireCaseAccess`).

### 2.2 Python Graph Analytics Microservice (`analytics/`)
- `analytics/typology_engine.py`: NetworkX graph algorithms detecting peeling chain heuristics, multi-hop layering ratios, flow velocity, and bridge interactions.
- `analytics/graph_analyzer.py`: Directed multi-graph construction and path retention ratio calculations.

### 2.3 Frontend Application (`frontend/`)
- `components/CytoscapeGraph.tsx`: Cytoscape.js canvas rendering directed multigraphs with node styling, zoom controls, and inspector drawer.
- `components/AttributionPanel.tsx`: PoAE evidence scorecard with 11 mandatory dimensions and "Why this attribution?" breakdown.
- `components/InvestigationCopilot.tsx`: Grounded AI chat assistant emitting internal citations (`[REF: ...]`).
- `components/ReportViewer.tsx`: 14-section court-admissible forensic report viewer with SHA-256 evidence digest and PDF download.
- `components/SahyogIntegrationPanel.tsx`: SAHYOG disclosure request draft viewer with investigator confirmation guard modal.
- `components/DemoLoaderModal.tsx`: Controlled demonstration mode loader for Scenario 1 (Investment Fraud) and Scenario 2 (Cross-Chain Fraud).

---

## 3. Mathematical Scoring Model (PoAE Engine)

The Proof-of-Attribution Engine (PoAE) calculates an explainable evidence score \( S \in [0.0, 100.0] \) for each candidate VASP:

\[
S = \min\Big(100.0, \, \max\big(0.0, \, S_{\text{label}} + S_{\text{hop}} + S_{\text{flow}} + S_{\text{temporal}} + S_{\text{recurrence}} + S_{\text{cluster}} + S_{\text{cross\_chain}} - P_{\text{ambiguity}}\big)\Big)
\]

### Dimension Weights:
1. **Label Strength (\( S_{\text{label}} \))**:
   - `VERIFIED`: +30.0 pts
   - `INFERRED`: +15.0 pts
2. **Hop Distance (\( S_{\text{hop}} \))**:
   - 1 Hop: +15.0 pts
   - 2 Hops: +12.5 pts
   - 3 Hops: +10.0 pts
   - 4 Hops: +7.5 pts
   - 5 Hops: +5.0 pts
3. **Value-Flow Continuity (\( S_{\text{flow}} \))**:
   - \( 20.0 \times \text{retention\_ratio} \) (up to +20.0 pts)
4. **Temporal Proximity (\( S_{\text{temporal}} \))**:
   - \( \le 6\text{h} \): +15.0 pts
   - \( \le 24\text{h} \): +12.0 pts
   - \( \le 72\text{h} \): +8.0 pts
5. **Transaction Recurrence (\( S_{\text{recurrence}} \))**:
   - Up to +10.0 pts based on recurring flow count.
6. **Co-Spending Cluster Association (\( S_{\text{cluster}} \))**:
   - +15.0 pts if candidate is co-input/co-cluster matched.
7. **Cross-Chain Linkage Evidence (\( S_{\text{cross\_chain}} \))**:
   - +10.0 pts for verified cross-chain bridge events.
8. **Ambiguity Penalty (\( P_{\text{ambiguity}} \))**:
   - Up to -25.0 pts penalty for Tornado Cash / mixer interactions or high hop count decay.

### Classification Boundaries:
- \( S \ge 80.0 \): `STRONG_ASSOCIATION`
- \( 60.0 \le S < 80.0 \): `MODERATE_ASSOCIATION`
- \( 40.0 \le S < 60.0 \): `WEAK_ASSOCIATION`
- \( S < 40.0 \): `INCONCLUSIVE`

---

## 4. Security Controls & Defensive Architecture

1. **Authentication & Password Hashing**: Salted HMAC-SHA256 digest hashing with constant-time equality comparisons (`subtle.ConstantTimeCompare`) to prevent timing attacks.
2. **Role-Based Access Control (RBAC)**: Fine-grained permission guards for `ADMIN`, `INVESTIGATOR`, `SUPERVISOR`, and `AUDITOR`.
3. **Case Authorization Scoping**: `RequireCaseAccess` middleware ensuring `INVESTIGATOR` users can only access endpoints associated with explicitly assigned `case_id` values.
4. **Injection Defenses**: Parameterized SQL queries (`$1, $2`) for PostgreSQL and parameterized Cypher queries (`$address, $limit`) for Neo4j.
5. **Rate Limiting**: Token-bucket IP rate limiter (`TokenBucketRateLimiter`) protecting all API routes against brute-force and DDoS attempts.
6. **OWASP Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Content-Security-Policy`, `HSTS`, `Referrer-Policy`.
7. **Audit Log Secret Redaction**: Automatic regex redaction filter replacing passwords, Bearer tokens, and private keys with `[REDACTED]`.
