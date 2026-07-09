import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { fetchRate } from "@/lib/stellar";
import { rateQuerySchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";

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

    // TODO(contributor): 
    // 1. Check the Rate table for a cached rate < 30s old
    // 2. If cached, return it
    // 3. If not, call fetchRate() to get a live Horizon quote
    // 4. Upsert the Rate table and return the fresh rate
    const rate = await fetchRate(from.toUpperCase(), to.toUpperCase());

    return successResponse({
      rate,
      fromAsset: from.toUpperCase(),
      toAsset: to.toUpperCase(),
    });
  } catch (err) {
    console.error("Rate fetch error:", err);
    return errorResponse("Failed to fetch exchange rate", 500);
  }
}