// TRACE-X Neo4j Cypher Schema & Constraints Initialization

// Constraints for Address uniqueness per blockchain
CREATE CONSTRAINT address_chain_unique IF NOT EXISTS
FOR (a:Address) REQUIRE (a.address, a.blockchain) IS UNIQUE;

// Constraint for VASP uniqueness
CREATE CONSTRAINT vasp_id_unique IF NOT EXISTS
FOR (v:Vasp) REQUIRE v.vasp_id IS UNIQUE;

// Indexes for high-speed multi-hop graph queries
CREATE INDEX address_blockchain_idx IF NOT EXISTS
FOR (a:Address) ON (a.blockchain);

CREATE INDEX address_is_vasp_idx IF NOT EXISTS
FOR (a:Address) ON (a.is_vasp);
