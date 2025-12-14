"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Lock, Send, Shield, Signal } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Activity },
  { name: "Signals", href: "/signals", icon: Signal },
  { name: "Immune System", href: "/immune", icon: Lock },
  { name: "Publish Score", href: "/publish-score", icon: Send },
];

const Navigation = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                StabilityNet
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation */}
          <div className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Connect Wallet */}
          <div className="hidden md:flex items-center gap-3">
            <WalletConnect />
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              {mobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </span>
                </Link>
              );
            })}
            <div className="mt-2 px-3">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

