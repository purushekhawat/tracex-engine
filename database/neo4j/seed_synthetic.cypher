// TRACE-X Neo4j Synthetic Graph Seed Data

// Blockchains & Assets
MERGE (eth:Blockchain {code: 'ethereum', name: 'Ethereum Mainnet', native_symbol: 'ETH'})
MERGE (ethAsset:Asset {symbol: 'ETH', name: 'Ether', blockchain: 'ethereum'})

// Entities & VASPs
MERGE (binanceEnt:Entity {entity_code: 'VASP_BINANCE', name: 'Binance International', category: 'EXCHANGE', risk_tier: 'LOW'})
MERGE (binanceVasp:VASP {vasp_id: 'v1111111-1111-1111-1111-111111111111', name: 'Binance Exchange', legal_country: 'Cayman Islands'})

// Wallets
MERGE (suspectW:Wallet {address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', blockchain: 'ethereum', wallet_type: 'EO_WALLET'})
MERGE (inter1W:Wallet {address: '0x3a4b9982cd11093e098dfb751b7401b5f6d89999', blockchain: 'ethereum', wallet_type: 'INTERMEDIARY'})
MERGE (inter2W:Wallet {address: '0x8f2c1144882a1100998dfb751b7401b5f6d88888', blockchain: 'ethereum', wallet_type: 'INTERMEDIARY'})
MERGE (binanceW:Wallet {address: '0x28C6c06298d514Db089934071355E5743bf21d60', blockchain: 'ethereum', wallet_type: 'VASP_DEPOSIT'})

MERGE (binanceAddr:Address {address_string: '0x28C6c06298d514Db089934071355E5743bf21d60', blockchain: 'ethereum', label_type: 'DEPOSIT_HOT_WALLET'})

// Transactions
MERGE (tx1:Transaction {tx_hash: '0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0001', blockchain: 'ethereum', block_number: 19200100, amount: 10.0, amount_usd: 32000.0, timestamp: '2026-10-06T12:00:00Z'})
MERGE (tx2:Transaction {tx_hash: '0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0002', blockchain: 'ethereum', block_number: 19200150, amount: 9.85, amount_usd: 31520.0, timestamp: '2026-10-07T12:00:00Z'})
MERGE (tx3:Transaction {tx_hash: '0x9999111122223333444455556666777788889999aaaabbbbccccddddeeee0003', blockchain: 'ethereum', block_number: 19200200, amount: 9.80, amount_usd: 31360.0, timestamp: '2026-10-08T12:00:00Z'})

// Relationships
// ON_CHAIN
MERGE (suspectW)-[:ON_CHAIN]->(eth)
MERGE (inter1W)-[:ON_CHAIN]->(eth)
MERGE (inter2W)-[:ON_CHAIN]->(eth)
MERGE (binanceW)-[:ON_CHAIN]->(eth)

// BELONGS_TO & ASSOCIATED_WITH
MERGE (binanceW)-[:BELONGS_TO]->(binanceEnt)
MERGE (binanceAddr)-[:ASSOCIATED_WITH]->(binanceVasp)

// USES_ASSET
MERGE (tx1)-[:USES_ASSET]->(ethAsset)
MERGE (tx2)-[:USES_ASSET]->(ethAsset)
MERGE (tx3)-[:USES_ASSET]->(ethAsset)

// Transaction Flow (SENT & RECEIVED_BY)
MERGE (suspectW)-[:SENT]->(tx1)
MERGE (tx1)-[:RECEIVED_BY]->(inter1W)

MERGE (inter1W)-[:SENT]->(tx2)
MERGE (tx2)-[:RECEIVED_BY]->(inter2W)

MERGE (inter2W)-[:SENT]->(tx3)
MERGE (tx3)-[:RECEIVED_BY]->(binanceW)
