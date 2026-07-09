import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { fetchRate } from "@/lib/stellar";
import { rateQuerySchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";

const RATE_CACHE_TTL_SECONDS = 30;

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const parsed = rateQuerySchema.safeParse({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
    });

    if (!parsed.success) {
      return errorResponse("Invalid query parameters. Required: from, to", 400);
    }

    const { from, to } = parsed.data;
    const upperFrom = from.toUpperCase();
    const upperTo = to.toUpperCase();

    // Check cache first
    const cached = await db.rate.findUnique({
      where: {
        fromAsset_toAsset: { fromAsset: upperFrom, toAsset: upperTo },
      },
    });

    if (cached) {
      const age = (Date.now() - cached.fetchedAt.getTime()) / 1000;
      if (age < RATE_CACHE_TTL_SECONDS) {
        return successResponse({
          rate: cached.rate,
          fromAsset: upperFrom,
          toAsset: upperTo,
          expiresAt: new Date(cached.fetchedAt.getTime() + RATE_CACHE_TTL_SECONDS * 1000).toISOString(),
        });
      }
    }

    // Fetch fresh rate
    const rate = await fetchRate(upperFrom, upperTo);

    // Upsert cache
    await db.rate.upsert({
      where: {
        fromAsset_toAsset: { fromAsset: upperFrom, toAsset: upperTo },
      },
      update: { rate, fetchedAt: new Date() },
      create: { fromAsset: upperFrom, toAsset: upperTo, rate },
    });

    return successResponse({
      rate,
      fromAsset: upperFrom,
      toAsset: upperTo,
      expiresAt: new Date(Date.now() + RATE_CACHE_TTL_SECONDS * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Rate fetch error:", err);
    return errorResponse("Failed to fetch exchange rate", 500);
  }
}