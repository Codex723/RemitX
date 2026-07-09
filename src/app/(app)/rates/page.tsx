"use client";

import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";

export default function RatesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
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

  if (loading) return <div className="min-h-screen bg-gray-50/50"><PageSkeleton /></div>;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="mb-6 animate-slide-blur">
          <h2 className="text-xl lg:text-2xl font-bold text-primary mb-1">Live Exchange Rates</h2>
          <p className="text-sm text-gray-500">Real-time cross-border rates powered by the Stellar Network.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { from: "USD", to: "NGN", rate: "1,582.40", change: "+0.4%", trend: "up" },
            { from: "USD", to: "EUR", rate: "0.92", change: "-0.1%", trend: "down" },
            { from: "USD", to: "GBP", rate: "0.79", change: "Stable", trend: "flat" },
            { from: "EUR", to: "NGN", rate: "1,717.00", change: "+0.3%", trend: "up" },
            { from: "GBP", to: "NGN", rate: "2,000.00", change: "+0.2%", trend: "up" },
            { from: "USD", to: "PHP", rate: "58.50", change: "-0.2%", trend: "down" },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 opacity-0 animate-on-scroll card-magnetic" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-sm ${r.trend === "up" ? "text-secondary" : r.trend === "down" ? "text-red-500" : "text-gray-400"}`}>
                  {r.trend === "up" ? "trending_up" : r.trend === "down" ? "trending_down" : "compare_arrows"}
                </span>
                <span className="text-sm font-semibold text-gray-700">{r.from} → {r.to}</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{r.rate}</p>
              <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${
                r.trend === "up" ? "bg-emerald-50 text-emerald-700" :
                r.trend === "down" ? "bg-red-50 text-red-700" :
                "bg-gray-100 text-gray-500"
              }`}>{r.change}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}