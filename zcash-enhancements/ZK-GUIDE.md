# ZK Integration Guide

## Generated Files

| File | Purpose |
|------|---------|
| `zcash_rpc.js` | Full Zcash RPC client with z_* methods |
| `test_zcash_rpc.mjs` | Test suite — run against zcashd testnet |
| `MIGRATION-MAP.md` | Every Bitcoin RPC call mapped to Zcash equivalent |

## How to Use

### 1. Start zcashd testnet

```bash
zcashd -testnet -daemon
# Wait for sync, then:
zcash-cli -testnet getblockchaininfo
```

### 2. Replace Bitcoin RPC calls

```javascript
// Before:
const Bitcoin = require("bitcoin-core");
const rpc = new Bitcoin({ port: 18332 });
const balance = await rpc.getBalance();

// After:
const { ZcashRPC } = require("./zcash-enhancements/zcash_rpc");
const rpc = new ZcashRPC({ port: 18232 });
const balance = await rpc.z_gettotalbalance();
```

### 3. Shielded send (zk-SNARK transaction)

```javascript
const rpc = new ZcashRPC({ port: 18232 });
const zaddr = await rpc.z_getnewaddress("sapling"); // zs... address

// Send privately (async — proof generation takes ~2s)
const txid = await rpc.shieldedSend(
  zaddr,
  "zs1recipient...",
  1.0,
  "Private payment"
);
console.log("Shielded tx:", txid);
```

### 4. Auto-shield (move transparent → shielded)

```javascript
const taddr = await rpc.getnewaddress();
const zaddr = await rpc.z_getnewaddress("sapling");
const opid = await rpc.autoShield(taddr, zaddr);
if (opid) {
  const result = await rpc.waitForOperation(opid);
  console.log("Shielded:", result);
}
```

### 5. Run tests

```bash
# Start zcashd testnet first, then:
cd zcash-enhancements && node --test test_zcash_rpc.mjs
```

## Address Types

| Type | Prefix (mainnet) | Prefix (testnet) | Privacy |
|------|-----------------|-------------------|---------|
| Transparent | t1... / t3... | tm... / t2... | Public |
| Sapling | zs... | ztestsapling... | zk-SNARK shielded |
| Unified | u1... | utest1... | Auto-selects best pool |

## How zk-SNARKs Work in Zcash

When you call `z_sendmany`, zcashd:
1. Selects shielded notes (like UTXOs but encrypted)
2. Generates a **zero-knowledge proof** (Groth16 for Sapling)
3. The proof proves the transaction is valid **without revealing** sender, recipient, or amount
4. Only the recipient can decrypt the transaction details
5. Proof generation takes ~2 seconds (CPU-intensive)

The proof is verified by every node, but reveals nothing about the transaction.
