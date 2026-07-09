/**
 * Vercel Cron Job — Refresh Rates Cache
 *
 * Called every 5 minutes (via Vercel Cron Jobs) to pre-warm the rate cache.
 * This ensures the site always has fresh rates from the DB without waiting
 * for an API call on user requests.
 *
 * Vercel Cron config (vercel.json):
 *   { "crons": [ { "path": "/api/cron/update-rates",
 *                   "schedule": "every 5 minutes" } ] }
 *
 * For local dev, this route can be hit manually at GET /api/cron/update-rates.
 */

import { NextResponse } from "next/server";
import { refreshAllRates } from "@/lib/rates";

// Vercel Cron uses a shared secret for auth. Set CRON_SECRET in env vars.
// If not set, still allow the endpoint but warn.
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  try {
    // Verify cron secret if configured
    if (CRON_SECRET) {
      const authHeader = request.headers.get("authorization") || "";
      const token = authHeader.replace("Bearer ", "");
      if (token !== CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("[cron] Starting rate refresh...");
    await refreshAllRates();
    console.log("[cron] Rate refresh complete.");

    return NextResponse.json({
      success: true,
      message: "Rates refreshed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron] Rate refresh failed:", err);
    return NextResponse.json(
      { success: false, error: "Rate refresh failed" },
      { status: 500 }
    );
  }
}

// Also support POST in case Vercel sends POST
export const POST = GET;