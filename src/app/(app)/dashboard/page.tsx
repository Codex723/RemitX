"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface DashboardData {
  transactionCount: number;
  recentTx: {
    id: string;
    fromAmount: string;
    fromAsset: string;
    toAsset: string;
    status: string;
    createdAt: string;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/transactions?limit=1");
        const result = await res.json();
        if (result.success) {
          setData({
            transactionCount: result.data.total,
            recentTx: result.data.transactions[0] || null,
          });
        }
      } catch {
        // Silently fail — dashboard shows welcome state
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();

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

  return (
    <main ref={mainRef} className="p-4 lg:p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="lg:hidden mb-4">
          <h2 className="text-xl font-bold text-primary">Global Overview</h2>
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `${data?.transactionCount || 0} transaction${data?.transactionCount !== 1 ? 's' : ''} sent`}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-3 lg:gap-4">
          <div className="hidden lg:block col-span-12 mb-2 animate-slide-blur">
            <h2 className="text-2xl font-bold text-primary">Global Overview</h2>
            <p className="text-sm text-gray-500">
              {loading ? "Loading your dashboard..." : `${data?.transactionCount || 0} transaction${data?.transactionCount !== 1 ? 's' : ''} sent via Stellar.`}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-primary text-white rounded-xl p-5 shadow-sm overflow-hidden relative group opacity-0 animate-on-scroll">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Connected</p>
                      <h3 className="text-base font-bold">Stellar Network</h3>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl lg:text-3xl font-bold leading-none mb-1">{data?.transactionCount || 0} TX</p>
                    <p className="text-xs text-white/70">Lifetime transactions</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push("/send")}
                      className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => router.push("/activity")}
                      className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                    >
                      Activity
                    </button>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden group opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Network</p>
                      <h3 className="text-base font-bold text-gray-800">Testnet</h3>
                    </div>
                    <div className="bg-emerald-50 p-1.5 rounded-lg text-secondary">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800 leading-none mb-1">Active</p>
                    <p className="text-xs text-gray-400">Stellar Testnet</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push("/rates")}
                      className="flex-1 bg-secondary text-white hover:bg-emerald-800 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                    >
                      Rates
                    </button>
                    <button
                      onClick={() => router.push("/anchors")}
                      className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                    >
                      Anchors
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden opacity-0 animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <div className="px-4 lg:px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-800">Recent Activity</h4>
                <button
                  onClick={() => router.push("/activity")}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
                ) : data?.recentTx ? (
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                      <tr>
                        <th className="px-4 lg:px-5 py-2.5">Transaction</th>
                        <th className="px-4 lg:px-5 py-2.5">Amount</th>
                        <th className="px-4 lg:px-5 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50 transition-all cursor-pointer">
                        <td className="px-4 lg:px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-secondary flex items-center justify-center">
                              <span className="material-symbols-outlined text-lg">call_made</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                Sent {data.recentTx.fromAsset} → {data.recentTx.toAsset}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-5 py-3">
                          <p className="text-sm font-semibold text-gray-800">{data.recentTx.fromAmount} {data.recentTx.fromAsset}</p>
                        </td>
                        <td className="px-4 lg:px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            data.recentTx.status === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                            data.recentTx.status === "failed" ? "bg-red-50 text-red-700" :
                            "bg-amber-50 text-amber-700"
                          }`}>
                            {data.recentTx.status}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm">
                    No transactions yet.{" "}
                    <button onClick={() => router.push("/send")} className="text-primary font-semibold hover:underline">
                      Send your first payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-3 lg:space-y-4">
            {/* Quick Send */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm opacity-0 animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <h4 className="text-sm font-bold text-gray-800 mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/send")}
                  className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">send</span> Send Money
                </button>
                <button
                  onClick={() => router.push("/activity")}
                  className="w-full bg-gray-50 text-gray-700 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">receipt_long</span> View Activity
                </button>
              </div>
            </div>

            {/* Network Pulse */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm opacity-0 animate-on-scroll" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Statistics</h4>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-secondary">Healthy</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                  <span className="text-xs text-gray-400">Total Transactions</span>
                  <span className="text-sm font-semibold text-gray-800">{data?.transactionCount || 0}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-400">Network</span>
                  <span className="text-sm font-semibold text-gray-800">Stellar Testnet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}