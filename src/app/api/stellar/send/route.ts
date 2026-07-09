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
      return errorResponse("User has no Stellar account. Please re-register.", 400);
    }

    const body = await request.json();
    const parsed = stellarSendSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { fromAsset, toAsset, amount, recipientAddress } = parsed.data;
    const upperFrom = fromAsset.toUpperCase();
    const upperTo = toAsset.toUpperCase();

    // Validate amount > 0
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return errorResponse("Amount must be a positive number", 400);
    }

    // Fetch the rate to calculate destination amount
    const rate = await fetchRate(upperFrom, upperTo);
    const toAmount = (amountNum * parseFloat(rate)).toFixed(2);

    // Build the unsigned transaction
    const xdr = await buildSendTransaction({
      sourcePublicKey: user.stellarPublicKey,
      fromAsset: upperFrom,
      toAsset: upperTo,
      fromAmount: amount,
      toAmount,
      recipientAddress,
    });

    // Create a transaction record
    const transaction = await db.transaction.create({
      data: {
        userId: user.id,
        fromAsset: upperFrom,
        toAsset: upperTo,
        fromAmount: amount,
        toAmount,
        recipientAddress,
        status: "pending",
        xdr,
      },
    });

    return successResponse({
      transactionId: transaction.id,
      xdr,
      fromAsset: upperFrom,
      toAsset: upperTo,
      fromAmount: amount,
      toAmount,
      recipientAddress,
    }, 201);
  } catch (err: any) {
    console.error("Send error:", err);
    if (err.message?.includes("Invalid recipient")) {
      return errorResponse(err.message, 400);
    }
    // TODO(product): Check if insufficient balance by inspecting Horizon account balances
    return errorResponse(err.message || "Failed to build transaction", 500);
  }
}