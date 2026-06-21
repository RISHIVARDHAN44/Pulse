import React from 'react';

export default function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const width = 100;
  const height = 32;
  const padding = 2;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - padding - ((d - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? 'var(--green)' : 'var(--red)';

  // Create gradient ID based on color to prevent collisions
  const gradId = `grad-${isUp ? 'up' : 'down'}`;

  // Polygon points to create a fill under the line
  const fillPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="w-[100px] h-[32px] flex items-center justify-center relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={fillPoints}
          fill={`url(#${gradId})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ vectorEffect: 'non-scaling-stroke' }}
        />
      </svg>
    </div>
  );
}
