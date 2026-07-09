"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string | null;
  recipientAddress: string;
  stellarTxHash: string | null;
  status: string;
  createdAt: string;
  confirmedAt: string | null;
}

export default function ActivityPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (data.success) {
          setTransactions(data.data.transactions);
          setTotal(data.data.total);
        } else {
          setError(data.error || "Failed to load transactions");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl lg:text-2xl font-bold text-primary mb-1">Activity</h2>
        <p className="text-sm text-gray-500 mb-6">Your recent transactions on the Stellar Network.</p>

        {loading && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            Loading transactions...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">receipt_long</span>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No transactions yet</h3>
            <p className="text-sm text-gray-400">Send your first payment to see it here.</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    <th className="px-4 lg:px-5 py-3">Transaction</th>
                    <th className="px-4 lg:px-5 py-3">Date</th>
                    <th className="px-4 lg:px-5 py-3 text-right">Amount</th>
                    <th className="px-4 lg:px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-4 lg:px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-secondary flex items-center justify-center">
                            <span className="material-symbols-outlined text-lg">call_made</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Sent {tx.fromAsset} → {tx.toAsset}
                            </p>
                            <p className="text-xs text-gray-400">
                              To: {tx.recipientAddress.substring(0, 8)}...{tx.recipientAddress.slice(-4)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-right">
                        <p className="text-sm font-semibold text-gray-800">{tx.fromAmount} {tx.fromAsset}</p>
                        {tx.toAmount && <p className="text-[10px] text-gray-400">→ {tx.toAmount} {tx.toAsset}</p>}
                      </td>
                      <td className="px-4 lg:px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          tx.status === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                          tx.status === "failed" ? "bg-red-50 text-red-700" :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 text-center text-xs text-gray-400 border-t border-gray-100">
              {total} transaction{total !== 1 ? 's' : ''} total
            </div>
          </div>
        )}
      </div>
    </main>
  );
}