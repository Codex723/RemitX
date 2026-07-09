"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Keypair, TransactionBuilder } from "@stellar/stellar-sdk";

export default function ReviewPage() {
  const router = useRouter();
  const [txData, setTxData] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "validating" | "confirmed" | "failed">("idle");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Load transaction data from sessionStorage
    const stored = sessionStorage.getItem("reviewTx");
    if (stored) {
      setTxData(JSON.parse(stored));
    } else {
      setError("No transaction data found. Please start from the Send page.");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-scale-cascade");
            entry.target.classList.remove("opacity-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // TESTNET-ONLY SHORTCUT: Sign with a key derived from the server's returned secret
  // TODO(product): Replace with proper wallet integration (Freighter) for mainnet.
  // In this testnet pass, the secret key was returned to the client during registration
  // and stored in localStorage for convenience. This is NOT production-safe.
  async function handleConfirm() {
    if (!txData) return;
    setStatus("validating");
    setError("");

    const btn = document.getElementById("confirmBtn") as HTMLButtonElement;
    const progressBar = document.getElementById("progressBar");
    const hashEl = document.getElementById("txHash");

    if (btn) {
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-sm">sync</span> Validating...';
      btn.disabled = true;
      btn.classList.add("opacity-80", "cursor-not-allowed");
    }
    if (progressBar) (progressBar as HTMLElement).style.width = "100%";
    if (hashEl) (hashEl as HTMLElement).textContent = "VALIDATING_ON_CHAIN...";

    try {
      // Sign the XDR client-side (testnet-only shortcut)
      // In production, the user signs via Freighter or another wallet
      const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
      const secretKeyStr = localStorage.getItem("remitx_stellar_secret");

      if (!secretKeyStr) {
        throw new Error("Stellar secret key not found. Please re-register to get a new key.");
      }

      const keypair = Keypair.fromSecret(secretKeyStr);
      const transaction = TransactionBuilder.fromXDR(txData.xdr, NETWORK_PASSPHRASE);
      transaction.sign(keypair);
      const signedXdr = transaction.toXDR();

      // Submit to the server
      const res = await fetch("/api/stellar/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedXdr,
          transactionId: txData.transactionId,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || "Submission failed");
      }

      setStatus("confirmed");
      setTxHash(result.data.stellarTxHash);

      if (btn) {
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">check_circle</span> Transaction Broadcast';
        btn.classList.remove("bg-secondary");
        btn.classList.add("bg-primary");
      }
      if (hashEl) {
        (hashEl as HTMLElement).textContent = result.data.stellarTxHash;
      }
    } catch (err: any) {
      setStatus("failed");
      setError(err.message || "Transaction failed");

      if (btn) {
        btn.innerHTML = '<span class="material-symbols-outlined text-sm">error</span> Failed - Try Again';
        btn.disabled = false;
        btn.classList.remove("opacity-80", "cursor-not-allowed");
      }
    }
  }

  if (error && !txData) {
    return (
      <main className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-md text-center">
          <span className="material-symbols-outlined text-4xl text-red-400 mb-3">error_outline</span>
          <h2 className="text-lg font-bold text-gray-800 mb-2">No Transaction Data</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={() => router.push("/send")} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
            Go to Send
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs text-gray-400 font-semibold animate-slide-blur">
          <span>Send Money</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>Enter Amount</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">Review & Confirm</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left */}
          <div className="lg:col-span-7 space-y-4">
            {/* Transaction Summary */}
            <div className="bg-white rounded-xl shadow-sm p-5 lg:p-6 overflow-hidden border border-gray-200 opacity-0 animate-on-scroll">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-primary">Transaction Summary</h2>
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span className="text-[10px] font-bold">Secured by Stellar</span>
                </div>
              </div>
              <div className="text-center py-6 border-b border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Total to Recipient</p>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {txData?.toAmount || "0.00"} <span className="text-sm text-gray-400 font-semibold">{txData?.toAsset || ""}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  ≈ {txData?.fromAmount} {txData?.fromAsset}
                </p>
              </div>
              <div className="space-y-3 py-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Sending Amount</span>
                  <span className="font-semibold text-gray-800">{txData?.fromAmount} {txData?.fromAsset}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1"><span className="text-gray-500">Network Fee</span><span className="material-symbols-outlined text-sm text-gray-300 cursor-help">info</span></div>
                  <span className="font-semibold text-gray-800">~0.00001 XLM</span>
                </div>
                <div className="flex justify-between items-center text-sm text-secondary font-bold">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span>Exchange Rate</span>
                  {txData && <span>1 {txData.fromAsset} ≈ {txData.toAmount && txData.fromAmount ? (parseFloat(txData.toAmount) / parseFloat(txData.fromAmount)).toFixed(4) : "?"} {txData.toAsset}</span>}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200">
                <span className="text-sm font-bold text-primary">Total Cost</span>
                <span className="text-sm font-bold text-primary">{txData?.fromAmount} {txData?.fromAsset}</span>
              </div>
            </div>

            {/* Safety Warning */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-3 items-start opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
              <span className="material-symbols-outlined text-red-500 mt-0.5 shrink-0 text-sm">warning</span>
              <div>
                <p className="text-[10px] font-bold text-red-700 mb-0.5 uppercase">Security Verification</p>
                <p className="text-[10px] text-gray-500">Double-check the recipient's wallet address. Assets sent on Stellar cannot be reversed.</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 space-y-4">
            {/* Recipient Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
              <h4 className="text-[10px] text-gray-400 font-bold uppercase mb-3">Recipient Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Stellar Public Key</label>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between group cursor-pointer hover:bg-gray-100 transition-all">
                    <code className="text-[10px] text-gray-500 truncate mr-2">
                      {txData?.recipientAddress?.substring(0, 15)}...{txData?.recipientAddress?.slice(-8) || ""}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(txData?.recipientAddress || "")}
                      className="material-symbols-outlined text-sm text-gray-400 group-hover:text-primary transition-colors"
                    >
                      content_copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 space-y-3 opacity-0 animate-on-scroll" style={{ animationDelay: "200ms" }}>
              <button
                id="confirmBtn"
                className={`w-full text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-md active:shadow-inner ${
                  status === "confirmed" ? "bg-primary" : "bg-secondary"
                }`}
                onClick={handleConfirm}
                disabled={status === "validating" || status === "confirmed"}
              >
                {status === "validating" ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Validating...</>
                ) : status === "confirmed" ? (
                  <><span className="material-symbols-outlined text-sm">check_circle</span> Confirmed</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">send</span> Confirm & Send</>
                )}
              </button>
              {status === "idle" && (
                <button className="w-full bg-gray-50 text-gray-500 text-xs font-semibold py-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all active:scale-95">
                  Cancel & Edit
                </button>
              )}
              {error && status === "failed" && (
                <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>
              )}
              {(status === "validating" || status === "confirmed") && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1.5">
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span id="txHash" className="text-[10px]">
                      {status === "validating" ? "VALIDATING_ON_CHAIN..." : txHash}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${status === "confirmed" ? "bg-primary" : "bg-secondary"} w-full transition-all duration-[3000ms]`} id="progressBar"></div>
                  </div>
                  {txHash && (
                    <p className="text-[8px] text-gray-400 mt-1.5 font-mono">HASH: {txHash}</p>
                  )}
                </div>
              )}
            </div>

            {/* Map Widget */}
            <div className="rounded-xl overflow-hidden border border-gray-200 h-32 lg:h-36 relative group opacity-0 animate-on-scroll" style={{ animationDelay: "300ms", background: "linear-gradient(135deg, #000666 20%, #1a237e 60%)" }}>
              <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
              <div className="absolute bottom-2.5 left-2.5 bg-white/90 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-semibold text-gray-700">
                  Route: {txData?.fromAsset || "?"} → {txData?.toAsset || "?"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}