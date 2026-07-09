/**
 * Real-World Price Engine for RemitX
 * =====================================
 * Fetches live rates from free public APIs (no API key required),
 * caches them in the database for consistency, and provides a
 * unified getRate() function used throughout the app.
 *
 * Data sources (free, no key):
 *   - CoinGecko API     → crypto asset prices (XLM, USDC, EURC in USD)
 *   - Frankfurter API   → forex fiat rates (NGN, EUR, GBP etc. against USD)
 *
 * Fallback chain: DB cache (if fresh) → API fetch → DB cache (if stale)
 * Cache TTL: 300 seconds (5 minutes)
 */

import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateResult {
  rate: string;
  fromAsset: string;
  toAsset: string;
  fetchedAt: string; // ISO timestamp
  source: "cache" | "api" | "fallback";
}

// ---------------------------------------------------------------------------
// Cache configuration
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 300_000; // 5 minutes

// ---------------------------------------------------------------------------
// Free API helpers (no key required)
// ---------------------------------------------------------------------------

/**
 * CoinGecko simple/price — returns USD value for given coin IDs.
 * https://docs.coingecko.com/reference/simple-price
 */
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

/** Map Stellar asset codes → CoinGecko coin IDs */
const COINGECKO_ASSET_MAP: Record<string, string> = {
  XLM: "stellar",
  USDC: "usd-coin",
  EURC: "euro-coin",
  BTC: "bitcoin",
  ETH: "ethereum",
};

async function fetchCryptoUsdRate(assetCode: string): Promise<number | null> {
  const coinId = COINGECKO_ASSET_MAP[assetCode];
  if (!coinId) return null;

  try {
    const url = `${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currencies=usd`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const price = json[coinId]?.usd;
    return typeof price === "number" ? price : null;
  } catch {
    return null;
  }
}

/**
 * Frankfurter API — free forex rates, no key needed.
 * https://www.frankfurter.app/docs/
 * Returns rate for 1 USD → target currency.
 */
const FRANKFURTER_BASE = "https://api.frankfurter.dev";

