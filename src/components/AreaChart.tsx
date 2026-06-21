import React from 'react';

interface AreaChartProps {
  data: [number, number][]; // [timestamp, price]
  color: string;
}

export default function AreaChart({ data, color }: AreaChartProps) {
  if (!data || data.length === 0) return (
    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
      No chart data available
    </div>
  );

  const width = 800;
  const height = 300;
  const padding = { top: 10, right: 0, bottom: 0, left: 0 };
  
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const prices = data.map(d => d[1]);
  // Add 5% padding to top and bottom of chart data
  const minPriceRaw = Math.min(...prices);
  const maxPriceRaw = Math.max(...prices);
  const paddingY = (maxPriceRaw - minPriceRaw) * 0.05;
  const minPrice = minPriceRaw - paddingY;
  const maxPrice = maxPriceRaw + paddingY;
  const priceRange = maxPrice - minPrice || 1;
  
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * innerWidth;
    const y = padding.top + innerHeight - ((d[1] - minPrice) / priceRange) * innerHeight;
    return `${x},${y}`;
  }).join(' ');

  const gradId = `area-grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  // For the fill, close the path to the bottom corners
  const fillPoints = `${points} ${width - padding.right},${height} ${padding.left},${height}`;

  return (
    <div className="w-full h-full relative group">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          points={fillPoints}
          fill={`url(#${gradId})`}
          className="transition-all duration-300 ease-in-out"
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ vectorEffect: 'non-scaling-stroke' }}
          className="transition-all duration-300 ease-in-out drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
        />
      </svg>
    </div>
  );
}
