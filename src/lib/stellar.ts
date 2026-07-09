import { Networks, Keypair, Horizon } from "@stellar/stellar-sdk";
import { getRate } from "@/lib/rates";

const NETWORK = process.env.STELLAR_NETWORK || "testnet";
const HORIZON_URL = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = NETWORK === "testnet" ? Networks.TESTNET : Networks.PUBLIC;

export const server = new Horizon.Server(HORIZON_URL);

// ---------------------------------------------------------------------------
// Stellar Integration — Foundation Skeleton
//
// These functions have correct signatures and import setup, but their
// implementations are stubbed. They return mock responses so the API routes
// compile and respond without crashing, but they do NOT interact with the
// real Stellar network.
//
// TODO(contributor): Replace each stub with a real Horizon/RPC call.
// See individual TODOs below.
// ---------------------------------------------------------------------------

/** Generate a new Stellar keypair and fund via Friendbot (testnet only) */
export async function createTestnetAccount(): Promise<{
  publicKey: string;
  secretKey: string;
}> {
  // TODO(contributor): Generate a Keypair.random(), fund via Friendbot
  // (https://friendbot.stellar.org?addr=<publicKey> for testnet),
  // return the publicKey and secretKey. Do NOT store the secretKey server-side
  // in production — return it to the client once so the user can save it.
  console.warn("[STUB] createTestnetAccount returning mock keypair");
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}

// TODO(contributor): implement Horizon polling or streaming to resolve
// stuck pending transactions. For now, transactions that don't reach the
// submit endpoint will remain in "pending" status indefinitely.

/** Fetch a path-payment rate from Horizon */
export async function fetchRate(from: string, to: string): Promise<string> {
  const result = await getRate(from, to);
  return result.rate;
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
  // TODO(contributor): 
  // 1. Load the source account via server.loadAccount(sourcePublicKey)
  // 2. Build a TransactionBuilder with Operation.pathPaymentStrictSend()
  // 3. Return the unsigned XDR (transaction.toXDR())
  // 4. Handle insufficient balance by checking source account balances first
  console.warn("[STUB] buildSendTransaction returning mock XDR");
  return "AAAAAgAAAAB...mock-xdr...AAAAA==";
}

/** Submit a signed XDR to Horizon */
export async function submitTransaction(signedXdr: string): Promise<{
  hash: string;
  status: "confirmed" | "failed";
}> {
  // TODO(contributor):
  // 1. Parse the XDR with TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  // 2. Submit via server.submitTransaction()
  // 3. Return { hash: result.hash, status: "confirmed" } on success
  // 4. On failure, extract the error code from err.response.data.extras.result_codes
  //    and throw a descriptive error
  console.warn("[STUB] submitTransaction returning mock result");
  return {
    hash: "0000000000000000000000000000000000000000000000000000000000000000",
    status: "confirmed",
  };
}