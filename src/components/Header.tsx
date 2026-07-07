"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="h-header-height fixed top-0 right-0 left-0 lg:left-sidebar-width z-40 bg-surface-container-lowest/95 dark:bg-surface-dim backdrop-blur-md border-b border-outline-variant dark:border-outline shadow-sm flex justify-between items-center px-margin-mobile lg:px-margin-desktop transition-all duration-300">
        {/* Left side - Mobile hamburger + search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-all active:scale-90"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{sidebarOpen ? "close" : "menu"}</span>
          </button>

          <div className="relative w-full hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary-container text-body-sm transition-all duration-300 focus:bg-surface-container-lowest"
              placeholder="Search transactions, anchors..."
              type="text"
            />
          </div>
          {/* Mobile search icon */}
          <button className="sm:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-space-lg">
          {/* Notification bell with shake animation */}
          <button className="relative p-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container-low active:scale-90 group">
            <span className="material-symbols-outlined group-hover:animate-shake">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-breath"></span>
          </button>

          {/* Wallet */}
          <button className="hidden sm:flex p-2 text-on-surface-variant hover:text-primary transition-all rounded-lg hover:bg-surface-container-low active:scale-90">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-outline-variant mx-1"></div>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-space-sm cursor-pointer group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-primary-container bg-primary flex items-center justify-center text-on-primary font-bold text-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
              AS
            </div>
            <div className="hidden lg:block text-left">
              <p className="font-label-md text-on-surface leading-tight">Alex Sterling</p>
              <p className="text-[10px] text-outline uppercase tracking-wider font-bold">Premier Account</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}