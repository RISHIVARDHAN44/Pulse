"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(newValue);
      }, 200);
    },
    [onSearch]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div id="search-bar" className="relative group">
      {/* Gradient glow effect when focused */}
      {isFocused && (
        <div
          className="absolute -inset-0.5 rounded-xl opacity-50 blur-sm transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
          }}
        />
      )}
      <div className="relative">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            isFocused ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
          }`}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by name or symbol..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] text-sm transition-all duration-200"
          style={{
            boxShadow: isFocused
              ? "0 0 0 3px var(--accent-glow)"
              : "var(--card-shadow)",
          }}
        />
        {value && (
          <button
            onClick={() => {
              setValue("");
              onSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
