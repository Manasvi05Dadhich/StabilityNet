"use client";

import Link from "next/link";
import { Shield, FileText, Github, ExternalLink, FileCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
              <path
                d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
                stroke="url(#shield-gradient)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span className="text-sm font-medium">
              <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                StabilityNet
              </span>{" "}
              <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                Protocol
              </span>
            </span>
          </div>

          {/* Center: Links */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <FileText className="h-4 w-4" />
              <span>Docs</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Contract</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <FileCheck className="h-4 w-4" />
              <span>Audit</span>
            </Link>
          </div>

          {/* Right: Powered by */}
          <div className="text-sm">
            <span className="text-zinc-400">Powered by </span>
            <span className="text-blue-400 font-medium">StabilityNet Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

