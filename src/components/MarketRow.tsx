"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { Coin } from "@/types/market";
import { formatPrice, formatMarketCap } from "@/utils/format";
import Badge from "./Badge";
import Sparkline from "./Sparkline";
import { useWatchlist } from "@/context/WatchlistContext";

interface MarketRowProps {
  coin: Coin;
  onSelect: (coin: Coin) => void;
  index: number;
}

const MarketRow = React.memo(function MarketRow({
  coin,
  onSelect,
  index,
}: MarketRowProps) {
  const { isWatched, toggle } = useWatchlist();
  const watched = isWatched(coin.id);

  const handleStarClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggle(coin.id);
    },
    [coin.id, toggle]
  );

  const handleRowClick = useCallback(() => {
    onSelect(coin);
  }, [coin, onSelect]);

  // Mini volume bar (percentage of max volume across visible set)
  const volumePercent = coin.market_cap > 0
    ? Math.min(100, Math.max(8, (coin.total_volume / coin.market_cap) * 100 * 5))
    : 20;

  return (
    <div
      id={`market-row-${coin.id}`}
      onClick={handleRowClick}
      className="group grid items-center px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-[var(--bg-hover)] border-b border-[var(--border)] relative animate-row-enter"
      style={{
        gridTemplateColumns: "40px 44px 1fr 140px 100px 110px 140px 120px 44px",
        animationDelay: `${index * 25}ms`,
      }}
    >
      {/* Hover accent line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: "linear-gradient(to bottom, var(--gradient-start), var(--gradient-end))",
        }}
      />

      {/* Rank */}
      <span className="text-xs font-medium text-[var(--text-muted)] text-right tabular-nums">
        {coin.market_cap_rank}
      </span>

      {/* Coin Logo */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-hover)] flex items-center justify-center ring-1 ring-[var(--border)] group-hover:ring-[var(--accent)]/40 transition-all duration-200 group-hover:scale-110">
          {coin.image ? (
            <Image
              src={coin.image}
              alt={coin.name}
              width={40}
              height={40}
              className="rounded-full"
              style={{ width: "auto", height: "auto" }}
            />
          ) : (
            <span className="text-xs font-bold text-[var(--text-muted)]">
              {coin.symbol.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Name + Symbol */}
      <div className="flex flex-col min-w-0 pl-1">
        <span className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors duration-200">
          {coin.name}
        </span>
        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
          {coin.symbol}
        </span>
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-[var(--text-primary)] tabular-nums text-right">
        {formatPrice(coin.current_price)}
      </span>

      {/* 24h Change */}
      <div className="flex justify-end">
        <Badge value={coin.price_change_percentage_24h} />
      </div>
      
      {/* 7d Sparkline Graph */}
      <div className="hidden md:flex justify-center px-2">
        <Sparkline data={coin.sparkline_in_7d?.price || []} />
      </div>

      {/* Market Cap */}
      <span className="text-sm font-medium text-[var(--text-secondary)] tabular-nums text-right hidden lg:block">
        {formatMarketCap(coin.market_cap)}
      </span>

      {/* Volume with mini bar */}
      <div className="hidden xl:flex flex-col items-end gap-1">
        <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums">
          {formatMarketCap(coin.total_volume)}
        </span>
        <div className="w-full h-1 rounded-full bg-[var(--bg-hover)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${volumePercent}%`,
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-end))",
            }}
          />
        </div>
      </div>

      {/* Star */}
      <div className="flex justify-center">
        <button
          id={`star-${coin.id}`}
          onClick={handleStarClick}
          className={`p-1.5 rounded-lg transition-all duration-200 ${
            watched
              ? "text-amber-400 hover:text-amber-500 hover:bg-amber-400/10"
              : "text-[var(--text-muted)] hover:text-amber-400 hover:bg-amber-400/10"
          }`}
          aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={watched ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${watched ? "scale-110" : "group-hover:scale-110"}`}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export default MarketRow;
