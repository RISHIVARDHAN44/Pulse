"use client";

import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useMarket } from "@/context/MarketContext";
import { timeAgo } from "@/utils/format";

export default function Header() {
  const { theme, toggle } = useTheme();
  const { lastUpdated } = useMarket();

  return (
    <header
      id="header"
      className="sticky top-0 z-40 h-20 border-b border-[var(--border)] shadow-sm"
      style={{
        background: "var(--header-blur)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 h-full flex items-center justify-between">
        {/* Left: Custom Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center relative hover:opacity-90 transition-opacity cursor-pointer">
            <Image
              src={theme === "dark" ? "/images/pulse_logo_dark.png" : "/images/pulse_logo_light.png"}
              alt="Pulse Logo"
              width={160}
              height={48}
              className={`object-contain max-h-[48px] w-auto ${theme === 'dark' ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
              style={{ width: "auto", height: "auto", maxHeight: "48px" }}
              priority
            />
          </div>
          <div className="hidden md:flex items-center h-6 border-l border-[var(--border)] pl-4 ml-1">
            <span className="text-sm font-medium text-[var(--text-primary)] tracking-wide">
              Market Dashboard
            </span>
          </div>
        </div>

        {/* Right: Status + Live indicator + Dark mode toggle */}
        <div className="flex items-center gap-5">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[var(--green-subtle)] border border-[var(--green)]/20">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[var(--green)]" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--green)] animate-ping opacity-75" />
            </div>
            <span className="text-xs font-bold tracking-wider text-[var(--green)] uppercase">Live Market</span>
          </div>

          {lastUpdated && (
            <span className="hidden lg:inline text-xs font-medium text-[var(--text-muted)]">
              Updated {timeAgo(lastUpdated)}
            </span>
          )}

          {/* Theme toggle with sleek circular shape */}
          <button
            id="theme-toggle"
            onClick={toggle}
            className="relative p-2.5 rounded-full transition-all duration-300 bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 hover:shadow-[0_0_15px_var(--accent-glow)]"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
