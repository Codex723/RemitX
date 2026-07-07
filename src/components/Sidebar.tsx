"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/send", icon: "payments", label: "Send Money" },
  { href: "/routes", icon: "compare_arrows", label: "Route Comparison" },
  { href: "/anchors", icon: "account_balance", label: "Anchor Fees" },
  { href: "/rates", icon: "currency_exchange", label: "Rates/DEX" },
  { href: "/activity", icon: "history", label: "Activity" },
  { href: "/review", icon: "fact_check", label: "Review" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay lg:hidden ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`w-sidebar-width h-screen fixed left-0 top-0 bg-surface dark:bg-inverse-surface border-r border-outline-variant dark:border-outline flex flex-col py-space-lg z-50 overflow-y-auto custom-scrollbar sidebar-desktop transition-all duration-300 lg:translate-x-0 ${isOpen ? "open" : ""}`}>
        <div className="px-space-lg mb-space-xl">
          <Link href="/" className="flex items-center gap-space-sm group" onClick={onClose}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">RemitX</h1>
              <p className="font-label-sm text-label-sm text-outline">Stellar Network</p>
            </div>
          </Link>
        </div>

        {/* Close button on mobile */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}

        <nav className="flex-1 px-space-md space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-space-md px-space-md py-3 rounded-lg transition-all duration-200 group animate-fade-in-up ${
                isActive(item.href)
                  ? "text-primary dark:text-primary-fixed-dim font-bold border-r-4 border-primary dark:border-primary-fixed-dim bg-primary/5 dark:bg-primary-container/20"
                  : "text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-low"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 icon-bounce ${isActive(item.href) ? "text-primary" : ""}`}>{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
              {isActive(item.href) && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-breath"></span>
              )}
            </Link>
          ))}
        </nav>

        <div className="px-space-md mt-auto pt-space-lg border-t border-outline-variant dark:border-outline space-y-2">
          <Link
            href="/"
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 ripple"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add Funds
          </Link>
          <Link
            href="#"
            className="flex items-center gap-space-md px-space-md py-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md">Support</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-space-md px-space-md py-2 text-on-surface-variant hover:text-error transition-all rounded-lg hover:bg-error-container/10"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md">Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}