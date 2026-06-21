"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Coin } from "@/types/market";
import { fetchTopCoins } from "@/services/coinGecko";

interface MarketState {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

const MarketContext = createContext<MarketState | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const cachedCoins = useRef<Coin[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTopCoins();
      cachedCoins.current = data;
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch market data";

      if (message.includes("429")) {
        setError("Rate limit reached — please wait a moment");
      } else if (
        typeof window !== "undefined" &&
        !navigator.onLine
      ) {
        setError("You're offline — showing cached data");
      } else {
        setError(message);
      }

      // Show cached data on error
      if (cachedCoins.current.length > 0) {
        setCoins(cachedCoins.current);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <MarketContext.Provider
      value={{ coins, loading, error, lastUpdated, refresh }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket(): MarketState {
  const context = useContext(MarketContext);
  if (!context)
    throw new Error("useMarket must be used within MarketProvider");
  return context;
}
