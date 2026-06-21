"use client";

import { useMarket } from "@/context/MarketContext";
import { useState, useEffect } from "react";

export default function RefreshButton() {
  const { refresh, loading } = useMarket();
  const [showUpdated, setShowUpdated] = useState(false);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const handleClick = async () => {
    setHasRefreshed(true);
    await refresh();
  };

  useEffect(() => {
    if (hasRefreshed && !loading) {
      setShowUpdated(true);
      const timeout = setTimeout(() => {
        setShowUpdated(false);
        setHasRefreshed(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [loading, hasRefreshed]);

  return (
    <div className="flex items-center gap-3">
      <button
        id="refresh-button"
        onClick={handleClick}
        disabled={loading}
        className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
          boxShadow: loading ? "none" : "0 4px 15px var(--accent-glow)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${loading ? "animate-spin" : "group-hover:rotate-45"}`}
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        Refresh
      </button>
      {showUpdated && (
        <span className="text-xs font-medium text-[var(--green)] animate-fade-in flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Updated
        </span>
      )}
    </div>
  );
}