async function fetchFiatUsdRate(currencyCode: string): Promise<number | null> {
  // Normalise to uppercase 3-letter codes
  const cur = currencyCode.toUpperCase();
  if (cur === "USD") return 1;

  try {
    // Get latest USD → target rate
    const url = `${FRANKFURTER_BASE}/latest?from=USD&to=${cur}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const rate = json.rates?.[cur];
    return typeof rate === "number" ? rate : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Known asset classification
// ---------------------------------------------------------------------------

/** Crypto assets that CoinGecko tracks */
const CRYPTO_ASSETS = new Set(["XLM", "USDC", "EURC", "BTC", "ETH"]);

function isCrypto(code: string): boolean {
  return CRYPTO_ASSETS.has(code.toUpperCase());
}

// ---------------------------------------------------------------------------
// Rate resolution logic
// ---------------------------------------------------------------------------

/**
 * Resolve rate for `fromAsset → toAsset` by routing through USD.
 *
 * Strategy:
 *   rate(from → to) = rate(from → USD) / rate(to → USD)
 *
 * If either leg fails, returns null.
 */
async function resolveRateThroughUsd(
  fromAsset: string,
  toAsset: string
): Promise<number | null> {
  const fromUpper = fromAsset.toUpperCase();
  const toUpper = toAsset.toUpperCase();

  if (fromUpper === toUpper) return 1;

  // Get fromAsset → USD
  let fromToUsd: number | null = null;
  if (fromUpper === "USD") {
    fromToUsd = 1;
  } else if (isCrypto(fromUpper)) {
    fromToUsd = await fetchCryptoUsdRate(fromUpper);
  } else {
    fromToUsd = await fetchFiatUsdRate(fromUpper);
  }

  if (fromToUsd === null) return null;

  // Get toAsset → USD
  let toToUsd: number | null = null;
  if (toUpper === "USD") {
    toToUsd = 1;
  } else if (isCrypto(toUpper)) {
    toToUsd = await fetchCryptoUsdRate(toUpper);
  } else {
    toToUsd = await fetchFiatUsdRate(toUpper);
  }

  if (toToUsd === null) return null;
  if (toToUsd === 0) return null;

  return fromToUsd / toToUsd;
}

// ---------------------------------------------------------------------------
// DB cache helpers
// ---------------------------------------------------------------------------

async function getCachedRate(
  fromAsset: string,
  toAsset: string
): Promise<{ rate: string; fetchedAt: Date } | null> {
  try {
    const row = await db.rate.findUnique({
      where: {
        fromAsset_toAsset: {
          fromAsset: fromAsset.toUpperCase(),
          toAsset: toAsset.toUpperCase(),
        },
      },
    });
    if (!row) return null;

    const age = Date.now() - row.fetchedAt.getTime();
    return { rate: row.rate, fetchedAt: row.fetchedAt };
  } catch {
    return null;
  }
}

async function upsertCachedRate(
  fromAsset: string,
  toAsset: string,
  rate: string
): Promise<void> {
  try {
    await db.rate.upsert({
      where: {
        fromAsset_toAsset: {
          fromAsset: fromAsset.toUpperCase(),
          toAsset: toAsset.toUpperCase(),
        },
      },
      create: {
        fromAsset: fromAsset.toUpperCase(),
        toAsset: toAsset.toUpperCase(),
        rate,
      },
      update: {
        rate,
        fetchedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("[rates] Failed to upsert cache:", err);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get the exchange rate for `fromAsset → toAsset`.
 *
 * Resolution order:
 *   1. Return fresh DB cache (< CACHE_TTL) immediately
 *   2. Fetch from live APIs, cache the result, return it
 *   3. Return stale DB cache as fallback
 *   4. Return "1.00" as last resort (graceful degradation)
 */
export async function getRate(
  fromAsset: string,
  toAsset: string
): Promise<RateResult> {
  const from = fromAsset.toUpperCase();
  const to = toAsset.toUpperCase();

  // ---- Step 1: Check fresh cache ----
  const cached = await getCachedRate(from, to);
  if (cached) {
    const age = Date.now() - cached.fetchedAt.getTime();
    if (age < CACHE_TTL_MS) {
      return {
        rate: cached.rate,
        fromAsset: from,
        toAsset: to,
        fetchedAt: cached.fetchedAt.toISOString(),
        source: "cache",
      };
    }
  }

  // ---- Step 2: Fetch live from APIs ----
  const liveRate = await resolveRateThroughUsd(from, to);
  if (liveRate !== null) {
    const rateStr = liveRate.toFixed(6);
    await upsertCachedRate(from, to, rateStr);
    return {
      rate: rateStr,
      fromAsset: from,
      toAsset: to,
      fetchedAt: new Date().toISOString(),
      source: "api",
    };
  }

  // ---- Step 3: Return stale cache as fallback ----
  if (cached) {
    console.warn(
      `[rates] Live fetch failed for ${from}→${to}, using stale cache`
    );
    return {
      rate: cached.rate,
      fromAsset: from,
      toAsset: to,
      fetchedAt: cached.fetchedAt.toISOString(),
      source: "fallback",
    };
  }

  // ---- Step 4: Absolute last resort ----
  console.warn(
    `[rates] No rate available for ${from}→${to}, returning 1.00`
  );
  return {
    rate: "1.00",
    fromAsset: from,
    toAsset: to,
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}

/**
 * Refresh all known rate pairs in the cache.
 * Called by Vercel Cron Jobs every 5 minutes to keep rates warm.
 */
export async function refreshAllRates(): Promise<void> {
  const pairs: [string, string][] = [
    ["XLM", "USD"],
    ["USDC", "USD"],
    ["EURC", "USD"],
    ["XLM", "USDC"],
    ["XLM", "EURC"],
    ["USDC", "EURC"],
    ["USD", "NGN"],
    ["USDC", "NGN"],
    ["USD", "EUR"],
    ["EUR", "NGN"],
    ["EURC", "NGN"],
    ["USDC", "XAF"],
    ["USD", "XAF"],
    ["USDC", "XOF"],
    ["USD", "XOF"],
    ["USDC", "GHS"],
    ["USD", "GHS"],
    ["USDC", "KES"],
    ["USD", "KES"],
    ["USDC", "ZAR"],
    ["USD", "ZAR"],
  ];

  let successCount = 0;
  let failCount = 0;

  for (const [from, to] of pairs) {
    const rate = await resolveRateThroughUsd(from, to);
    if (rate !== null) {
      await upsertCachedRate(from, to, rate.toFixed(6));
      successCount++;
    } else {
      failCount++;
    }
    // Small delay to avoid rate limiting free APIs
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(
    `[rates] refreshAllRates complete: ${successCount} ok, ${failCount} failed`
  );
}