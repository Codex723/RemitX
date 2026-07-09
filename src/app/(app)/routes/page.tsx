"use client";

import React, { useEffect, useState } from "react";
import { PageSkeleton } from "@/components/Skeleton";

export default function RoutesPage() {
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
          <h2 className="text-xl lg:text-2xl font-bold text-primary mb-1">Payment Routes</h2>
          <p className="text-sm text-gray-500">Optimized Stellar path payments for each corridor.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { from: "United States", to: "Nigeria", path: "USD → USDC → NGN", hops: 2, time: "3.2s", fee: "0.0001 XLM" },
            { from: "United States", to: "Germany", path: "USD → EUR", hops: 1, time: "4.1s", fee: "0.0001 XLM" },
            { from: "United Kingdom", to: "Nigeria", path: "GBP → USDC → NGN", hops: 2, time: "3.8s", fee: "0.0001 XLM" },
            { from: "Nigeria", to: "Philippines", path: "NGN → USDC → PHP", hops: 2, time: "4.5s", fee: "0.0001 XLM" },
          ].map((route, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 opacity-0 animate-on-scroll card-magnetic" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-800">{route.from} → {route.to}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{route.path}</p>
                </div>
                <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[9px] font-bold">{route.hops} Hop{route.hops > 1 ? 's' : ''}</span>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                <div><p className="text-[9px] text-gray-400 uppercase font-bold">Speed</p><p className="text-sm font-bold text-gray-700">{route.time}</p></div>
                <div><p className="text-[9px] text-gray-400 uppercase font-bold">Fee</p><p className="text-sm font-bold text-gray-700">{route.fee}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}