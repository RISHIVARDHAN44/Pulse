"use client";

import { useState, useMemo, useCallback } from "react";
import { Coin } from "@/types/market";
import { useMarket } from "@/context/MarketContext";
import { useWatchlist } from "@/context/WatchlistContext";
import MarketRow from "./MarketRow";
import Skeleton from "./Skeleton";

interface MarketTableProps {
  searchQuery: string;
  onSelectCoin: (coin: Coin) => void;
}

type TabType = "all" | "watchlist";
type PerformanceFilter = "all" | "gainers" | "losers";

export default function MarketTable({
  searchQuery,
  onSelectCoin,
}: MarketTableProps) {
  const { coins, loading } = useMarket();
  const { watchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [performanceFilter, setPerformanceFilter] = useState<PerformanceFilter>("all");

  const filteredCoins = useMemo(() => {
    let result = coins;

    if (activeTab === "watchlist") {
      result = result.filter(coin => watchlist.includes(coin.id));
    }

    if (performanceFilter === "gainers") {
      result = result.filter(coin => (coin.price_change_percentage_24h || 0) > 0);
    } else if (performanceFilter === "losers") {
      result = result.filter(coin => (coin.price_change_percentage_24h || 0) < 0);
    }

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    return result;
  }, [coins, searchQuery, activeTab, watchlist, performanceFilter]);

  const handleSelect = useCallback(
    (coin: Coin) => {
      onSelectCoin(coin);
    },
    [onSelectCoin]
  );

  if (loading && coins.length === 0) {
    return <Skeleton />;
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${
              activeTab === "all"
                ? "text-[var(--text-primary)] border-[var(--accent)]"
                : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-[1px] flex items-center gap-2 ${
              activeTab === "watchlist"
                ? "text-[var(--text-primary)] border-[var(--accent)]"
                : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
            }`}
          >
            Watchlist
            {watchlist.length > 0 && (
              <span className="text-[10px] bg-[var(--bg-hover)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded-full border border-[var(--border)]">
                {watchlist.length}
              </span>
            )}
          </button>
        </div>

        {/* Performance Filter */}
        <div className="flex bg-[var(--bg-hover)] rounded-lg p-1 mb-2">
          <button
            onClick={() => setPerformanceFilter("all")}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all ${
              performanceFilter === "all"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setPerformanceFilter("gainers")}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1 ${
              performanceFilter === "gainers"
                ? "bg-[var(--bg-surface)] text-[var(--green)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--green)]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
            Gainers
          </button>
          <button
            onClick={() => setPerformanceFilter("losers")}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1 ${
              performanceFilter === "losers"
                ? "bg-[var(--bg-surface)] text-[var(--red)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--red)]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
            Losers
          </button>
        </div>
      </div>

      {filteredCoins.length === 0 ? (
        <div
          id="market-table-empty"
          className="flex flex-col items-center justify-center py-24 gap-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--accent-subtle), transparent)",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--accent)]"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-[var(--text-secondary)]">
              No assets found
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {activeTab === "watchlist" 
                ? "You haven't added any assets to your watchlist yet." 
                : "Try searching for a different coin or symbol."}
            </p>
          </div>
        </div>
      ) : (
        <div
          id="market-table"
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden"
          style={{ boxShadow: "var(--card-shadow)" }}
        >
          {/* Column Headers */}
          <div className="grid items-center px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-primary)]"
            style={{ gridTemplateColumns: "40px 44px 1fr 140px 100px 110px 140px 120px 44px" }}
          >
            <span className="text-[11px] font-semibold text-[var(--text-muted)] text-right uppercase tracking-wider">
              #
            </span>
            <div /> {/* Icon spacer */}
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Asset
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] text-right uppercase tracking-wider">
              Price
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] text-right uppercase tracking-wider">
              24h %
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] text-center uppercase tracking-wider hidden md:block">
              Last 7 Days
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] text-right uppercase tracking-wider hidden lg:block">
              Market Cap
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] text-right uppercase tracking-wider hidden xl:block">
              Volume (24h)
            </span>
            <div /> {/* Star spacer */}
          </div>

          {/* Rows */}
          {filteredCoins.map((coin, index) => (
            <MarketRow key={coin.id} coin={coin} onSelect={handleSelect} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
