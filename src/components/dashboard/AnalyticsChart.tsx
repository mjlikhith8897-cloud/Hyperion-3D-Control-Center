import React, { useState } from 'react';
import { AreaChart, Layers, ArrowUpRight, Filter, RefreshCw, BarChart2 } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { TimeRange } from '../../types/dashboard';

interface AnalyticsChartProps {
  accentHex: string;
  timeRange: TimeRange;
}

interface DataPoint {
  time: string;
  throughput: number;
  cpu: number;
  iops: number;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  accentHex,
  timeRange,
}) => {
  const [metric, setMetric] = useState<'throughput' | 'cpu' | 'iops'>('throughput');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Time series based on range
  const chartData: DataPoint[] = [
    { time: '02:00', throughput: 580, cpu: 54, iops: 18.2 },
    { time: '04:00', throughput: 610, cpu: 58, iops: 19.4 },
    { time: '06:00', throughput: 590, cpu: 55, iops: 17.8 },
    { time: '08:00', throughput: 720, cpu: 71, iops: 24.1 },
    { time: '10:00', throughput: 810, cpu: 78, iops: 28.5 },
    { time: '12:00', throughput: 880, cpu: 84, iops: 31.2 },
    { time: '14:00', throughput: 842, cpu: 79, iops: 29.8 },
    { time: '16:00', throughput: 915, cpu: 89, iops: 33.6 },
    { time: '18:00', throughput: 890, cpu: 82, iops: 30.4 },
    { time: '20:00', throughput: 860, cpu: 77, iops: 27.9 },
    { time: '22:00', throughput: 820, cpu: 73, iops: 25.1 },
    { time: '24:00', throughput: 842, cpu: 78, iops: 28.3 },
  ];

  const values = chartData.map((d) => d[metric]);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.1;
  const range = maxVal - minVal || 1;

  const svgWidth = 800;
  const svgHeight = 240;

  // Build points
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - 40 - ((d[metric] - minVal) / range) * (svgHeight - 70);
    return { x, y, ...d };
  });

  // SVG path for line
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  // Closed path for area gradient
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - 30} L ${points[0].x} ${svgHeight - 30} Z`;

  const currentHoverData = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  const getMetricLabel = () => {
    if (metric === 'throughput') return { unit: 'GB/s', title: 'Network Bandwidth Flux' };
    if (metric === 'cpu') return { unit: '%', title: 'vCPU Compute Allocation' };
    return { unit: 'k IOPS', title: 'NVMe Cluster Storage IO' };
  };

  const { unit, title } = getMetricLabel();

  return (
    <TiltCard glowColor={`${accentHex}20`} maxTilt={4} className="w-full">
      <div className="p-5 md:p-6 flex flex-col space-y-5">
        {/* Top Header & Metric Selectors */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-tight">
                {title}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({timeRange.toUpperCase()} Interval)
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white">
                {currentHoverData[metric]} {unit}
              </span>
              <span className="text-xs font-mono text-slate-400">
                at {currentHoverData.time}
              </span>
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl self-stretch sm:self-auto justify-between sm:justify-start">
            <button
              onClick={() => setMetric('throughput')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                metric === 'throughput'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bandwidth (GB/s)
            </button>
            <button
              onClick={() => setMetric('cpu')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                metric === 'cpu'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              vCPU Load
            </button>
            <button
              onClick={() => setMetric('iops')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                metric === 'iops'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Disk IOPS
            </button>
          </div>
        </div>

        {/* Chart Viewport with SVG Area and Crosshairs */}
        <div className="relative w-full h-[240px] select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentHex} stopOpacity="0.45" />
                <stop offset="70%" stopColor={accentHex} stopOpacity="0.08" />
                <stop offset="100%" stopColor={accentHex} stopOpacity="0" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle horizontal grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
              const y = svgHeight - 40 - ratio * (svgHeight - 70);
              return (
                <line
                  key={idx}
                  x1="20"
                  y1={y}
                  x2={svgWidth - 20}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 6"
                />
              );
            })}

            {/* Gradient Area Fill */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* Glowing Stroke Curve */}
            <path
              d={linePath}
              fill="none"
              stroke={accentHex}
              strokeWidth="2.5"
              filter="url(#glow)"
            />

            {/* Time labels on X Axis */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={svgHeight - 12}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(148, 163, 184, 0.7)"
                fontFamily="JetBrains Mono"
              >
                {p.time}
              </text>
            ))}

            {/* Interactive Data Point Dots and Hover crosshair */}
            {points.map((p, i) => {
              const isHovered = hoverIndex === i;
              return (
                <g key={i}>
                  {isHovered && (
                    <line
                      x1={p.x}
                      y1="10"
                      x2={p.x}
                      y2={svgHeight - 30}
                      stroke={accentHex}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#ffffff' : accentHex}
                    stroke="rgba(7, 9, 14, 0.9)"
                    strokeWidth="2"
                    className="transition-all duration-150 cursor-pointer"
                  />
                  {/* Transparent hover hit target */}
                  <rect
                    x={p.x - 25}
                    y="0"
                    width="50"
                    height={svgHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className="cursor-pointer"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend & Quick Status */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accentHex }}
              />
              <span>Primary Transit Trunk</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">Zero packet drops</span>
          </div>

          <span className="text-[11px] text-slate-400">
            Sampling: 60s windows · BGP Anycast Active
          </span>
        </div>
      </div>
    </TiltCard>
  );
};
