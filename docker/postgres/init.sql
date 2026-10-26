-- TRACE-X PostgreSQL Initial Schema Setup
-- Cross-Chain VASP Attribution & Investigation Engine

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users / Investigators
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    agency_name VARCHAR(255) NOT NULL,
    badge_number VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'INVESTIGATOR', -- ADMIN, INVESTIGATOR, AUDITOR
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cases
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_investigator_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, CLOSED, ARCHIVED
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Investigations
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    suspect_address VARCHAR(255) NOT NULL,
    blockchain VARCHAR(50) NOT NULL, -- ethereum, tron, bitcoin, etc.
    depth_hops INT NOT NULL DEFAULT 3,
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED', -- QUEUED, RUNNING, COMPLETED, FAILED
    risk_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Known VASP & Entity Intelligence Database
CREATE TABLE IF NOT EXISTS vasp_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vasp_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- EXCHANGE, MIXER, HIGH_RISK, OTC, SANCTIONED, DEFI, UNKNOWN
    jurisdiction VARCHAR(100),
    compliance_contact TEXT,
    risk_tier VARCHAR(20) DEFAULT 'LOW', -- LOW, MEDIUM, HIGH, SEVERE
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Known Wallet Address Labels
CREATE TABLE IF NOT EXISTS vasp_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vasp_id UUID REFERENCES vasp_entities(id) ON DELETE CASCADE,
    blockchain VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    label_name VARCHAR(255) NOT NULL,
    label_type VARCHAR(50) NOT NULL, -- DEPOSIT_HOT_WALLET, COLD_WALLET, ROUTER, INTERMEDIARY
    confidence VARCHAR(30) NOT NULL DEFAULT 'VERIFIED', -- VERIFIED, STRONG_ASSOCIATION, INFERRED_ASSOCIATION
    source VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_blockchain_address UNIQUE(blockchain, address)
);

-- Evidence & Attribution Proof Records
CREATE TABLE IF NOT EXISTS attributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
    suspect_address VARCHAR(255) NOT NULL,
    candidate_vasp_id UUID REFERENCES vasp_entities(id),
    attribution_category VARCHAR(50) NOT NULL, -- VERIFIED_LABEL, STRONG_ASSOCIATION, INFERRED_ASSOCIATION, UNKNOWN
    evidence_score NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
    uncertainty_score NUMERIC(5,2) NOT NULL, -- 0.00 to 100.00
    hop_distance INT NOT NULL,
    value_flow_usd NUMERIC(18,2) DEFAULT 0.00,
    path_tx_hashes TEXT[] NOT NULL,
    explanation TEXT NOT NULL,
    analysis_version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit & Provenance Trail (Lawful Chain of Custody)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
