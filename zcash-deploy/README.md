# Zcash Local Deployment

## Architecture

```
Your App → ZcashClient (zcash-enhancements/zcash_rpc.*)
              ├── ZebraRPC  → zebrad :8232 (chain data)
              └── ZkoolWallet → zkool_graphql :8000 (wallet ops, Orchard/Halo2)
```

## Quick Start

```bash
# 1. Verify connections
cd zcash-deploy && ./setup.sh

# 2. Run tests against your node
cd ../zcash-enhancements && node --test test_zcash_rpc.mjs

# 3. Use in your code
const { ZcashClient } = require("./zcash-enhancements/zcash_rpc");
const client = new ZcashClient({ zebraPort: 8232, zkoolPort: 8000 });
const info = await client.chain.getblockchaininfo();
const addr = await client.wallet.getAddresses(1);
```

## Requirements

| Service | Port | Purpose |
|---------|------|---------|
| zebrad | 8232 | Chain data (blocks, transactions, mempool) |
| zkool_graphql | 8000 | Wallet ops (accounts, send, shield, Orchard) |
