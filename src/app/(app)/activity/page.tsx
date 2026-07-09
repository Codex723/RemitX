"use client";

import { useEffect, useState } from "react";
import { ActivitySkeleton } from "@/components/Skeleton";

// NOTE: This page is static/mocked for the foundation build.
// TODO(contributor): Replace the hardcoded rows with a real call to
// GET /api/transactions.

export default function ActivityPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
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
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (loading) return <ActivitySkeleton />;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold animate-slide-blur">
          <a className="hover:text-primary transition-colors" href="#">Activity</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">TX-90218341</span>
        </nav>

        <div className="grid grid-cols-12 gap-4">
          {/* Progress Tracker */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm p-5 lg:p-6 border border-gray-200 relative overflow-hidden opacity-0 animate-on-scroll">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-gray-800">Current Progress</h3>
              <span className="px-3 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">IN TRANSIT</span>
            </div>
            <div className="relative flex justify-between items-start pt-4 overflow-x-auto pb-2">
              <div className="absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gray-200 min-w-[250px]"></div>
              <div className="absolute top-[44px] left-[10%] w-[40%] h-[2px] bg-secondary shadow-[0_0_6px_rgba(0,107,92,0.3)] min-w-[100px]"></div>
              {[
                { icon: "check", label: "Initiated", detail: "Oct 24, 09:12 AM", active: true, done: true },
                { icon: "autorenew", label: "Routing", detail: "Processing", active: true, done: false },
                { icon: "account_balance", label: "Anchor", detail: "Pending", active: false, done: false },
                { icon: "check_circle", label: "Delivered", detail: "Est. 2m", active: false, done: false },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center gap-2 min-w-[70px] lg:min-w-0">
                  <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-sm border-4 border-white transition-all duration-300 ${
                    step.active ? step.done ? "bg-secondary text-white" : "bg-emerald-50 text-secondary step-pulse" : "bg-gray-100 text-gray-300"
                  }`}>
                    <span className="material-symbols-outlined text-sm lg:text-base">{step.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] lg:text-xs font-bold ${step.active ? "text-gray-700" : "text-gray-400"}`}>{step.label}</p>
                    <p className={`text-[8px] lg:text-[9px] ${step.active ? "text-gray-400" : "text-gray-300"}`}>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Route Map */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
            <div className="h-36 lg:h-40 relative" style={{ background: "linear-gradient(135deg, #000666 20%, #1a237e 60%, #006b5c 100%)" }}>
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold text-primary border border-gray-200">LIVE ROUTE</div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Network Pathway</p>
                <p className="text-xs font-semibold text-gray-700">USD (Stellar) → EUR (Sep-24)</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] text-secondary font-bold">Optimal Path Secured</span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="col-span-12 bg-white rounded-xl shadow-sm border border-gray-200 opacity-0 animate-on-scroll" style={{ animationDelay: "200ms" }}>
            <div className="px-4 lg:px-5 py-3 border-b border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <h3 className="text-sm font-bold text-gray-800">Transaction Stats</h3>
              <a className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline" href="#">
                View on StellarExpert <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
            <div className="p-4 lg:p-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Sending Amount", value: "1,450.00", unit: "USD", desc: "From: GC7E...L9W2" },
                { label: "Recipient Receives", value: "1,368.42", unit: "EUR", desc: "To: GDF5...A7X2", hi: true },
                { label: "Exchange Rate", value: "0.9437", unit: "USD/EUR", desc: "Guaranteed 15m", badge: true },
                { label: "Network Fee", value: "0.0001", unit: "XLM", desc: "High Priority", bolt: true },
              ].map((b, i) => (
                <div key={i} className="space-y-1">
                  <label className="text-[9px] text-gray-400 font-bold uppercase">{b.label}</label>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold ${b.hi ? "text-secondary" : "text-gray-800"}`}>{b.value}</span>
                    <span className="text-[10px] text-gray-400">{b.unit}</span>
                  </div>
                  {b.badge ? <p className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">{b.desc}</p>
                  : b.bolt ? <div className="flex items-center gap-1 text-emerald-500"><span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span><p className="text-[9px]">{b.desc}</p></div>
                  : <p className="text-[9px] text-gray-400">{b.desc}</p>}
                </div>
              ))}
            </div>

            {/* Action Log */}
            <div className="border-t border-gray-200 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 lg:px-5 py-2.5 text-[9px] text-gray-400 font-bold uppercase">TIME</th>
                    <th className="px-4 lg:px-5 py-2.5 text-[9px] text-gray-400 font-bold uppercase">EVENT</th>
                    <th className="px-4 lg:px-5 py-2.5 text-[9px] text-gray-400 font-bold uppercase">STATUS</th>
                    <th className="px-4 lg:px-5 py-2.5 text-[9px] text-gray-400 font-bold uppercase hidden sm:table-cell">LEDGER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { time: "09:12:45 AM", ev: "Transaction Initiated", st: "Complete", sCls: "bg-emerald-50 text-emerald-700", ledger: "#52091244" },
                    { time: "09:12:50 AM", ev: "Pathfinding Analysis", st: "Complete", sCls: "bg-emerald-50 text-emerald-700", ledger: "#52091251" },
                    { time: "09:13:02 AM", ev: "Anchor confirming reserves...", st: "Active", sCls: "bg-amber-50 text-amber-700 animate-pulse", ledger: "#52091288", active: true },
                  ].map((log, i) => (
                    <tr key={i} className={`hover:bg-gray-50 transition-all duration-200 ${i === 2 ? "bg-amber-50/30" : ""}`}>
                      <td className="px-4 lg:px-5 py-3 text-xs text-gray-600">{log.time}</td>
                      <td className="px-4 lg:px-5 py-3 text-xs font-semibold text-gray-700">{log.ev}</td>
                      <td className="px-4 lg:px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${log.sCls}`}>
                          {log.active && <span className="w-1 h-1 rounded-full bg-amber-500"></span>}
                          {!log.active && <span className="w-1 h-1 rounded-full bg-emerald-500"></span>}
                          {log.st}
                        </span>
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-[9px] text-primary font-mono hidden sm:table-cell">{log.ledger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full py-3 flex flex-col lg:flex-row justify-between items-center gap-3 px-4 border-t border-gray-200 bg-white rounded-xl">
          <div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-700">RemitX</span><p className="text-[10px] text-gray-400">© 2024 RemitX. Powered by Stellar.</p></div>
          <nav className="flex gap-3"><a className="text-[10px] text-gray-400 hover:text-primary transition-colors" href="#">Privacy</a><a className="text-[10px] text-gray-400 hover:text-primary transition-colors" href="#">Terms</a><a className="text-[10px] text-gray-400 hover:text-primary transition-colors" href="#">Compliance</a><a className="text-[10px] text-gray-400 hover:text-primary transition-colors" href="#">Security</a></nav>
        </footer>
      </div>

      {/* Support FAB */}
      <button className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group z-50">
        <span className="material-symbols-outlined text-xl">support_agent</span>
        <span className="absolute right-14 bg-gray-900 text-white px-2.5 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Live Help</span>
      </button>
    </main>
  );
}