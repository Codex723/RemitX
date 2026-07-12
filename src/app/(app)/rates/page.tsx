"use client";

import { useEffect, useState } from "react";

interface RateData {
  rate: string;
  fromAsset: string;
  toAsset: string;
  fetchedAt: string;
  source: string;
}

const ASSET_PAIRS = [
  { from: "USDC", to: "NGN", label: "USDC/NGN" },
  { from: "XLM", to: "USDC", label: "XLM/USDC" },
  { from: "EURC", to: "USDC", label: "EURC/USDC" },
  { from: "USD", to: "EUR", label: "USD/EUR" },
  { from: "USDC", to: "KES", label: "USDC/KES" },
  { from: "USDC", to: "GHS", label: "USDC/GHS" },
];

export default function RatesPage() {
  const [activePair, setActivePair] = useState("USDC/NGN");
  const [rates, setRates] = useState<Record<string, RateData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all rates on mount
  useEffect(() => {
    async function fetchAllRates() {
      setLoading(true);
      setError(null);
      const results: Record<string, RateData> = {};

      for (const pair of ASSET_PAIRS) {
        try {
          const res = await fetch(
            `/api/stellar/rate?from=${pair.from}&to=${pair.to}`
          );
          const json = await res.json();
          if (json.success) {
            results[pair.label] = json.data;
          }
        } catch {
          // Keep partial results
        }
      }

      setRates(results);
      setLoading(false);
    }

    fetchAllRates();

    // Refresh every 60 seconds
    const interval = setInterval(fetchAllRates, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for animations
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
    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rates]);

  const activeRate = rates[activePair];
  const activePairConfig = ASSET_PAIRS.find((p) => p.label === activePair);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 animate-slide-blur">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
              Rates & DEX Monitor
            </h2>
            <p className="text-sm text-gray-500">
              Real-time Stellar DEX spreads and automated threshold alerts.
            </p>
          </div>
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {ASSET_PAIRS.map((pair) => (
              <button
                key={pair.label}
                onClick={() => setActivePair(pair.label)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
                  activePair === pair.label
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-500 hover:bg-white"
                }`}
              >
                {pair.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart + Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-200 opacity-0 animate-on-scroll">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                {loading && !activeRate ? (
                  <div className="animate-pulse">
                    <div className="h-7 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                  </div>
                ) : activeRate ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold text-gray-800">
                        {parseFloat(activeRate.rate).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                      </span>
                      {activeRate.source === "fallback" && (
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                          stale
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Current {activeRate.fromAsset}/{activeRate.toAsset} Rate
                    </p>
                    <p className="text-[9px] text-gray-400 mt-1">
                      Updated{" "}
                      {new Date(activeRate.fetchedAt).toLocaleTimeString()}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-bold text-gray-400">
                        --
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Rate unavailable
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    loading ? "bg-amber-400" : "bg-secondary"
                  }`}
                ></span>
                <span className="text-[10px] text-gray-400">
                  {loading ? "Loading..." : "Live from CoinGecko + Frankfurter"}
                </span>
              </div>
            </div>
            <div className="h-[180px] lg:h-[250px] w-full">
              <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 800 200"
              >
                <defs>
                  <linearGradient
                    id="cg"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#006b5c"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="100%"
                      stopColor="#006b5c"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 Q50,140 100,160 T200,130 T300,100 T400,110 T500,80 T600,90 T700,60 T800,70 L800,200 L0,200 Z"
                  fill="url(#cg)"
                />
                <path
                  d="M0,150 Q50,140 100,160 T200,130 T300,100 T400,110 T500,80 T600,90 T700,60 T800,70"
                  fill="none"
                  stroke="#006b5c"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
            <div className="flex justify-between mt-3 text-[10px] text-gray-400">
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>Now</span>
            </div>
          </div>
          <div
            className="space-y-4 opacity-0 animate-on-scroll"
            style={{ animationDelay: "100ms" }}
          >
            <div className="bg-primary text-white rounded-xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between h-full">
              <div className="relative z-10">
                <h3 className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">
                  DEX Liquidity
                </h3>
                <p className="text-lg font-bold">$2.4M USDC</p>
              </div>
              <div className="relative z-10 space-y-2.5 mt-4">
                {activeRate ? (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-70">Rate</span>
                      <span className="font-bold">
                        {parseFloat(activeRate.rate).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-70">Source</span>
                      <span className="font-bold capitalize">
                        {activeRate.source === "cache" ? "cached" : "live"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-70">Best Bid</span>
                      <span className="font-bold">--</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="opacity-70">Best Ask</span>
                      <span className="font-bold">--</span>
                    </div>
                  </>
                )}
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-300 w-3/4 h-full progress-gradient"></div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Create Alert Form */}
        <section
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-0 animate-on-scroll"
          style={{ animationDelay: "200ms" }}
        >
          <div className="p-4 lg:p-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800">
              Create New Rate Alert
            </h3>
          </div>
          <form
            className="p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const toast = document.getElementById("toast");
              if (toast) {
                toast.classList.remove("translate-y-20", "opacity-0");
                toast.classList.add("translate-y-0", "opacity-100");
                setTimeout(() => {
                  toast.classList.add("translate-y-20", "opacity-0");
                  toast.classList.remove("translate-y-0", "opacity-100");
                }, 5000);
              }
            }}
          >
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Asset Pair
              </label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                {ASSET_PAIRS.map((pair) => (
                  <option key={pair.label}>{pair.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Condition
              </label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option>Rises Above</option>
                <option>Drops Below</option>
                <option>Reaches Exactly</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Threshold
              </label>
              <div className="relative">
                <input
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none pr-10"
                  placeholder="Enter threshold"
                  type="number"
                  step="any"
                />
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 font-semibold">
                  {activePair.split("/")[1] || "NGN"}
                </span>
              </div>
            </div>
            <div>
              <button
                className="w-full bg-secondary text-white py-2.5 rounded-lg text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                type="submit"
              >
                <span className="material-symbols-outlined text-sm">
                  add_alert
                </span>{" "}
                Set Alert
              </button>
            </div>
          </form>
        </section>

        {/* Active Alerts */}
        <section
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-0 animate-on-scroll"
          style={{ animationDelay: "300ms" }}
        >
          <div className="p-4 lg:p-5 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-800">
              Active Rate Monitors
            </h3>
            <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              4 Active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold">
                  <th className="px-4 lg:px-5 py-3">Pair</th>
                  <th className="px-4 lg:px-5 py-3 hidden sm:table-cell">
                    Condition
                  </th>
                  <th className="px-4 lg:px-5 py-3">Threshold</th>
                  <th className="px-4 lg:px-5 py-3 hidden md:table-cell">
                    Current
                  </th>
                  <th className="px-4 lg:px-5 py-3">Status</th>
                  <th className="px-4 lg:px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { p1: "USDC", p2: "NGN", cond: "Rises Above", th: "1,650.00", st: "Monitoring", sCls: "bg-emerald-50 text-emerald-700" },
                  { p1: "XLM", p2: "USDC", cond: "Drops Below", th: "0.1042", st: "Monitoring", sCls: "bg-emerald-50 text-emerald-700" },
                  { p1: "EURC", p2: "USDC", cond: "Reaches Exactly", th: "1.0900", st: "Near Hit", sCls: "bg-red-50 text-red-700" },
                ].map((a, i) => {
                  const label = `${a.p1}/${a.p2}`;
                  const live = rates[label];
                  const diff = live
                    ? (
                        (parseFloat(live.rate) -
                          parseFloat(a.th.replace(/,/g, ""))) /
                        parseFloat(a.th.replace(/,/g, "")) *
                        100
                      ).toFixed(2)
                    : null;

                  return (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-4 lg:px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex -space-x-1.5">
                            <div
                              className={`w-7 h-7 rounded-full ${
                                i === 0
                                  ? "bg-primary"
                                  : i === 1
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-blue-600"
                              } flex items-center justify-center text-[8px] text-white border-2 border-white`}
                            >
                              {a.p1}
                            </div>
                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[8px] text-white border-2 border-white">
                              {a.p2}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-700">
                            {label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-xs text-gray-500 hidden sm:table-cell">
                        {a.cond}
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-xs font-bold text-gray-700">
                        {a.th}
                      </td>
                      <td className="px-4 lg:px-5 py-3 hidden md:table-cell">
                        <span
                          className={`text-xs font-bold ${
                            diff !== null && parseFloat(diff) > 0
                              ? "text-secondary"
                              : diff !== null && parseFloat(diff) < 0
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {live
                            ? `${diff !== null ? (parseFloat(diff) > 0 ? "+" : "") + diff + "%" : "--"}`
                            : "loading..."}
                        </span>
                      </td>
                      <td className="px-4 lg:px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${a.sCls}`}
                        >
                          {a.st}
                        </span>
                      </td>
                      <td className="px-4 lg:px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-1 text-gray-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-sm">
                              edit
                            </span>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-sm">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-200 text-center">
            <button className="text-[10px] text-primary font-bold hover:underline">
              View All Alert History
            </button>
          </div>
        </section>
      </div>

      {/* Toast */}
      <div
        className="fixed bottom-6 right-6 translate-y-20 opacity-0 transition-all duration-500 z-[100]"
        id="toast"
      >
        <div className="bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400">
            check_circle
          </span>
          <div>
            <p className="text-xs font-bold">Alert Created</p>
            <p className="text-[10px] opacity-80">
              We will notify you at the threshold
            </p>
          </div>
          <button
            className="ml-2 opacity-60 hover:opacity-100"
            onClick={() => {
              const t = document.getElementById("toast");
              if (t) {
                t.classList.add("translate-y-20", "opacity-0");
                t.classList.remove("translate-y-0", "opacity-100");
              }
            }}
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </main>
  );
}