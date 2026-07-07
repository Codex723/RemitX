"use client";

import React, { useEffect } from "react";

export default function RoutesPage() {
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
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 gap-4 animate-slide-blur">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-primary mb-1">Path Payment Router</h2>
            <p className="text-sm text-gray-500 max-w-2xl">Find the most efficient liquidity paths across the Stellar DEX and AMMs.</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
              <span className="material-symbols-outlined text-xs mr-1">bolt</span>Real-time
            </span>
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold">
              <span className="material-symbols-outlined text-xs mr-1">sync</span>Updated 4s ago
            </span>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 opacity-0 animate-on-scroll">
          <div className="flex flex-wrap items-center gap-4">
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">You Send</p><p className="text-lg font-bold text-primary flex items-center gap-2">1,000.00 <span className="text-sm font-semibold text-gray-500">USDC</span></p></div>
            <span className="material-symbols-outlined text-gray-300 hidden sm:inline">arrow_forward</span>
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">They Receive</p><p className="text-lg font-bold text-primary flex items-center gap-2">~1,245.50 <span className="text-sm font-semibold text-gray-500">EURC</span></p></div>
          </div>
          <div className="hidden lg:block h-8 w-px bg-gray-200"></div>
          <div className="flex flex-wrap items-center gap-4">
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">Origin</p><p className="text-sm font-semibold text-gray-700">United States</p></div>
            <div><p className="text-[10px] text-gray-400 uppercase font-bold">Dest</p><p className="text-sm font-semibold text-gray-700">European Union</p></div>
            <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"><span className="material-symbols-outlined text-sm">edit</span>Modify</button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          {[
            { best: true, type: "Router Optimized", name: "Direct DEX Path", fee: "0.01 USDC", delivery: "< 5s", rate: "0.9412", change: "+0.04%", path: ["USDC", "DEX", "EURC"] },
            { best: false, type: "Fastest", name: "AMM Pool V3", fee: "0.30 USDC", delivery: "Instant", rate: "0.9385", change: null, path: ["USDC", "AMM", "EURC"] },
            { best: false, type: "Multi-hop", name: "XLM Bridge", fee: "0.05 XLM", delivery: "~12s", rate: "0.9398", change: null, path: ["USDC", "XLM", "EURC"] },
          ].map((option, i) => (
            <div key={i} className={`flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden transition-all group opacity-0 animate-on-scroll card-magnetic ${option.best ? "border-2 border-primary relative" : "border border-gray-200"}`} style={{ animationDelay: `${i * 100}ms` }}>
              {option.best && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs">stars</span> BEST VALUE
                  </div>
                </div>
              )}
              <div className="p-4 lg:p-5 border-b border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{option.type}</p>
                <h3 className={`text-base font-bold mb-3 ${option.best ? "text-primary" : "text-gray-800"}`}>{option.name}</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Fee</span><span className="text-sm font-semibold text-gray-700">{option.fee}</span></div>
                  <div className="flex justify-between items-center"><span className="text-xs text-gray-500">Delivery</span><span className="text-sm font-semibold text-gray-700">{option.delivery}</span></div>
                </div>
              </div>
              <div className="p-4 lg:p-5 flex-grow space-y-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Exchange Rate</p>
                  <p className="text-sm font-bold text-gray-800">1 USDC = {option.rate} EURC</p>
                  {option.change && <p className="text-[10px] text-emerald-600 mt-1 flex items-center"><span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>{option.change} better</p>}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Path</p>
                  <div className="flex items-center gap-1.5">
                    {option.path.map((p, pi) => (
                      <React.Fragment key={`${option.name}-${pi}`}>
                        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[8px] text-gray-700">{p}</div>
                        {pi < option.path.length - 1 && <div className="flex-1 h-px bg-gray-200"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 lg:p-5 pt-0">
                <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${option.best ? "bg-primary text-white hover:bg-indigo-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}>
                  {option.best ? "Select Optimized Path" : `Select ${option.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Historical Table */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden opacity-0 animate-on-scroll" style={{ animationDelay: "400ms" }}>
          <div className="p-4 lg:p-5 border-b border-gray-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <h3 className="text-sm font-bold text-gray-800">Historical Comparison</h3>
            <select className="bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold text-gray-600 py-1.5 px-2 focus:ring-primary">
              <option>Volatility: Low</option>
              <option>Volatility: Med</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                <th className="px-4 lg:px-5 py-3">Provider</th>
                <th className="px-4 lg:px-5 py-3">Avg Fee</th>
                <th className="px-4 lg:px-5 py-3 hidden sm:table-cell">Success</th>
                <th className="px-4 lg:px-5 py-3 hidden md:table-cell">Depth</th>
                <th className="px-4 lg:px-5 py-3">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { icon: "hub", name: "Stellar DEX", desc: "Decentralized", fee: "0.00001 XLM", rate: "99.9%", w: "w-[99%]", depth: "$4.2M" },
                  { icon: "waves", name: "AMM Pool", desc: "Auto Liquidity", fee: "0.3% Spread", rate: "100%", w: "w-[100%]", depth: "$12.8M" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 lg:px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${i === 0 ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"} rounded flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-lg">{row.icon}</span>
                        </div>
                        <div><p className="text-sm font-semibold text-gray-800">{row.name}</p><p className="text-[10px] text-gray-400">{row.desc}</p></div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-5 py-3 text-sm font-semibold text-gray-700">{row.fee}</td>
                    <td className="px-4 lg:px-5 py-3 hidden sm:table-cell"><div className="flex items-center gap-2"><div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`${row.w} h-full bg-secondary`}></div></div><span className="text-[10px] font-bold text-secondary">{row.rate}</span></div></td>
                    <td className="px-4 lg:px-5 py-3 text-xs text-gray-500 hidden md:table-cell">{row.depth}</td>
                    <td className="px-4 lg:px-5 py-3"><button className="text-xs text-primary font-semibold hover:underline">{i === 0 ? "View Ledger" : "View Pool"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}