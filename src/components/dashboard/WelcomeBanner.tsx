import React from 'react';
import { ArrowUpRight, Sparkles, ShieldCheck, Cpu, HardDriveDownload } from 'lucide-react';
import { TiltCard } from '../common/TiltCard';

interface WelcomeBannerProps {
  accentHex: string;
  onDeployClick: () => void;
  onExportReport: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  accentHex,
  onDeployClick,
  onExportReport,
}) => {
  // Format current date nicely
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <TiltCard
      glowColor={`${accentHex}25`}
      maxTilt={4}
      className="w-full"
    >
      <div className="relative overflow-hidden p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Subtle background ambient graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 pointer-events-none opacity-20 lg:opacity-30 overflow-hidden mix-blend-screen">
          <img
            src="/src/assets/images/neural_cluster_3d_1790346068388.jpg"
            alt="Infrastructure 3D grid"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-110 -rotate-3"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1017] via-[#0c1017]/60 to-transparent" />
        </div>

        {/* Left Prose & Metrics */}
        <div className="relative z-10 max-w-2xl space-y-3">
          {/* Metadata info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{today}</span>
            <span aria-hidden="true">·</span>
            <span>Cluster Hyperion-Prime</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Vulnerabilities</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-white">
            Command Center{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 40%, ${accentHex} 100%)`,
              }}
            >
              Telemetry & Ops
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Global compute nodes are synchronized with 99.994% consensus.
            Real-time packet flux is routing 842.6 GB/s across 12 distributed edge zones.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onDeployClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${accentHex} 0%, #3b82f6 100%)`,
                boxShadow: `0 0 20px ${accentHex}50`,
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Deploy Compute Shard</span>
              <ArrowUpRight className="w-4 h-4 ml-0.5 opacity-80" />
            </button>

            <button
              onClick={onExportReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all active:scale-95"
            >
              <HardDriveDownload className="w-4 h-4 text-slate-400" />
              <span>Telemetry Snapshot</span>
            </button>
          </div>
        </div>

        {/* Right Quick Telemetry Pillar */}
        <div className="relative z-10 w-full lg:w-auto flex flex-row lg:flex-col gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Network Health
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white flex items-baseline gap-2">
              <span>99.994%</span>
              <span className="text-xs text-emerald-400 font-sans font-medium">+0.02%</span>
            </div>
            <div className="text-xs text-slate-400">0 anomalies in 72h</div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Mean Ping
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300 flex items-baseline gap-2">
              <span>14.2 ms</span>
              <span className="text-xs text-emerald-400 font-sans font-medium">-1.8ms</span>
            </div>
            <div className="text-xs text-slate-400">Optimal transit route</div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};
