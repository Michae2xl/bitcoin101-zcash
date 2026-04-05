const express = require("express");
const path = require("path");
const { ZcashClient } = require("./zcash-enhancements/zcash_rpc.cjs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));
app.get("/", (req, res) => res.redirect("/wallet.html"));

// Zcash clients — mainnet + testnet
const ZEBRA_HOST = process.env.ZEBRA_HOST || "192.168.0.28";
const ZKOOL_HOST = process.env.ZKOOL_HOST || "192.168.0.28";

const clients = {
  testnet: new ZcashClient({
    zebraHost: ZEBRA_HOST,
    zebraPort: parseInt(process.env.ZEBRA_PORT || "8232"),
    zkoolHost: ZKOOL_HOST,
    zkoolPort: parseInt(process.env.ZKOOL_TESTNET_PORT || "8001"),
  }),
  mainnet: new ZcashClient({
    zebraHost: ZEBRA_HOST,
    zebraPort: parseInt(process.env.ZEBRA_PORT || "8232"),
    zkoolHost: ZKOOL_HOST,
    zkoolPort: parseInt(process.env.ZKOOL_MAINNET_PORT || "8000"),
  }),
};

let currentNetwork = "testnet";
let zcash = clients[currentNetwork];

// Network switch
app.get("/api/network", (req, res) => res.json({ network: currentNetwork }));
app.post("/api/network", (req, res) => {
  const { network } = req.body;
  if (network === "testnet" || network === "mainnet") {
    currentNetwork = network;
    zcash = clients[currentNetwork];
    res.json({ network: currentNetwork, switched: true });
  } else {
    res.status(400).json({ error: "Invalid network. Use testnet or mainnet." });
  }
});

// --- API endpoints ---

// Chain info
app.get("/api/chain", async (req, res) => {
  try {
    const info = await zcash.chain.getblockchaininfo();
    res.json({
      chain: info.chain,
      blocks: info.blocks,
      orchard:
        info.valuePools?.find((p) => p.id === "orchard")?.chainValue || 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get or create account
app.post("/api/account", async (req, res) => {
  try {
    // Check if account 1 exists
    const accounts = await zcash.wallet._query("{ accounts { id name } }");
    if (accounts.accounts && accounts.accounts.length > 0) {
      res.json({
        accountId: accounts.accounts[0].id,
        name: accounts.accounts[0].name,
        existing: true,
      });
      return;
    }
    // Create new account
    const id = await zcash.wallet.createAccount("zcash-wallet", "", 7);
    res.json({ accountId: id, name: "zcash-wallet", existing: false });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get balance
app.get("/api/balance/:accountId", async (req, res) => {
  try {
    const id = parseInt(req.params.accountId);
    // Sync first
    await zcash.wallet.sync(id);
    const bal = await zcash.wallet.getBalance(id);
    res.json(bal.balanceByAccount || bal);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get addresses
app.get("/api/addresses/:accountId", async (req, res) => {
  try {
    const id = parseInt(req.params.accountId);
    const pools = parseInt(req.query.pools || "6");
    const raw = await zcash.wallet._query(
      `{ addressByAccount(idAccount: ${id}, pools: ${pools}) { ua transparent sapling orchard } }`,
    );
    res.json(raw.addressByAccount);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// New addresses
app.post("/api/addresses/:accountId/new", async (req, res) => {
  try {
    const id = parseInt(req.params.accountId);
    const raw = await zcash.wallet._query(
      `mutation { newAddresses(idAccount: ${id}) { ua transparent sapling orchard } }`,
    );
    res.json(raw.newAddresses);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Send shielded
app.post("/api/send", async (req, res) => {
  try {
    const { accountId, to, amount, memo, srcPools } = req.body;
    const recipients = JSON.stringify([
      { address: to, amount: String(amount), memo: memo || "" },
    ]).replace(/"/g, '\\"');
    const raw = await zcash.wallet._query(
      `mutation { pay(idAccount: ${accountId}, payment: { recipients: [{ address: "${to}", amount: "${amount}", memo: "${memo || ""}" }], srcPools: ${srcPools || 4} }) }`,
    );
    res.json({ txid: raw.pay });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get notes (shielded UTXOs)
app.get("/api/notes/:accountId", async (req, res) => {
  try {
    const id = parseInt(req.params.accountId);
    const raw = await zcash.wallet._query(
      `{ notesByAccount(idAccount: ${id}) { pool value memo } }`,
    );
    res.json(raw.notesByAccount);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get transactions
app.get("/api/transactions/:accountId", async (req, res) => {
  try {
    const id = parseInt(req.params.accountId);
    const raw = await zcash.wallet._query(
      `{ transactionsByAccount(idAccount: ${id}) { txid height value fee } }`,
    );
    res.json(raw.transactionsByAccount);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`\n  🔒 Zcash Wallet running at http://localhost:${PORT}`);
  console.log(`  zebrad: ${zcash.chain.host}:${zcash.chain.port}`);
  console.log(`  zkool:  ${zcash.wallet.host}:${zcash.wallet.port}\n`);
});
