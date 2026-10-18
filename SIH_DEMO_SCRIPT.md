# TRACE-X SIH 2026 Presentation & Demonstration Script
**Problem Statement SIH 26182: Explainable Cross-Chain VASP Attribution & Lawful Investigation Support Platform**
**Target Presentation Length:** 5 Minutes  
**Audience:** SIH Evaluation Panel, Law Enforcement Officers & Technical Jury

---

## Quick Demo Flow Overview

```
[0:00 - 0:30] Introduction & Problem Setup
[0:30 - 1:15] Investigation Start & Live Ingestion Progress (Steps 1-5)
[1:15 - 2:00] Interactive Transaction Graph (Step 6)
[2:00 - 2:45] PoAE Explainable Scoring & Evidence Chain (Steps 7-9)
[2:45 - 3:30] Risk Typologies & Cross-Chain Tracing (Steps 10-11)
[3:30 - 4:15] Investigation Copilot AI (Step 12)
[4:15 - 5:00] Forensic Report Package & SAHYOG Integration (Steps 13-14)
```

---

## Step-by-Step 5-Minute Presentation Script

### Minute 0:00 - 0:30 | Introduction & Problem Setup
- **Presenter Narrative**:
  > *"Respected Judges, welcome to TRACE-X — an explainable cross-chain VASP attribution and lawful law-enforcement investigation platform built for SIH 26182. Current blockchain analytics tools either act as black boxes or fail when criminals hop across blockchains or relay funds through pass-through peel chains. TRACE-X solves this by generating cryptographically grounded, court-admissible evidence packages while strictly separating verified facts from system inferences."*

- **Screen View**: Open TRACE-X Command Center Dashboard (`/`). Point to the top header **DEMO DATA** badge and LEA Investigator Auth Badge (`INSPECTOR_SHARMA`).

---

### Minute 0:30 - 1:15 | Starting Investigation & Live Progress (Steps 1–5)
- **Action**: Click **"Create New Case & Start Analysis"** on the Case Registry page (`/cases`).
- **Presenter Narrative**:
  > *"Let's initiate a live multi-hop transaction investigation. Step 1: We create an investigation record. Step 2: We input our suspect wallet address — `0x11111111...DEMO`. Step 3: We select our target network — Ethereum EVM. Step 4: We launch our 3-hop graph analysis."*

- **Action**: Click **"Start Analysis"**.
- **Screen View**: Live Progress Bar Modal opens (Step 5).
- **Presenter Narrative**:
  > *"Notice our live ingestion pipeline in action — processing hop by hop, fetching transactions, dual-writing wallet nodes and transaction edges synchronously to PostgreSQL and Neo4j graph databases."*

---

### Minute 1:15 - 2:00 | Interactive Cytoscape.js Transaction Graph (Step 6)
- **Screen View**: Redirects to `/investigations/inv-demo-investment-fraud-2026/graph`.
- **Action**: Click and drag graph nodes, zoom in on the suspect wallet and Binance deposit hot wallet. Click a node to highlight incoming and outgoing edges.
- **Presenter Narrative**:
  > *"Step 6: The system renders our interactive Cytoscape.js multi-hop transaction graph. Here we see Suspect Wallet A, relaying funds through intermediary wallets B and C, terminating at a verified Binance International deposit pool address. Notice the real-time hop and value filters at the top, along with our tap inspector."*

---

### Minute 2:00 - 2:45 | PoAE Explainable Scoring & Evidence Chain (Steps 7–9)
- **Action**: Click tab **"Proof of Attribution (PoAE)"** (`/attribution`).
- **Screen View**: Candidate VASP Attribution Scorecard (Step 7). Top Candidate: **Binance International (DEMO DATA)** — Evidence Strength: **95.4 / 100** (`STRONG_ASSOCIATION`).
- **Action**: Click **"Why this attribution?"** expandable accordion (Step 8).
- **Presenter Narrative**:
  > *"Step 7 & 8: Rather than returning an unexplained percentage, our Proof-of-Attribution Engine (PoAE) breaks down the exact mathematical basis:
  > • Direct Verified Label Strength: +30 pts
  > • Hop Distance: +10 pts
  > • Value-Flow Retention (96.8%): +19.4 pts
  > • Temporal Velocity (<4 hrs): +15 pts
  > Step 9: Down below, TRACE-X strictly segregates VERIFIED FACTS (immutable ledger records) from SYSTEM INFERENCES (heuristic flow metrics) and UNKNOWN INFORMATION (off-chain KYC)."*

---

### Minute 2:45 - 3:30 | Laundering Risk & Cross-Chain Tracing (Steps 10–11)
- **Action**: Click tab **"Risk & Typology Analysis"** (`/risk`).
- **Presenter Narrative**:
  > *"Step 10: Our Python NetworkX analytics microservice detects high-risk laundering typologies including Peeling Chains, High Velocity Transfers, and Multi-Hop Layering.
  > Step 11: Now let's switch to Scenario 2 — Cross-Chain Evasion. Clicking 'Load Demo Cross-Chain' shows an Ethereum origin wallet bridging funds via Stargate Finance protocol into TRON USDT, terminating at an OKX TRON Hot Wallet."*

- **Action**: Click **"Load Demo Investigation"** -> Select **Scenario 2: Cross-Chain Fraud Case**.

---

### Minute 3:30 - 4:15 | Grounded Investigation Copilot AI (Step 12)
- **Action**: Click tab **"Investigation Copilot AI"** (`/copilot`). Click preset prompt chip: `"Trace the funds from this wallet."`
- **Screen View**: Copilot streams grounded response with internal citations (`[REF: NODE-0x5555...]`, `[REF: TX-0xce11...]`).
- **Presenter Narrative**:
  > *"Step 12: Investigators can query our retrieval-grounded Investigation Copilot AI in natural language. Every single statement is strictly backed by internal evidence citations `[REF: ...]`. If data is missing or unverified, Copilot strictly responds: 'Insufficient evidence to establish this', preventing AI hallucinations."*

---

### Minute 4:15 - 5:00 | Forensic Report Generator & SAHYOG Integration (Steps 13–14)
- **Action**: Click tab **"Forensic Report Package"** (`/reports`). Click **"Download Printable PDF"**.
- **Presenter Narrative**:
  > *"Step 13: TRACE-X automatically compiles a 14-section court-admissible Forensic Investigation Report featuring a cryptographic SHA-256 evidence proof digest.
  > Step 14: Finally, on our SAHYOG Integration tab, investigators can prepare formal Section 91 CrPC legal disclosure and freeze request drafts. In full compliance with legal safeguards, automatic submissions are prohibited — requiring explicit investigator badge confirmation."*

- **Closing Statement**:
  > *"TRACE-X: Fast, transparent, explainable, and 100% compliant for SIH 26182. Thank you!"*

---

## Presentation Checklist & Key Labels

- [x] **VERIFIED**: Green badge for on-chain facts & confirmed VASP labels
- [x] **INFERRED**: Amber badge for heuristic graph metrics
- [x] **UNKNOWN**: Purple/Slate badge for unobserved off-chain data
- [x] **DEMO DATA**: Gold badge clearly marking synthetic demo scenario entities
