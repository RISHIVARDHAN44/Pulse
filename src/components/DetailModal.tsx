"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Coin, CoinDetail } from "@/types/market";
import { fetchCoinDetail, fetchCoinMarketChart } from "@/services/coinGecko";
import {
  formatPrice,
  formatMarketCap,
  formatSupply,
} from "@/utils/format";
import Badge from "./Badge";
import AreaChart from "./AreaChart";
import { useWatchlist } from "@/context/WatchlistContext";

interface DetailModalProps {
  coin: Coin | null;
  onClose: () => void;
}

type Timeframe = 1 | 7 | 30;

export default function DetailModal({ coin, onClose }: DetailModalProps) {
  const [detail, setDetail] = useState<CoinDetail | null>(null);
  const [chartData, setChartData] = useState<[number, number][]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>(7);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isWatched, toggle } = useWatchlist();

  // Fetch Details
  useEffect(() => {
    if (!coin) {
      setDetail(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchCoinDetail(coin.id)
      .then((data) => {
        setDetail(data);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load details"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coin]);

  // Fetch Chart Data
  useEffect(() => {
    if (!coin) return;
    
    setChartLoading(true);
    fetchCoinMarketChart(coin.id, timeframe)
      .then((data) => {
        setChartData(data.prices);
      })
      .catch((err) => console.error("Chart fetch error", err))
      .finally(() => setChartLoading(false));
  }, [coin, timeframe]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (coin) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [coin, onClose]);

  const handleToggleWatchlist = useCallback(() => {
    if (coin) toggle(coin.id);
  }, [coin, toggle]);

  if (!coin) return null;

  const watched = isWatched(coin.id);

  return (
    <>
      {/* Backdrop */}
      <div
        id="detail-modal-backdrop"
        className="fixed inset-0 z-40 animate-fade-in"
        style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        id="detail-modal"
        className="fixed inset-y-0 right-0 w-full md:w-[500px] lg:w-[600px] bg-[var(--bg-surface)] border-l border-[var(--border)] z-50 overflow-y-auto animate-slide-in-right flex flex-col"
        style={{
          boxShadow: "-20px 0 80px rgba(0, 0, 0, 0.4)",
        }}
      >
        <ModalContent
          coin={coin}
          detail={detail}
          chartData={chartData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          loading={loading}
          chartLoading={chartLoading}
          error={error}
          watched={watched}
          onClose={onClose}
          onToggleWatchlist={handleToggleWatchlist}
        />
      </div>
    </>
  );
}

interface ModalContentProps {
  coin: Coin;
  detail: CoinDetail | null;
  chartData: [number, number][];
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  loading: boolean;
  chartLoading: boolean;
  error: string | null;
  watched: boolean;
  onClose: () => void;
  onToggleWatchlist: () => void;
}

function ModalContent({
  coin,
  detail,
  chartData,
  timeframe,
  setTimeframe,
  loading,
  chartLoading,
  error,
  watched,
  onClose,
  onToggleWatchlist,
}: ModalContentProps) {
  
  const chartColor = useMemo(() => {
    if (chartData.length < 2) return "var(--accent)";
    const first = chartData[0][1];
    const last = chartData[chartData.length - 1][1];
    return last >= first ? "var(--green)" : "var(--red)";
  }, [chartData]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Navigation / Close */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-hover)] flex items-center justify-center ring-1 ring-[var(--border)]">
            {coin.image ? (
              <Image src={coin.image} alt={coin.name} width={40} height={40} className="rounded-full" style={{ width: "auto", height: "auto" }} />
            ) : (
              <span className="text-sm font-bold text-[var(--text-muted)]">{coin.symbol.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              {coin.name}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
                #{coin.market_cap_rank}
              </span>
            </h2>
            <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider">{coin.symbol}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--border)] transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {error && (
          <div className="p-4 mb-6 rounded-xl bg-[var(--red-subtle)] text-[var(--red)] text-sm font-medium border border-[var(--red)]/20">
            {error}
          </div>
        )}

        {/* Price & Primary Stats */}
        <div className="mb-8">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-5xl font-extrabold text-[var(--text-primary)] tabular-nums tracking-tight">
              {formatPrice(detail?.current_price ?? coin.current_price)}
            </span>
          </div>
          <Badge value={detail?.price_change_percentage_24h ?? coin.price_change_percentage_24h} size="lg" />
        </div>

        {/* Interactive Chart Section */}
        <div className="mb-10 bg-[var(--bg-primary)] rounded-3xl p-5 border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-[var(--text-secondary)]">Historical Price</h3>
            <div className="flex bg-[var(--bg-hover)] rounded-xl p-1 border border-[var(--border)]">
              {(['1', '7', '30'] as const).map(tf => {
                const num = parseInt(tf) as Timeframe;
                return (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(num)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      timeframe === num 
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm' 
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    {tf}D
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="h-[240px] w-full rounded-xl overflow-hidden relative">
            {chartLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/50 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              </div>
            )}
            <AreaChart data={chartData} color={chartColor} />
          </div>
        </div>

        {loading ? (
           <div className="space-y-4 mb-8">
             {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="animate-skeleton rounded-2xl bg-[var(--bg-hover)] h-16 w-full" />
             ))}
           </div>
        ) : detail && (
          <>
            {/* Range Bar */}
            <div className="mb-10 px-2">
              <div className="flex justify-between text-sm text-[var(--text-muted)] font-medium mb-3">
                <span className="tabular-nums">{formatPrice(detail.low_24h)}</span>
                <span className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
                  24h Range
                </span>
                <span className="tabular-nums">{formatPrice(detail.high_24h)}</span>
              </div>
              <div className="h-3 rounded-full bg-[var(--bg-hover)] overflow-hidden relative ring-1 ring-inset ring-[var(--border)]">
                <div
                  className="h-full rounded-full animate-gradient-shift"
                  style={{
                    background: "linear-gradient(90deg, var(--red), var(--orange), var(--green))",
                    backgroundSize: "200% 200%",
                    width: `${
                      detail.high_24h !== detail.low_24h
                        ? Math.min(100, Math.max(0, ((detail.current_price - detail.low_24h) / (detail.high_24h - detail.low_24h)) * 100))
                        : 50
                    }%`,
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-[var(--accent)]"
                  style={{
                    left: `${
                      detail.high_24h !== detail.low_24h
                        ? Math.min(98, Math.max(2, ((detail.current_price - detail.low_24h) / (detail.high_24h - detail.low_24h)) * 100))
                        : 50
                    }%`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 0 10px var(--accent-glow)",
                  }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Market Stats</h3>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <StatCard label="Market Cap" value={formatMarketCap(detail.market_cap)} />
              <StatCard label="Total Volume" value={formatMarketCap(detail.total_volume)} />
              <StatCard label="Circulating Supply" value={formatSupply(detail.circulating_supply)} />
              <StatCard 
                label="All-Time High" 
                value={formatPrice(detail.ath)} 
                subValue={detail.ath_date ? new Date(detail.ath_date).toLocaleDateString() : undefined} 
              />
            </div>
          </>
        )}
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="sticky bottom-0 p-6 bg-[var(--bg-surface)]/90 backdrop-blur-md border-t border-[var(--border)]">
        <button
          onClick={onToggleWatchlist}
          className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] ${
            watched
              ? "bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border)]"
              : "text-white shadow-lg"
          }`}
          style={
            !watched
              ? {
                  background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                  boxShadow: "0 8px 25px var(--accent-glow)",
                }
              : undefined
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={watched ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={watched ? "text-[var(--orange)]" : ""}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {watched ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue }: { label: string; value: string; subValue?: string }) {
  return (
    <div className="rounded-2xl p-4 bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-center">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">
        {label}
      </p>
      <p className="text-lg font-extrabold text-[var(--text-primary)] tabular-nums tracking-tight">
        {value}
      </p>
      {subValue && (
        <p className="text-[10px] text-[var(--text-secondary)] font-medium mt-1">
          {subValue}
        </p>
      )}
    </div>
  );
}
