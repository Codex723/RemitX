import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { submitTransaction } from "@/lib/stellar";
import { stellarSubmitSchema } from "@/lib/validations";
import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = stellarSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { signedXdr, transactionId } = parsed.data;

    // Verify the transaction belongs to this user
    const tx = await db.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) {
      return errorResponse("Transaction not found", 404);
    }
    if (tx.userId !== user.id) {
      return unauthorizedResponse();
    }
    if (tx.status !== "pending") {
      return errorResponse(`Transaction is already in status: ${tx.status}`, 400);
    }

    // TODO(contributor):
    // 1. Call submitTransaction() to submit the signed XDR to Horizon
    // 2. Set status to "validating" while waiting
    // 3. On success: update status to "confirmed", store stellarTxHash
    // 4. On failure: update status to "failed"
    // 5. If an escrow_id is set on the Transaction, also create/update
    //    the Escrow record
    await db.transaction.update({
      where: { id: transactionId },
      data: { status: "validating" },
    });

    const result = await submitTransaction(signedXdr);

    const updated = await db.transaction.update({
      where: { id: transactionId },
      data: {
        status: result.status === "confirmed" ? "confirmed" : "failed",
        stellarTxHash: result.hash,
        confirmedAt: result.status === "confirmed" ? new Date() : null,
      },
    });

    return successResponse({
      transactionId: updated.id,
      stellarTxHash: updated.stellarTxHash,
      status: updated.status,
      fromAsset: updated.fromAsset,
      toAsset: updated.toAsset,
      fromAmount: updated.fromAmount,
      toAmount: updated.toAmount,
    });
  } catch (err: any) {
    console.error("Submit error:", err);
    return errorResponse(err.message || "Failed to submit transaction", 500);
  }
}