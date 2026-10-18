-- TRACE-X Synthetic Demo Seed Data
-- Clearly labelled synthetic data for development and demonstration testing

-- 1. Blockchains
INSERT INTO blockchains (id, code, name, native_symbol, chain_id, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'ethereum', 'Ethereum Mainnet', 'ETH', '1', TRUE),
('22222222-2222-2222-2222-222222222222', 'tron', 'TRON Network', 'TRX', '728126428', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 2. Assets
INSERT INTO assets (id, blockchain_id, symbol, name, contract_address, decimals) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ETH', 'Ether', NULL, 18),
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'USDT', 'Tether USD (ERC20)', '0xdac17f958d2ee523a2206206994597c13d831ec7', 6),
('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'TRX', 'TRON', NULL, 6),
('a4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'USDT', 'Tether USD (TRC20)', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', 6)
ON CONFLICT (blockchain_id, symbol, contract_address) DO NOTHING;

-- 3. Users (LEA Officers)
INSERT INTO users (id, username, email, password_hash, agency_name, badge_number, role) VALUES
('u1111111-1111-1111-1111-111111111111', 'inspector_sharma', 'sharma@cybercell.gov.in', '$2a$12$e09L9a1xn6n3v9z8k1w.e.O3H8.3u2K1U2L1K2L1K2L1K2L1K2L1K', 'State Cyber Crime Cell', 'LEA-8849', 'INVESTIGATOR')
ON CONFLICT (username) DO NOTHING;

-- 4. Cases
INSERT INTO cases (id, case_number, title, description, assigned_investigator_id, status, priority, tags) VALUES
('c1111111-1111-1111-1111-111111111111', 'CASE-2026-001', 'Operation DarkFlow - Cross-Chain Laundering', 'Synthetic investigation tracking ransomware payload dispersal through multi-hop peel chains to VASP deposit infrastructure.', 'u1111111-1111-1111-1111-111111111111', 'IN_PROGRESS', 'HIGH', ARRAY['ransomware', 'peel-chain', 'vasp-attribution'])
ON CONFLICT (case_number) DO NOTHING;

-- 5. Entities & VASPs
INSERT INTO entities (id, entity_code, name, category, jurisdiction, risk_tier, verified) VALUES
('e1111111-1111-1111-1111-111111111111', 'VASP_BINANCE', 'Binance International', 'EXCHANGE', 'Cayman Islands', 'LOW', TRUE),
('e2222222-2222-2222-2222-222222222222', 'VASP_COINDCX', 'CoinDCX India', 'EXCHANGE', 'India', 'LOW', TRUE),
('e3333333-3333-3333-3333-333333333333', 'VASP_WAZIRX', 'WazirX India', 'EXCHANGE', 'India', 'LOW', TRUE),
('e4444444-4444-4444-4444-444444444444', 'MIXER_TORNADO', 'Tornado Cash Protocol', 'MIXER', 'Decentralized', 'SEVERE', TRUE)
ON CONFLICT (entity_code) DO NOTHING;

INSERT INTO vasps (id, entity_id, vasp_name, license_number, compliance_email, legal_country, is_registered) VALUES
('v1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Binance Exchange', 'VASP-REG-8820', 'compliance@binance.com', 'Cayman Islands', TRUE),
('v2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 'CoinDCX Exchange', 'FIU-IND-9912', 'compliance@coindcx.com', 'India', TRUE)
ON CONFLICT (entity_id) DO NOTHING;

-- 6. Wallets & Addresses
-- Suspect Wallet
INSERT INTO wallets (id, blockchain_id, address, wallet_type, balance_native) VALUES
('w1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'EO_WALLET', 12.50),
-- Intermediary Hop 1
('w2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '0x3a4b9982cd11093e098dfb751b7401b5f6d89999', 'INTERMEDIARY', 0.15),
-- Intermediary Hop 2 (Peel Chain)
('w3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '0x8f2c1144882a1100998dfb751b7401b5f6d88888', 'INTERMEDIARY', 0.05),
-- Binance Deposit Wallet
('w4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '0x28C6c06298d514Db089934071355E5743bf21d60', 'VASP_DEPOSIT', 540.20)
ON CONFLICT (blockchain_id, address) DO NOTHING;

INSERT INTO addresses (id, wallet_id, blockchain_id, address_string, entity_id, vasp_id) VALUES
('ad111111-1111-1111-1111-111111111111', 'w1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', NULL, NULL),
('ad444444-4444-4444-4444-444444444444', 'w4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '0x28C6c06298d514Db089934071355E5743bf21d60', 'e1111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111')
ON CONFLICT (blockchain_id, address_string) DO NOTHING;

INSERT INTO address_labels (id, address_id, label_name, label_type, confidence, source) VALUES
('l4444444-4444-4444-4444-444444444444', 'ad444444-4444-4444-4444-444444444444', 'Binance Deposit Hot Wallet 14', 'DEPOSIT_HOT_WALLET', 'VERIFIED', 'TRACEX_INTEL_DB_v1')
ON CONFLICT DO NOTHING;

-- 7. Investigations
INSERT INTO investigations (id, case_id, suspect_address, blockchain_id, depth_hops, status, risk_score) VALUES
('i1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', '11111111-1111-1111-1111-111111111111', 3, 'COMPLETED', 85.50)
ON CONFLICT DO NOTHING;

-- 8. Multi-Hop Synthetic Transactions
INSERT INTO transactions (id, blockchain_id, tx_hash, from_wallet_id, to_wallet_id, asset_id, amount, amount_usd, fee_native, block_number, timestamp, status) VALUES
-- Hop 1: Suspect -> Intermediary 1 (10.0 ETH)
('tx111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001', 'w1111111-1111-1111-1111-111111111111', 'w2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 10.00, 32000.00, 0.002, 19200100, NOW() - INTERVAL '3 days', 'SUCCESS'),
-- Hop 2: Intermediary 1 -> Intermediary 2 (9.85 ETH)
('tx222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002', 'w2222222-2222-2222-2222-222222222222', 'w3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 9.85, 31520.00, 0.002, 19200150, NOW() - INTERVAL '2 days', 'SUCCESS'),
-- Hop 3: Intermediary 2 -> Binance Deposit Wallet (9.80 ETH)
('tx333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003', 'w3333333-3333-3333-3333-333333333333', 'w4444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 9.80, 31360.00, 0.002, 19200200, NOW() - INTERVAL '1 day', 'SUCCESS')
ON CONFLICT (blockchain_id, tx_hash) DO NOTHING;

-- 9. Attribution Results
INSERT INTO attribution_results (id, investigation_id, suspect_address, candidate_vasp_id, attribution_category, evidence_score, uncertainty_score, hop_distance, value_flow_usd, path_tx_hashes, explanation, analysis_version) VALUES
('res11111-1111-1111-1111-111111111111', 'i1111111-1111-1111-1111-111111111111', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 'v1111111-1111-1111-1111-111111111111', 'STRONG_ASSOCIATION', 87.50, 12.50, 3, 31360.00, ARRAY['0x9999...0001', '0x9999...0002', '0x9999...0003'], 'Suspect wallet routed 98% of transferred funds via a 3-hop peel chain to Binance deposit hot wallet.', 'v1.0.0')
ON CONFLICT DO NOTHING;
