import { formatPercent } from "@/utils/format";

interface BadgeProps {
  value: number;
  size?: "sm" | "lg";
}

export default function Badge({ value, size = "sm" }: BadgeProps) {
  const isPositive = value >= 0;

  const sizeClasses = size === "lg" 
    ? "px-3 py-1.5 rounded-xl text-sm" 
    : "px-2.5 py-1 rounded-lg text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold tabular-nums transition-colors ${sizeClasses} ${
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
