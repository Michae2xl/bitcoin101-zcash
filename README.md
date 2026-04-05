# bitcoin101-zcash

Zcash fork of [bitcoin101](https://github.com/blockgeeks/bitcoin101) with **Orchard shielded transactions** (Halo2, no trusted setup).

Automated migration by [Zcash Migrate](https://github.com/Michae2xl/zcash-migrate).

## Migration Stats

| Metric | Value |
|--------|-------|
| Original | [blockgeeks/bitcoin101](https://github.com/blockgeeks/bitcoin101) |
| Language | Javascript |
| Source files | 8 |
| RPC calls detected | 2 |
| Code changes applied | 8 |
| Framework | npm |
| RPC calls mapped | 6 |
| Shielded methods | getbalance |

## Quick Start

```javascript
const { ZcashClient } = require("./zcash-enhancements/zcash_rpc.cjs");

const client = new ZcashClient({ zebraPort: 8232, zkoolPort: 8000 });

// Chain data (via zebrad)
const info = await client.chain.getblockchaininfo();

// Shielded wallet (via zkool — Orchard/Halo2)
const balance = await client.wallet.getBalance(accountId);
const addrs = await client.wallet.getAddresses(accountId, 6);
const txid = await client.wallet.send(accountId, [
  { address: addrs.ua, amount: "0.1", memo: "Private payment" }
], 4); // Orchard pool
```

## What Changed

| Before (Bitcoin) | After (Zcash) |
|-----------------|---------------|
| `bitcoin/` module | `zcash/` module |
| `CBitcoinAddress` | `CZcashAddress` |
| Port 8332/8333 | Port 8232/8233 |
| `bitcoin-cli`, `bitcoind` | `zcash-cli`, `zcashd` |
| `~/.bitcoin/` | `~/.zcash/` |
| BTC, satoshis | ZEC, zatoshis |
| Public transactions | Shielded (Orchard/Halo2, zero-knowledge) |

## Generated Files

| File | Purpose |
|------|---------|
| `zcash-enhancements/zcash_rpc.cjs` | ZcashClient (ZebraRPC + ZkoolWallet) |
| `zcash-enhancements/test_zcash_rpc.mjs` | Test suite for zebrad + zkool |
| `zcash-enhancements/MIGRATION-MAP.md` | 6 RPC calls mapped to Zcash |
| `zcash-enhancements/ZK-GUIDE.md` | Integration guide with examples |
| `zcash-deploy/` | Node config + setup scripts |
| `NOTICE` | Open source attribution |

## Requirements

| Service | Port | Purpose |
|---------|------|---------|
| [zebrad](https://github.com/ZcashFoundation/zebra) | 8232 | Chain data (blocks, transactions, validation) |
| [zkool](https://github.com/hhanh00/zkool2) | 8000 | Wallet (accounts, send, shield, Orchard/Halo2) |

## License

Original code: see LICENSE (preserved from upstream project)
Zcash enhancements: MIT (see zcash-enhancements/LICENSE)
See NOTICE for full attribution.
