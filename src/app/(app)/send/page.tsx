"use client";

import { useState, useEffect } from "react";

export default function SendMoneyPage() {
  const [amount, setAmount] = useState("1000.00");
  const exchangeRate = 0.8425;
  const converted = (parseFloat(amount) || 0) * exchangeRate;

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
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="mb-6 animate-slide-blur">
          <h2 className="text-xl lg:text-2xl font-bold text-primary mb-1">Send Money Globally</h2>
          <p className="text-sm text-gray-500">Seamless cross-border payments powered by the Stellar Network.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Left - Form */}
          <div className="lg:col-span-7 space-y-4">
            <section className="bg-white rounded-xl shadow-sm p-5 lg:p-6 border border-gray-200 opacity-0 animate-on-scroll">
              <h3 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">swap_horiz</span>
                Transfer Details
              </h3>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 ml-1">You Send</label>
                  <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <input className="flex-1 px-4 py-3.5 border-none text-lg font-bold focus:ring-0 outline-none" placeholder="0.00" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <div className="bg-gray-50 flex items-center px-3 gap-2 cursor-pointer hover:bg-gray-100 transition-colors border-l border-gray-200">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[8px] font-bold">US</div>
                      <span className="text-sm font-semibold text-gray-700">USD</span>
                      <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 ml-1">Recipient Gets</label>
                  <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
                    <input className="flex-1 px-4 py-3.5 border-none text-lg font-bold bg-gray-50 focus:ring-0 text-gray-400 outline-none" readOnly type="number" value={converted.toFixed(2)} />
                    <div className="bg-gray-50 flex items-center px-3 gap-2 cursor-pointer hover:bg-gray-100 transition-colors border-l border-gray-200">
                      <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-white text-[8px] font-bold">EU</div>
                      <span className="text-sm font-semibold text-gray-700">EUR</span>
                      <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Recipient Details</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 ml-1">Stellar Address</label>
                      <div className="relative">
                        <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all pl-10 text-sm" placeholder="G... or user@email.com" type="text" />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">alternate_email</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 ml-1">Reference (Optional)</label>
                      <input className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="Invoice #1024" type="text" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Recipients */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 opacity-0 animate-on-scroll" style={{ animationDelay: "100ms" }}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-800">Recent Recipients</h4>
                <button className="text-xs text-primary font-semibold hover:underline">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {["Sofia M.", "Marcus L.", "Elena K."].map((name, i) => (
                  <button key={i} className="flex flex-col items-center gap-1.5 group min-w-fit transition-all hover:scale-105">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm border-2 border-transparent group-hover:border-primary transition-all">{name.charAt(0)}</div>
                    <span className="text-[10px] text-gray-500">{name}</span>
                  </button>
                ))}
                <button className="flex flex-col items-center gap-1.5 min-w-fit">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-gray-200 transition-all cursor-pointer"><span className="material-symbols-outlined text-lg">add</span></div>
                  <span className="text-[10px] text-gray-500">New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <section className="bg-primary text-white rounded-xl p-5 lg:p-6 shadow-xl relative overflow-hidden opacity-0 animate-on-scroll" style={{ animationDelay: "200ms" }}>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
              <h3 className="text-base font-bold mb-6 relative z-10">Transaction Summary</h3>
              <div className="space-y-4 relative z-10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm opacity-80"><span>Exchange Rate</span><span className="font-semibold">1 USD = {exchangeRate} EUR</span></div>
                  <div className="flex justify-between items-center text-sm opacity-80"><span>RemitX Fee</span><span className="font-semibold">$0.50 USD</span></div>
                  <div className="flex justify-between items-center text-sm opacity-80"><span>Anchor Fee</span><span className="font-semibold">$1.25 USD</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10"><span className="text-sm">Total Cost</span><span className="font-bold">${(parseFloat(amount || "0") + 1.75).toFixed(2)} USD</span></div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                  <div className="flex flex-col items-center py-1">
                    <span className="text-[10px] opacity-70 uppercase tracking-widest mb-1">Recipient Receives</span>
                    <div className="flex items-baseline gap-1.5"><span className="text-2xl lg:text-3xl font-bold">{converted.toFixed(2)}</span><span className="text-sm">EUR</span></div>
                    <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1.5"><span className="material-symbols-outlined text-xs">schedule</span>Instant Delivery</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 bg-indigo-900/30 rounded-lg text-blue-200 text-[10px] leading-relaxed">
                  <span className="material-symbols-outlined text-sm shrink-0">info</span>
                  <p>Verify the Stellar address carefully. Funds sent cannot be recovered.</p>
                </div>
                <button className="w-full bg-emerald-400 text-emerald-900 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                  Continue to Review <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">arrow_forward</span>
                </button>
              </div>
            </section>
            <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-gray-200 opacity-0 animate-on-scroll" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div><span className="text-xs text-gray-500">Stellar: Active</span></div>
              <div className="text-right"><p className="text-[10px] uppercase font-bold text-gray-400">Speed</p><p className="text-xs font-semibold text-gray-700">3.5s Avg.</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}