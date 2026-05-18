import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as StellarSdk from "stellar-sdk";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Stellar Network Setup (Testnet by default)
  const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

  // API: Get optimal payment paths
  app.get("/api/paths", async (req, res) => {
    const { sourceAccount, destinationAsset, destinationAmount } = req.query;
    
    if (!destinationAsset || !destinationAmount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
      // Mocked destination asset setup for demo
      const destAsset = destinationAsset === 'native' 
        ? StellarSdk.Asset.native() 
        : new StellarSdk.Asset('USDC', 'GBBD47IF6LWNCZX6J6S6G7AVC2FDV57Z6S6G7AVC2FDV57Z6S6G7AVC2FDV');

      const paths = await server.strictReceivePaymentPaths({
        sourceAccount: sourceAccount as string || 'G...',
        destinationAsset: destAsset,
        destinationAmount: destinationAmount as string,
      }).call();

      res.json(paths.records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch paths" });
    }
  });

  // API: Compare Anchor Fees (Mocked for SEP-24 demo)
  app.get("/api/anchors", (req, res) => {
    const anchors = [
      { id: 'anchor-a', name: 'StellarAnchor NG', corridor: 'NGN', fee: 1.5, fixed: 0.5 },
      { id: 'anchor-b', name: 'PH-Global', corridor: 'PHP', fee: 1.2, fixed: 0.2 },
      { id: 'anchor-c', name: 'UK-Remit', corridor: 'GBP', fee: 0.8, fixed: 1.0 },
    ];
    res.json(anchors);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RemitX Server running on http://localhost:${PORT}`);
  });
}

startServer();
