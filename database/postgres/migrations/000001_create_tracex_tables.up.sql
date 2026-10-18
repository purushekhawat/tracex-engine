-- TRACE-X PostgreSQL Migration 000001 UP
-- SIH 26182 - Explainable Cross-Chain VASP Attribution & Investigation Engine Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Blockchains Table
CREATE TABLE IF NOT EXISTS blockchains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_symbol VARCHAR(20) NOT NULL,
    chain_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Assets Table (Native & Token Contracts)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blockchain_id UUID NOT NULL REFERENCES blockchains(id) ON DELETE CASCADE,
    symbol VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    contract_address VARCHAR(255),
    decimals INT NOT NULL DEFAULT 18,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_blockchain_asset_contract UNIQUE (blockchain_id, symbol, contract_address)
);

-- 3. Users Table (LEA Investigators)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    agency_name VARCHAR(255) NOT NULL,
    badge_number VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'INVESTIGATOR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cases Table
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_investigator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Investigations Table
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    suspect_address VARCHAR(255) NOT NULL,
    blockchain_id UUID NOT NULL REFERENCES blockchains(id) ON DELETE RESTRICT,
    depth_hops INT NOT NULL DEFAULT 3,
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
    risk_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blockchain_id UUID NOT NULL REFERENCES blockchains(id) ON DELETE RESTRICT,
    address VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(50) DEFAULT 'UNKNOWN',
    first_seen_at TIMESTAMP WITH TIME ZONE,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    balance_native NUMERIC(36,18) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_blockchain_wallet_address UNIQUE (blockchain_id, address)
);

-- 7. Entities Table
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(100),
    risk_tier VARCHAR(20) DEFAULT 'LOW',
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. VASPs Table
CREATE TABLE IF NOT EXISTS vasps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID UNIQUE NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    vasp_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    compliance_email VARCHAR(255),
    legal_country VARCHAR(100),
    is_registered BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    blockchain_id UUID NOT NULL REFERENCES blockchains(id) ON DELETE RESTRICT,
    address_string VARCHAR(255) NOT NULL,
    entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
    vasp_id UUID REFERENCES vasps(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_blockchain_address_string UNIQUE (blockchain_id, address_string)
);

-- 10. Address Labels Table
CREATE TABLE IF NOT EXISTS address_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
    label_name VARCHAR(255) NOT NULL,
    label_type VARCHAR(50) NOT NULL,
    confidence VARCHAR(30) NOT NULL DEFAULT 'VERIFIED',
    source VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blockchain_id UUID NOT NULL REFERENCES blockchains(id) ON DELETE RESTRICT,
    tx_hash VARCHAR(255) NOT NULL,
    from_wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    to_wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    amount NUMERIC(36,18) NOT NULL DEFAULT 0,
    amount_usd NUMERIC(18,2) DEFAULT 0,
    fee_native NUMERIC(36,18) DEFAULT 0,
    block_number BIGINT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) DEFAULT 'SUCCESS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT idx_blockchain_tx_hash UNIQUE (blockchain_id, tx_hash)
);

-- 12. Evidence Items Table
CREATE TABLE IF NOT EXISTS evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    evidence_type VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Attribution Results Table
CREATE TABLE IF NOT EXISTS attribution_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    suspect_address VARCHAR(255) NOT NULL,
    candidate_vasp_id UUID REFERENCES vasps(id) ON DELETE SET NULL,
    attribution_category VARCHAR(50) NOT NULL,
    evidence_score NUMERIC(5,2) NOT NULL,
    uncertainty_score NUMERIC(5,2) NOT NULL,
    hop_distance INT NOT NULL,
    value_flow_usd NUMERIC(18,2) DEFAULT 0.00,
    path_tx_hashes TEXT[] NOT NULL,
    explanation TEXT NOT NULL,
    analysis_version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Risk Assessments Table
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    overall_risk_score NUMERIC(5,2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    typologies_detected TEXT[] NOT NULL,
    findings_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Investigation Reports Table
CREATE TABLE IF NOT EXISTS investigation_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    report_number VARCHAR(100) UNIQUE NOT NULL,
    generated_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    report_hash VARCHAR(255) NOT NULL,
    pdf_path VARCHAR(512),
    json_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Audit Logs Table (Lawful Evidence Provenance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
CREATE INDEX IF NOT EXISTS idx_investigations_case_id ON investigations(case_id);
CREATE INDEX IF NOT EXISTS idx_investigations_suspect ON investigations(suspect_address);
CREATE INDEX IF NOT EXISTS idx_attributions_investigation ON attribution_results(investigation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
