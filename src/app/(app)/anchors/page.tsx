"use client";

import { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";

export default function AnchorsPage() {
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
          <h2 className="text-xl lg:text-2xl font-bold text-primary mb-1">Anchors</h2>
          <p className="text-sm text-gray-500">Registered Stellar anchors providing fiat on/off ramps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Cowrie Integrated", code: "cowrie", region: "Nigeria", pairs: "NGN/USD", status: "Active" },
            { name: "Tempo", code: "tempo", region: "Europe", pairs: "EUR/USD", status: "Active" },
            { name: "Bridge", code: "bridge", region: "Global", pairs: "USDC/USD", status: "Active" },
            { name: "Bitazza", code: "bitazza", region: "Brazil", pairs: "BRL/USD", status: "Pending" },
          ].map((anchor, i) => (
            <div key={anchor.code} className="bg-white rounded-xl p-5 border border-gray-200 opacity-0 animate-on-scroll card-magnetic" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{anchor.name}</p>
                  <p className="text-xs text-gray-400">{anchor.region}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-gray-400">Asset Pairs</span><span className="font-semibold text-gray-700">{anchor.pairs}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-400">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${anchor.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {anchor.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}