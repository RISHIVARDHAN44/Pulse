export default function Skeleton() {
  return (
    <div
      id="skeleton-loader"
      className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {/* Skeleton header row */}
      <div
        className="grid items-center px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-primary)]"
        style={{ gridTemplateColumns: "40px 44px 1fr 140px 100px 140px 120px 44px" }}
      >
        <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-6 ml-auto" />
        <div />
        <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-14" />
        <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-10 ml-auto" />
        <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-8 ml-auto" />
        <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-14 ml-auto hidden lg:block" />
        <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-12 ml-auto hidden xl:block" />
        <div />
      </div>
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="grid items-center px-5 py-4 border-b border-[var(--border)]"
          style={{
            gridTemplateColumns: "40px 44px 1fr 140px 100px 140px 120px 44px",
            animationDelay: `${i * 40}ms`,
          }}
        >
          {/* Rank */}
          <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-4 w-6 ml-auto" />

          {/* Coin icon */}
          <div className="flex justify-center">
            <div className="animate-skeleton rounded-full bg-[var(--bg-hover)] h-10 w-10" />
          </div>

          {/* Name + Symbol */}
          <div className="flex flex-col gap-1.5 min-w-0 pl-1">
            <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-4 w-28" />
            <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-14" />
          </div>

          {/* Price */}
          <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-4 w-24 ml-auto" />

          {/* 24h Change */}
          <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-7 w-18 ml-auto" />

          {/* Market Cap */}
          <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-4 w-20 ml-auto hidden lg:block" />

          {/* Volume */}
          <div className="hidden xl:flex flex-col items-end gap-1">
            <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-3 w-16" />
            <div className="animate-skeleton rounded-full bg-[var(--bg-hover)] h-1 w-full" />
          </div>

          {/* Star */}
          <div className="flex justify-center">
            <div className="animate-skeleton rounded-lg bg-[var(--bg-hover)] h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
