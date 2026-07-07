"use client";

import { useEffect } from "react";

export default function AnchorsPage() {
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 animate-slide-blur">
          <div>
            <nav className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 mb-1.5">
              <span>Network</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary">Anchor Comparison</span>
            </nav>
            <h2 className="text-xl lg:text-2xl font-bold text-primary">Anchor Fee Comparison</h2>
            <p className="text-sm text-gray-500 mt-0.5">Real-time off-ramp cost analysis for SEP-24 compliant Stellar anchors.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-1.5 active:scale-95">
              <span className="material-symbols-outlined text-sm">download</span> Export
            </button>
            <button className="px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 active:scale-95">
              <span className="material-symbols-outlined text-sm">refresh</span> Update
            </button>
          </div>
        </div>

        {/* Filters */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3 border border-gray-200 opacity-0 animate-on-scroll">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary mr-1">
            <span className="material-symbols-outlined text-sm">filter_list</span>Filter:
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold transition-all active:scale-95">All</button>
            {["Nigeria", "Philippines", "Brazil", "Mexico", "Ghana"].map((c, i) => (
              <button key={i} className="px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary text-[10px] font-semibold transition-all active:scale-95">{c}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <select className="bg-gray-50 border-none rounded-lg text-xs font-semibold py-1.5 pl-2 pr-6 focus:ring-1 focus:ring-primary">
              <option>USDC</option><option>EURC</option><option>XLM</option>
            </select>
            <select className="bg-gray-50 border-none rounded-lg text-xs font-semibold py-1.5 pl-2 pr-6 focus:ring-1 focus:ring-primary">
              <option>$1,000</option><option>$5,000</option><option>$10,000</option>
            </select>
          </div>
        </section>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider">Anchor</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider hidden sm:table-cell">Corridor</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-right">Fee</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-right hidden md:table-cell">Time</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider hidden lg:table-cell">Score</th>
                  <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { init: "V", name: "Vibrant Finance", domain: "vibrant.io", flag: "🇲🇽", cor: "MXN (Mexico)", fee: "0.50%", est: "$5.00", time: "Instant", tCls: "bg-emerald-50 text-emerald-700", stars: 5, score: "9.8" },
                  { init: "C", name: "Cowrie ICS", domain: "cowrie.exchange", flag: "🇳🇬", cor: "NGN (Nigeria)", fee: "0.75%", est: "$7.50", time: "~15 Min", tCls: "", stars: 4.5, score: "9.2" },
                  { init: "A", name: "Anclap", domain: "anclap.com", flag: "🇦🇷", cor: "ARS (Argentina)", fee: "1.20%", est: "$12.00", time: "1-2 Hrs", tCls: "", stars: 4, score: "8.5" },
                  { init: "T", name: "Tempo", domain: "tempo.eu.com", flag: "🇪🇺", cor: "EUR (Europe)", fee: "0.35%", est: "$3.50", time: "SEPA: 1D", tCls: "", stars: 5, score: "9.9" },
                ].map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-primary">{a.init}</div>
                        <div><p className="text-sm font-semibold text-gray-800">{a.name}</p><p className="text-[10px] text-gray-400">{a.domain}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell"><div className="flex items-center gap-1.5"><span className="text-base">{a.flag}</span><span className="text-xs font-semibold text-gray-600">{a.cor}</span></div></td>
                    <td className="py-3 px-4 text-right"><p className="text-sm font-bold text-secondary">{a.fee}</p><p className="text-[9px] text-gray-400 font-semibold uppercase">Est: ${a.est}</p></td>
                    <td className="py-3 px-4 text-right hidden md:table-cell">
                      {a.tCls ? <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"><span className="material-symbols-outlined text-xs">bolt</span>{a.time}</div> : <p className="text-xs font-semibold text-gray-600">{a.time}</p>}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5 text-emerald-400">
                          {Array.from({ length: Math.floor(a.stars) }).map((_, si) => (
                            <span key={si} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                          {a.stars % 1 !== 0 && <span className="material-symbols-outlined text-sm">star_half</span>}
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 ml-0.5">{a.score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="px-3 py-1.5 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold transition-all active:scale-95">Connect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <p className="text-[10px] font-semibold text-gray-400">4 of 28 anchors</p>
            <div className="flex items-center gap-1.5">
              <button className="p-1 rounded border border-gray-200 text-gray-400 hover:bg-white transition-all disabled:opacity-50" disabled><span className="material-symbols-outlined text-lg">chevron_left</span></button>
              <span className="px-2.5 text-xs font-bold text-primary">1</span>
              <button className="p-1 rounded border border-gray-200 text-gray-400 hover:bg-white transition-all"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
            </div>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 bg-white p-5 lg:p-6 rounded-xl shadow-sm border border-gray-200 opacity-0 animate-on-scroll card-magnetic" style={{ animationDelay: "200ms" }}>
            <h3 className="text-base font-bold text-primary mb-2">Network Insights</h3>
            <p className="text-xs text-gray-500 mb-4">Average off-ramp fees down 12% this quarter.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Avg Fee", value: "0.82%" },
                { label: "Top Speed", value: "Instant", sec: true },
                { label: "Anchors", value: "28 Active" },
                { label: "Volume", value: "$4.2M/d" },
              ].map((s, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">{s.label}</p>
                  <p className={`text-base font-bold ${s.sec ? "text-secondary" : "text-primary"}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-indigo-900 text-white p-5 lg:p-6 rounded-xl relative overflow-hidden flex flex-col justify-between opacity-0 animate-on-scroll card-magnetic" style={{ animationDelay: "300ms" }}>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-0.5 bg-emerald-400 text-emerald-900 text-[9px] font-bold uppercase rounded">Featured</span>
                <span className="material-symbols-outlined text-emerald-400">verified</span>
              </div>
              <h4 className="text-base font-bold mb-1">Smart Anchor v2</h4>
              <p className="text-indigo-200 text-xs">Auto liquidity routing for NGN and GHS.</p>
            </div>
            <button className="relative z-10 w-full mt-4 py-2 bg-white text-primary font-bold rounded-lg hover:bg-emerald-50 transition-all active:scale-95 text-xs">Learn More</button>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </main>
  );
}