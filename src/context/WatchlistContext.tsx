"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface WatchlistState {
  watchlist: string[];
  toggle: (id: string) => void;
  isWatched: (id: string) => boolean;
}

const WatchlistContext = createContext<WatchlistState | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("pulse_watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("pulse_watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, mounted]);

  const toggle = useCallback((id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const isWatched = useCallback(
    (id: string) => watchlist.includes(id),
    [watchlist]
  );

  return (
    <WatchlistContext.Provider value={{ watchlist, toggle, isWatched }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist(): WatchlistState {
  const context = useContext(WatchlistContext);
  if (!context)
    throw new Error("useWatchlist must be used within WatchlistProvider");
  return context;
}
