import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createTestnetAccount } from "@/lib/stellar";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // TODO(contributor): Call createTestnetAccount() to generate a real keypair,
    // fund it via Friendbot, store the publicKey on the user record, and
    // return the secretKey to the client (once, so they can save it).
    // Do NOT store the secretKey server-side in production.
    const account = await createTestnetAccount();

    return successResponse({
      publicKey: account.publicKey,
      // secretKey intentionally omitted from response for production safety
      message: "Account generated. Secret key was logged server-side (dev only).",
    });
  } catch (err) {
    console.error("Account creation error:", err);
    return errorResponse("Failed to create Stellar account", 500);
  }
}