import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Cpu,
  Zap,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { AnimatedCounter } from '../common/AnimatedCounter';

interface StatCardsProps {
  accentHex: string;
  streamingData: {
    throughput: number;
    activeNodes: number;
    latency: number;
    requestsSec: number;
  };
}

export const StatCards: React.FC<StatCardsProps> = ({
  accentHex,
  streamingData,
}) => {
  const cards = [
    {
      id: 'throughput',
      title: 'Aggregate Throughput',
      value: streamingData.throughput,
      decimals: 1,
      suffix: ' GB/s',
      change: '+14.8%',
      isPositive: true,
      subtext: 'Across 12 global transit points',
      icon: Zap,
      sparkline: [620, 680, 710, 690, 740, 810, 842],
      glow: `${accentHex}30`,
    },
    {
      id: 'active_nodes',
      title: 'Active Compute Shards',
      value: streamingData.activeNodes,
      decimals: 0,
      suffix: ' / 1,280',
      change: '+32 nodes',
      isPositive: true,
      subtext: '97.5% cluster capacity active',
      icon: Cpu,
      sparkline: [1180, 1200, 1210, 1230, 1238, 1244, 1248],
      glow: 'rgba(59, 130, 246, 0.25)',
    },
    {
      id: 'edge_latency',
      title: 'Median Edge Latency',
      value: streamingData.latency,
      decimals: 1,
      suffix: ' ms',
      change: '-2.4 ms',
      isPositive: true,
      subtext: 'Fiber interconnects verified',
      icon: Activity,
      sparkline: [18.2, 17.5, 16.8, 15.9, 15.1, 14.6, 14.2],
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    {
      id: 'requests',
      title: 'Throughput Volume',
      value: streamingData.requestsSec,
      decimals: 0,
      suffix: ' req/s',
      change: '+9.3%',
      isPositive: true,
      subtext: 'Zero dropped packet rate',
      icon: ShieldCheck,
      sparkline: [42000, 44500, 46100, 48300, 49900, 52100, 54200],
      glow: 'rgba(168, 85, 247, 0.25)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        // Normalize sparkline values for mini SVG
        const minVal = Math.min(...card.sparkline);
        const maxVal = Math.max(...card.sparkline);
        const range = maxVal - minVal || 1;
        const width = 120;
        const height = 36;
        const points = card.sparkline
          .map((v, idx) => {
            const x = (idx / (card.sparkline.length - 1)) * width;
            const y = height - ((v - minVal) / range) * (height - 8) - 4;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <TiltCard
            key={card.id}
            glowColor={card.glow}
            maxTilt={7}
            className="h-full"
          >
            <div className="p-5 flex flex-col justify-between h-full space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-slate-300">
                  {card.title}
                </span>
                <div
                  className="p-2 rounded-xl border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Metric Value & Animated Counter */}
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight flex items-baseline">
                  <AnimatedCounter
                    value={card.value}
                    decimals={card.decimals}
                    suffix={card.suffix}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center gap-1 text-xs font-mono font-medium text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{card.change}</span>
                  </div>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {card.subtext}
                  </span>
                </div>
              </div>

              {/* Sparkline & trend line */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  24h Trend
                </span>
                <div className="w-24 h-7">
                  <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accentHex} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={accentHex} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke={accentHex}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </TiltCard>
        );
      })}
    </div>
  );
};
