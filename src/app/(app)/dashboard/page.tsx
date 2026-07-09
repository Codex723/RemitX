"use client";

import { useEffect, useRef } from "react";

// NOTE: This page is static/mocked for the foundation build.
// TODO(contributor): Replace hardcoded numbers with real data:
// - Fetch account balance from Horizon for the user's Stellar public key
// - Fetch recent transaction count from GET /api/transactions
// - Display real stats instead of mock data

export default function DashboardPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        {/* Mobile Welcome */}
        <div className="lg:hidden mb-4">
          <h2 className="text-xl font-bold text-primary">Global Overview</h2>
          <p className="text-sm text-gray-500">Welcome back, Alex.</p>
        </div>

        <div className="grid grid-cols-12 gap-3 lg:gap-4">
          {/* Headline - Desktop */}
          <div className="hidden lg:block col-span-12 mb-2 animate-slide-blur">
            <h2 className="text-2xl font-bold text-primary">Global Overview</h2>
            <p className="text-sm text-gray-500">Welcome back, Alex. Your Stellar assets are performing as expected.</p>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-3 lg:space-y-4">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-primary text-white rounded-xl p-5 shadow-sm overflow-hidden relative group opacity-0 animate-on-scroll">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Main Wallet</p>
                      <h3 className="text-base font-bold">Stellar Lumens</h3>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded-lg">
                      <span className="material-symbols-outlined text-lg">rocket_launch</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl lg:text-3xl font-bold leading-none mb-1">12,450.00 XLM</p>
                    <p className="text-xs text-white/70">≈ $1,344.60 USD</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95">Trade</button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95">Receive</button>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden group opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Stable Asset</p>
                      <h3 className="text-base font-bold text-gray-800">USD Coin</h3>
                    </div>
                    <div className="bg-emerald-50 p-1.5 rounded-lg text-secondary">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl lg:text-3xl font-bold text-gray-800 leading-none mb-1">2,850.15 USDC</p>
                    <p className="text-xs text-gray-400">Digital Dollar (Centre)</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-secondary text-white hover:bg-emerald-800 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95">Swap</button>
                    <button className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95">Details</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Corridors */}
            <div className="space-y-3 opacity-0 animate-on-scroll" style={{ animationDelay: "200ms" }}>
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-800">Active Corridors</h4>
                <button className="text-xs text-primary font-semibold hover:underline">View All Rates</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { pair: "USD → NGN", rate: "1,582.40", change: "+0.4%", cls: "text-emerald-700 bg-emerald-50" },
                  { pair: "EUR → BRL", rate: "5.45", change: "Stable", cls: "text-gray-500 bg-gray-100" },
                  { pair: "GBP → INR", rate: "105.12", change: "-0.12%", cls: "text-red-700 bg-red-50" },
                ].map((c, i) => (
                  <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all cursor-pointer card-magnetic">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`material-symbols-outlined text-sm ${i === 0 ? "text-secondary" : i === 2 ? "text-red-500" : "text-gray-400"}`}>
                        {i === 0 ? "trending_up" : i === 1 ? "compare_arrows" : "trending_down"}
                      </span>
                      <span className="text-xs font-semibold text-gray-700">{c.pair}</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">{c.rate}</p>
                    <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${c.cls}`}>{c.change}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden opacity-0 animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <div className="px-4 lg:px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-800">Recent Activity</h4>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50"><span className="material-symbols-outlined text-lg">filter_list</span></button>
                  <button className="p-1 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-50"><span className="material-symbols-outlined text-lg">download</span></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    <tr>
                      <th className="px-4 lg:px-5 py-2.5">Transaction</th>
                      <th className="px-4 lg:px-5 py-2.5 hidden sm:table-cell">Date</th>
                      <th className="px-4 lg:px-5 py-2.5 text-right">Amount</th>
                      <th className="px-4 lg:px-5 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { icon: "call_made", bg: "bg-emerald-50 text-secondary", name: "Sent to Arinze K.", desc: "Cowrie Integrated", date: "Today, 10:45 AM", amount: "450.00 USDC", fee: "Fee: 0.0001 XLM", status: "Completed", sCls: "bg-emerald-50 text-emerald-700" },
                      { icon: "call_received", bg: "bg-indigo-50 text-indigo-600", name: "Deposit from Bank", desc: "SEP-24 Transfer", date: "May 22, 2024", amount: "1,200.00 USD", fee: "Via ACH", status: "Pending", sCls: "bg-gray-100 text-gray-600" },
                      { icon: "swap_horiz", bg: "bg-purple-50 text-purple-600", name: "XLM → USDC Swap", desc: "Path Payment", date: "May 21, 2024", amount: "1,000 XLM", fee: "Rate: 0.108", status: "Completed", sCls: "bg-emerald-50 text-emerald-700" },
                    ].map((tx, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                        <td className="px-4 lg:px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${tx.bg} flex items-center justify-center`}><span className="material-symbols-outlined text-lg">{tx.icon}</span></div>
                            <div><p className="text-sm font-semibold text-gray-800">{tx.name}</p><p className="text-xs text-gray-400">{tx.desc}</p></div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-5 py-3 text-xs text-gray-500 hidden sm:table-cell">{tx.date}</td>
                        <td className="px-4 lg:px-5 py-3 text-right"><p className="text-sm font-semibold text-gray-800">{tx.amount}</p><p className="text-[10px] text-gray-400">{tx.fee}</p></td>
                        <td className="px-4 lg:px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${tx.sCls}`}>{tx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-3 lg:space-y-4">
            {/* Quick Send */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm opacity-0 animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <h4 className="text-sm font-bold text-gray-800 mb-4">Quick Send</h4>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Asset</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all">
                    <option>USDC (USD Coin)</option>
                    <option>XLM (Stellar Lumens)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Recipient</label>
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="user*stellar.org" type="text" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Amount</label>
                    <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="0.00" type="number" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Memo</label>
                    <input className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Optional" type="text" />
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2" type="submit">
                  Review <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </form>
            </div>

            {/* Network Pulse */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm opacity-0 animate-on-scroll" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Network Pulse</h4>
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div><span className="text-[10px] font-bold text-secondary">Healthy</span></div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Ledger Time", value: "5.2s" },
                  { label: "Base Fee", value: "100 stroops" },
                  { label: "Active Anchors", value: "42 Online" },
                ].map((s, i) => (
                  <div key={i} className={`flex justify-between items-end ${i < 2 ? "border-b border-gray-100 pb-2" : ""}`}>
                    <span className="text-xs text-gray-400">{s.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 mb-1 uppercase font-bold">Volume (24h)</p>
                <div className="flex items-baseline gap-2"><span className="text-lg font-bold text-primary">$4.2M</span><span className="text-[10px] text-secondary font-bold">+12%</span></div>
                <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden"><div className="bg-secondary h-full rounded-full progress-gradient" style={{ width: "65%" }}></div></div>
              </div>
            </div>

            {/* Promo */}
            <div className="relative rounded-xl overflow-hidden group cursor-pointer h-36 lg:h-40 flex flex-col justify-end p-5 opacity-0 animate-on-scroll card-magnetic" style={{ animationDelay: "500ms", background: "linear-gradient(135deg, #000666 0%, #1a237e 100%)" }}>
              <div className="relative z-10">
                <p className="text-white/80 font-bold text-[10px] uppercase tracking-widest">New Corridor</p>
                <h5 className="text-white text-base font-bold">Remit to Brazil.</h5>
                <p className="text-white/60 text-xs mt-0.5">Lower fees for PIX payouts.</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}