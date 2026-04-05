# Zcash Wallet Web

The first Zcash web wallet with Orchard shielded transactions (Halo2) — mainnet and testnet.

Forked from [blockgeeks/bitcoin101](https://github.com/blockgeeks/bitcoin101) and rebuilt by [Zcash Migrate](https://github.com/Michae2xl/zcash-migrate).

## What the original did

**bitcoin101** was a simple Bitcoin web wallet built by Blockgeeks as a learning tool. It had a basic HTML interface that let you generate Bitcoin addresses, check balances, and create transactions using bitcoinjs-lib. It was designed to teach developers how Bitcoin wallets work under the hood — keys, addresses, UTXOs, and transaction signing.

## What it does now

A full **Zcash shielded wallet** running in the browser, connected to zebrad (chain data) and zkool (wallet operations with Orchard/Halo2 proofs).

**Features:**

- View balance per pool (Orchard, Sapling, Transparent)
- Receive ZEC via Unified Address (u1...), Orchard, Sapling, or Transparent
- Send shielded transactions with Halo2 zero-knowledge proofs
- Encrypted memos (512 bytes, only recipient can read)
- Switch between TESTNET and MAINNET with one click
- Live chain data (block height, Orchard pool total, network upgrade)
- Shielded notes viewer (encrypted UTXOs)
- Transaction history
- Cypherpunk UI with Matrix rain, glitch effects, and eyes tracking cursor

**What changed technically:**

- Express.js backend connects to zebrad JSON-RPC + zkool GraphQL
- ZcashClient wrapper handles all RPC/wallet operations
- All Bitcoin references replaced (ports, binaries, addresses, currency)
- Network toggle switches between zkool testnet (port 8001) and mainnet (port 8000)

## Quick Start

```bash
git clone https://github.com/Michae2xl/bitcoin101-zcash.git
cd bitcoin101-zcash
npm install
node server.js
# Open http://localhost:3333
```

Configure your nodes in `server.js`:

```javascript
zebraHost: "127.0.0.1",  // zebrad JSON-RPC
zebraPort: 8232,
zkoolHost: "127.0.0.1",  // zkool GraphQL
zkoolPort: 8001,          // testnet (8000 for mainnet)
```

## Screenshots

```
┌─────────────────────────────────────────────────┐
│  ZCASH WALLET    [TESTNET] [MAINNET]    ● Block │
│                                                 │
│            👁  👁  (Zcash logo pupils)          │
│           SURVEILLANCE DEFEATED                 │
│                                                 │
│  ┌─── BALANCE ──────┐  ┌─── SEND ──────────┐  │
│  │   0.9999 ZEC      │  │  To: u1... or zs1  │  │
│  │  ● Orchard 0.9999 │  │  Amount: 0.001     │  │
│  │  ● Sapling 0.0000 │  │  Memo: encrypted   │  │
│  │  ● Transp  0.0000 │  │  > BROADCAST       │  │
│  └───────────────────┘  └────────────────────┘  │
│  ┌─── RECEIVE ──────┐  ┌─── NOTES ─────────┐  │
│  │  ᙇ utest1ncq...  │  │  ORCHARD  0.8999  │  │
│  │  ᙇ utest1fyk...  │  │  ORCHARD  0.1000  │  │
│  └───────────────────┘  └────────────────────┘  │
│  BLOCK 3,296,925 | TESTNET | HALO2 | CONNECTED  │
└─────────────────────────────────────────────────┘
```

## API Endpoints

| Endpoint                 | Method   | Purpose                                |
| ------------------------ | -------- | -------------------------------------- |
| `/api/chain`             | GET      | Block height, Orchard pool total       |
| `/api/network`           | GET/POST | Get or switch testnet/mainnet          |
| `/api/account`           | POST     | Get or create wallet account           |
| `/api/balance/:id`       | GET      | Balance per pool (syncs first)         |
| `/api/addresses/:id`     | GET      | Unified, Orchard, Sapling, Transparent |
| `/api/addresses/:id/new` | POST     | Generate new diversified addresses     |
| `/api/send`              | POST     | Shielded send with Halo2 proof         |
| `/api/notes/:id`         | GET      | Shielded notes (encrypted UTXOs)       |
| `/api/transactions/:id`  | GET      | Transaction history                    |

## Requirements

| Service                                            | Port      | Purpose                  |
| -------------------------------------------------- | --------- | ------------------------ |
| [zebrad](https://github.com/ZcashFoundation/zebra) | 8232      | Chain data               |
| [zkool](https://github.com/hhanh00/zkool2)         | 8000/8001 | Wallet (mainnet/testnet) |

## License

Original code: MIT (blockgeeks/bitcoin101)
Zcash enhancements: MIT
See NOTICE for full attribution.
