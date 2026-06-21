import { formatPercent } from "@/utils/format";

interface BadgeProps {
  value: number;
}

export default function Badge({ value }: BadgeProps) {
  const isPositive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums transition-colors ${
        isPositive
          ? "bg-[var(--green-subtle)] text-[var(--green)]"
          : "bg-[var(--red-subtle)] text-[var(--red)]"
      }`}
      style={{
        boxShadow: isPositive
          ? "0 0 8px rgba(16, 185, 129, 0.1)"
          : "0 0 8px rgba(239, 68, 68, 0.1)",
      }}
    >
      <span className="text-[10px]">{isPositive ? "▲" : "▼"}</span>
      {formatPercent(value)}
    </span>
  );
}
