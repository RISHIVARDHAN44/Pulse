"use client";

interface ErrorBannerProps {
  type: "offline" | "error";
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ type, message, onRetry }: ErrorBannerProps) {
  if (type === "offline") {
    return (
      <div
        id="error-banner-offline"
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-amber-400/30 text-amber-600 dark:text-amber-300 text-sm animate-fade-in-up"
        style={{
          background: "linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.04))",
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <span className="flex-1 font-medium">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/20 text-amber-700 dark:text-amber-200 hover:bg-amber-400/30 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      id="error-banner-api"
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--red)]/20 text-[var(--red)] text-sm animate-fade-in-up"
      style={{
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.06), rgba(220, 38, 38, 0.03))",
      }}
    >
      <div className="w-8 h-8 rounded-lg bg-[var(--red-subtle)] flex items-center justify-center shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <span className="flex-1 font-medium">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          style={{
            background: "linear-gradient(135deg, var(--red), var(--pink))",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
