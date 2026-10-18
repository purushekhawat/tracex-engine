// TRACE-X Neo4j Cypher Schema & Constraints Definition
// SIH 26182 - Cross-Chain Graph Intelligence Engine

// Node Uniqueness Constraints
CREATE CONSTRAINT wallet_address_unique IF NOT EXISTS
FOR (w:Wallet) REQUIRE (w.address, w.blockchain) IS UNIQUE;

CREATE CONSTRAINT tx_hash_unique IF NOT EXISTS
FOR (t:Transaction) REQUIRE (t.tx_hash, t.blockchain) IS UNIQUE;

CREATE CONSTRAINT address_str_unique IF NOT EXISTS
FOR (a:Address) REQUIRE (a.address_string, a.blockchain) IS UNIQUE;

CREATE CONSTRAINT entity_code_unique IF NOT EXISTS
FOR (e:Entity) REQUIRE e.entity_code IS UNIQUE;

CREATE CONSTRAINT vasp_id_unique IF NOT EXISTS
FOR (v:VASP) REQUIRE v.vasp_id IS UNIQUE;

CREATE CONSTRAINT blockchain_code_unique IF NOT EXISTS
FOR (b:Blockchain) REQUIRE b.code IS UNIQUE;

CREATE CONSTRAINT asset_symbol_unique IF NOT EXISTS
FOR (ast:Asset) REQUIRE (ast.symbol, ast.blockchain) IS UNIQUE;

// Indexes for High-Speed Traversal
CREATE INDEX wallet_blockchain_idx IF NOT EXISTS
FOR (w:Wallet) ON (w.blockchain);

CREATE INDEX tx_timestamp_idx IF NOT EXISTS
FOR (t:Transaction) ON (t.timestamp);
