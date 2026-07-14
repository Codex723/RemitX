import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createTestnetAccount } from "@/lib/stellar";
import { db } from "@/lib/db";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function POST(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    // Check if user already has a stellarPublicKey
    if (user.stellarPublicKey) {
      return errorResponse("User already has a Stellar account", 409);
    }

    // Generate a new Stellar keypair and fund via Friendbot
    const account = await createTestnetAccount();

    // Store the publicKey on the user record
    await db.user.update({
      where: { id: user.id },
      data: { stellarPublicKey: account.publicKey },
    });

    // Log the secret key for dev purposes (in production, return once to client)
    console.log(`[DEV] User ${user.email} Stellar secret: ${account.secretKey}`);

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