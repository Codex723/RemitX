import {
  Networks,
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
} from "@stellar/stellar-sdk";

const NETWORK = process.env.STELLAR_NETWORK || "testnet";
const HORIZON_URL = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = NETWORK === "testnet" ? Networks.TESTNET : Networks.PUBLIC;

export const server = new Horizon.Server(HORIZON_URL);

/** Map a currency code to a Stellar Asset */
export function assetFromCode(code: string): Asset {
  const upper = code.toUpperCase();
  // Native XLM
  if (upper === "XLM" || upper === "NATIVE") return Asset.native();
  // TODO(product): For non-native assets, we'd need the issuing anchor's public key.
  // For testnet, we use the known testnet anchors or mock with the source account.
  // This is a stub — in production, resolve via SEP-01 or a configured anchor list.
  return Asset.native();
}

/** Generate a new Stellar keypair and fund via Friendbot (testnet only) */
export async function createTestnetAccount(): Promise<{
  publicKey: string;
  secretKey: string;
}> {
  const keypair = Keypair.random();

  if (NETWORK === "testnet") {
    try {
      await fetch(
        `https://friendbot.stellar.org?addr=${keypair.publicKey()}`
      );
    } catch (err) {
      console.warn("Friendbot funding failed (testnet may be rate-limited):", err);
    }
  }

  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}

// Fallback rate map for when Horizon path-finding is unavailable.
// TODO(product): Replace with a proper rate feed (SEP-30, oracle, or anchor API).
const FALLBACK_RATES: Record<string, Record<string, string>> = {
  USD: { NGN: "1580.00", EUR: "0.92", GBP: "0.79", PHP: "58.50" },
  EUR: { USD: "1.09", NGN: "1717.00", GBP: "0.86", PHP: "63.50" },
  GBP: { USD: "1.27", EUR: "1.16", NGN: "2000.00", PHP: "74.00" },
  NGN: { USD: "0.00063", EUR: "0.00058", GBP: "0.00050", PHP: "0.037" },
  PHP: { USD: "0.017", EUR: "0.016", GBP: "0.014", NGN: "27.00" },
};

/** Fetch a path-payment rate from Horizon, falling back to static rates */
export async function fetchRate(from: string, to: string): Promise<string> {
  const fromAsset = assetFromCode(from);
  const toAsset = assetFromCode(to);
  const amount = "1";

  try {
    const paths = await server
      .strictSendPaths(fromAsset, amount, [toAsset])
      .call();

    if (paths.records.length > 0) {
      const destAmount = paths.records[0].destination_amount;
      // Calculate rate: destAmount / amount
      return destAmount;
    }
  } catch (err) {
    console.warn("Horizon path-finding failed, using fallback rates:", err);
  }

  // Fallback
  const fallback = FALLBACK_RATES[from.toUpperCase()]?.[to.toUpperCase()];
  if (fallback) return fallback;

  throw new Error(`No rate available for ${from} -> ${to}`);
}

/** Build a path_payment_strict_send transaction and return unsigned XDR */
export async function buildSendTransaction(params: {
  sourcePublicKey: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  recipientAddress: string;
}): Promise<string> {
  const { sourcePublicKey, fromAsset, toAsset, fromAmount, toAmount, recipientAddress } = params;

  // Validate recipient is a valid Stellar address
  if (!Keypair.fromPublicKey(recipientAddress)) {
    throw new Error("Invalid recipient Stellar address");
  }

  const sourceAccount = await server.loadAccount(sourcePublicKey);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.pathPaymentStrictSend({
        sendAsset: assetFromCode(fromAsset),
        sendAmount: fromAmount,
        destination: recipientAddress,
        destAsset: assetFromCode(toAsset),
        destMin: toAmount,
      })
    )
    .addMemo(Memo.text("RemitX Transfer"))
    .setTimeout(300)
    .build();

  return transaction.toXDR();
}

/** Submit a signed XDR to Horizon */
export async function submitTransaction(signedXdr: string): Promise<{
  hash: string;
  status: "confirmed" | "failed";
}> {
  try {
    const envelope = (await import("@stellar/stellar-sdk")).TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(envelope);
    return {
      hash: result.hash,
      status: "confirmed",
    };
  } catch (err: any) {
    // Extract the result code from Horizon error
    const message = err?.response?.data?.extras?.result_codes?.transaction || err?.message || "Unknown error";
    throw new Error(`Transaction failed: ${message}`);
  }
}