import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { buildSendTransaction, fetchRate } from "@/lib/stellar";
import { stellarSendSchema } from "@/lib/validations";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    if (!user.stellarPublicKey) {
      return errorResponse("User has no Stellar account. Create one via /api/stellar/account first.", 400);
    }

    const body = await request.json();
    const parsed = stellarSendSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { fromAsset, toAsset, amount, recipientAddress } = parsed.data;

    // Validate amount > 0
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return errorResponse("Amount must be a positive number", 400);
    }

    // TODO(contributor):
    // 1. Call fetchRate() to get the live rate
    // 2. Calculate the destination amount
    // 3. Call buildSendTransaction() to get unsigned XDR
    // 4. Store the transaction in the DB with status "pending"
    // 5. Handle insufficient balance — check the source account's
    //    balances on Horizon before building
    const rate = await fetchRate(fromAsset.toUpperCase(), toAsset.toUpperCase());
    const toAmount = (amountNum * parseFloat(rate)).toFixed(2);
    const xdr = await buildSendTransaction({
      sourcePublicKey: user.stellarPublicKey,
      fromAsset: fromAsset.toUpperCase(),
      toAsset: toAsset.toUpperCase(),
      fromAmount: amount,
      toAmount,
      recipientAddress,
    });

    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        fromAsset: fromAsset.toUpperCase(),
        toAsset: toAsset.toUpperCase(),
        fromAmount: amount,
        toAmount,
        recipientAddress,
        status: "pending",
      },
    });

    return successResponse({
      transactionId: transaction.id,
      xdr,
      fromAsset: fromAsset.toUpperCase(),
      toAsset: toAsset.toUpperCase(),
      fromAmount: amount,
      toAmount,
      recipientAddress,
    }, 201);
  } catch (err: any) {
    console.error("Send error:", err);
    if (err.message?.includes("Invalid recipient")) {
      return errorResponse(err.message, 400);
    }
    return errorResponse(err.message || "Failed to build transaction", 500);
  }
}