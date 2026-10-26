# TRACE-X
### Explainable Cross-Chain VASP Attribution & Investigation Engine

> **Core Mission**: Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs.

---

## 🎯 Overview

**TRACE-X** is a law-enforcement focused blockchain analytics and attribution engine. It accepts suspect cryptocurrency wallets across chains (Ethereum, TRON, and future extensible blockchains), traces transaction flows across multi-hop paths, identifies known VASP deposit/withdrawal infrastructure, calculates explainable evidence-strength scores, detects laundering typologies (peel chains, structuring, mixer interactions), and outputs forensic court-ready reports.

---

## 🏗️ Architecture Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Cytoscape.js
- **Backend**: Go (REST API, SSE streaming, multi-chain pipeline)
- **Analytics**: Python Microservice (NetworkX/igraph, ML heuristics, risk scoring)
- **Databases**:
  - **PostgreSQL 16**: Cases, user profiles, audit trail, normalized transactions
  - **Neo4j 5**: Graph store for multi-hop path traversal & entity clustering
  - **Redis 7**: Cache, rate limiting, and async job state

---

## 🚀 Quick Start & Commands

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Launch Backing Services (Docker Compose)
Start PostgreSQL, Neo4j, and Redis:
```bash
docker-compose up -d
```

### 3. Verify Container Health
Check if services are running properly:
```bash
docker-compose ps
```

- **PostgreSQL**: `localhost:5432` (User: `tracex`, DB: `tracex_db`)
- **Neo4j Browser**: `http://localhost:7474` (User: `neo4j`, Password: `tracex_neo4j_secret`)
- **Redis**: `localhost:6379`

---

## 📚 Project Documentation

- [ARCHITECTURE.md](file:///c:/Users/mailp/OneDrive/Desktop/CyberSetu2/ARCHITECTURE.md) - Deep dive into system modules, scoring formula, Neo4j schema, and LEA guardrails.
- [DEVELOPMENT_PLAN.md](file:///c:/Users/mailp/OneDrive/Desktop/CyberSetu2/DEVELOPMENT_PLAN.md) - Phased roadmap, deliverables, and implementation milestones.
- [.env.example](file:///c:/Users/mailp/OneDrive/Desktop/CyberSetu2/.env.example) - Complete environment settings template.
- [docker-compose.yml](file:///c:/Users/mailp/OneDrive/Desktop/CyberSetu2/docker-compose.yml) - Container setup for PostgreSQL, Neo4j, and Redis.

---

## ⚖️ Legal & Security Compliance
TRACE-X is strictly a read-only investigation support platform. It **does not** contain private key handling, signing algorithms, token execution, trading, or wallet access capabilities. All queries are audited for legal provenance and chain of custody.
