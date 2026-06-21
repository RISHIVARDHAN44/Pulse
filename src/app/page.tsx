"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Coin } from "@/types/market";
import { useMarket } from "@/context/MarketContext";
import Header from "@/components/Header";
import PageWrapper from "@/components/PageWrapper";
import SearchBar from "@/components/SearchBar";
import RefreshButton from "@/components/RefreshButton";
import MarketTable from "@/components/MarketTable";
import DetailModal from "@/components/DetailModal";
import ErrorBanner from "@/components/ErrorBanner";
import AreaChart from "@/components/AreaChart";

export default function Home() {
  const { error, refresh, coins } = useMarket();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelectCoin = useCallback((coin: Coin) => {
    setSelectedCoin(coin);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCoin(null);
  }, []);

  // Derive stats
  const stats = useMemo(() => {
    const totalMktCap = coins.reduce((a, c) => a + (c.market_cap || 0), 0);
    const totalVol = coins.reduce((a, c) => a + (c.total_volume || 0), 0);
    const avg24h = coins.length > 0
      ? coins.reduce((a, c) => a + (c.price_change_percentage_24h || 0), 0) / coins.length
      : 0;
    const gainers = coins.filter(c => c.price_change_percentage_24h > 0).length;
    const losers = coins.filter(c => c.price_change_percentage_24h < 0).length;
    const topGainer = coins.length > 0
      ? coins.reduce((best, c) => c.price_change_percentage_24h > best.price_change_percentage_24h ? c : best, coins[0])
      : null;

    return { totalMktCap, totalVol, avg24h, gainers, losers, topGainer };
  }, [coins]);

  const top4Gainers = useMemo(() => {
    return [...coins]
      .filter(c => c.sparkline_in_7d?.price?.length)
      .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
      .slice(0, 4);
  }, [coins]);

  const fmt = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    return `$${n.toFixed(0)}`;
  };

  return (
    <>
      <Header />
      
      {/* ── Main Full Bleed Hero Section ── */}
      <div className="relative w-full overflow-hidden border-b border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="w-full flex flex-col md:flex-row items-stretch min-h-[calc(100vh-64px)]">
          {/* Left Content */}
          <div className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-14 md:py-24 flex flex-col justify-center space-y-6 text-center md:text-left z-10 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] leading-[1.15] tracking-tight">
              Track the pulse of the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]">crypto market</span> in real-time.
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium max-w-xl mx-auto md:mx-0">
              Get instant access to live prices, market caps, and deep analytics for the top performing digital assets across the globe.
            </p>
          </div>
          
          {/* Right Full Bleed Image */}
          <div className="w-full md:w-1/2 lg:w-[55%] relative min-h-[300px] md:min-h-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <img 
              src="/images/hero image.jpg" 
              alt="Crypto Dashboard Hero" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Gradient mask to blend the image seamlessly into the left content */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-surface)]/80 to-transparent w-full h-[150px] md:h-full md:w-2/3 bottom-0 md:left-0"></div>
          </div>
        </div>
      </div>

      <PageWrapper>
        {/* Error/Offline Banners */}
        {isOffline && (
          <div className="mb-5">
            <ErrorBanner
              type="offline"
              message="You're offline — showing cached data"
              onRetry={refresh}
            />
          </div>
        )}
        {error && !isOffline && (
          <div className="mb-5">
            <ErrorBanner
              type="error"
              message={error}
              onRetry={refresh}
            />
          </div>
        )}

        {/* ── Hero Stats Grid ── */}
        {coins.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
            {/* Total Market Cap — Purple gradient */}
            <div
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] group"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #8B5CF6, #A78BFA)",
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.25)",
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 bg-white" />
              <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-white" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">Total Market Cap</span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {fmt(stats.totalMktCap)}
              </span>
            </div>

            {/* 24h Volume — Cyan/Teal gradient */}
            <div
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] group"
              style={{
                background: "linear-gradient(135deg, #0891B2, #06B6D4, #22D3EE)",
                boxShadow: "0 8px 32px rgba(6, 182, 212, 0.25)",
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 bg-white" />
              <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-white" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">24h Volume</span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                {fmt(stats.totalVol)}
              </span>
            </div>

            {/* Gainers vs Losers — Green/Emerald gradient */}
            <div
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] group"
              style={{
                background: "linear-gradient(135deg, #059669, #10B981, #34D399)",
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.25)",
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 bg-white" />
              <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-white" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">Market Movers</span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">{stats.gainers}</span>
                  <span className="text-xs font-medium text-white/60 ml-1">up</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm font-bold text-white/40">vs</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white/80 tabular-nums">{stats.losers}</span>
                  <span className="text-xs font-medium text-white/50 ml-1">down</span>
                </div>
              </div>
            </div>

            {/* Top Performer — Pink/Rose gradient */}
            <div
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] group"
              style={{
                background: "linear-gradient(135deg, #DB2777, #EC4899, #F472B6)",
                boxShadow: "0 8px 32px rgba(236, 72, 153, 0.25)",
              }}
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 bg-white" />
              <div className="absolute -right-2 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-white" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest">Top Performer</span>
              </div>
              {stats.topGainer ? (
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-white">
                    {stats.topGainer.symbol.toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-white/80 ml-2">
                    +{stats.topGainer.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-white/60">—</span>
              )}
            </div>
          </div>
        )}

        {/* ── Controls Row ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <RefreshButton />
        </div>

        {/* ── Top Performers ── */}
        {top4Gainers.length > 0 && !searchQuery && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-4">Top 4 Performing Assets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {top4Gainers.map((coin) => {
                const chartData: [number, number][] = coin.sparkline_in_7d?.price.map((p, i) => [i, p]) || [];
                const isUp = (coin.price_change_percentage_24h || 0) >= 0;
                const color = isUp ? "var(--green)" : "var(--red)";

                return (
                  <div
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin)}
                    className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_8px_24px_var(--accent-glow)] group flex flex-col justify-between h-[180px] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex justify-between items-start z-10">
                      <div className="flex items-center gap-3">
                        <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-sm" />
                        <div>
                          <div className="font-extrabold text-[var(--text-primary)] text-lg leading-tight">{coin.symbol.toUpperCase()}</div>
                          <div className="text-xs text-[var(--text-muted)] font-medium truncate max-w-[80px]">{coin.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[var(--text-primary)]">
                          ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        </div>
                        <div className={`text-sm font-bold flex items-center justify-end gap-1 mt-0.5 ${isUp ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                          {isUp ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
                          )}
                          {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="h-[70px] mt-auto -mx-2 -mb-3 z-10">
                      {chartData.length > 0 && (
                        <AreaChart data={chartData} color={color} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Market Table */}
        <MarketTable
          searchQuery={searchQuery}
          onSelectCoin={handleSelectCoin}
        />

        {/* Footer */}
        <div className="mt-10 pb-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Powered by CoinGecko API · Data updates every 60s
          </p>
        </div>
      </PageWrapper>

      {/* Detail Modal */}
      <DetailModal coin={selectedCoin} onClose={handleCloseModal} />
    </>
  );
}
