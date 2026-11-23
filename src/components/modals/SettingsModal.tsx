import React from 'react';
import { X, Sliders, Sparkles, Eye, Zap, Gauge } from 'lucide-react';
import { AccentTheme } from '../../types/dashboard';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentTheme: AccentTheme;
  onAccentChange: (theme: AccentTheme) => void;
  accentHex: string;
  tiltIntensity: 'subtle' | 'cinematic' | 'ultra';
  onTiltIntensityChange: (val: 'subtle' | 'cinematic' | 'ultra') => void;
  particleDensity: 'low' | 'normal' | 'high';
  onParticleDensityChange: (val: 'low' | 'normal' | 'high') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  accentTheme,
  onAccentChange,
  accentHex,
  tiltIntensity,
  onTiltIntensityChange,
  particleDensity,
  onParticleDensityChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg glass-panel-elevated rounded-2xl p-6 border border-white/20 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${accentHex}33, transparent)`,
              }}
            >
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Console & 3D Preferences
              </h3>
              <p className="text-xs text-slate-400">
                Configure spatial lighting, depth physics, and neon accents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Accent Colors */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" style={{ color: accentHex }} />
            <span>Futuristic Neon Accent</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => onAccentChange('cyan')}
              className={`p-3 rounded-xl border text-left transition-all ${
                accentTheme === 'cyan'
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                <span className="text-xs font-semibold">Electric Cyan</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">#06B6D4</div>
            </button>

            <button
              onClick={() => onAccentChange('violet')}
              className={`p-3 rounded-xl border text-left transition-all ${
                accentTheme === 'violet'
                  ? 'bg-purple-500/20 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                <span className="text-xs font-semibold">Cyber Violet</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">#A855F7</div>
            </button>

            <button
              onClick={() => onAccentChange('emerald')}
              className={`p-3 rounded-xl border text-left transition-all ${
                accentTheme === 'emerald'
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <span className="text-xs font-semibold">Bio Emerald</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">#10B981</div>
            </button>
          </div>
        </div>

        {/* 3D Tilt Physics */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Card 3D Perspective Tilt</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['subtle', 'cinematic', 'ultra'] as const).map((intensity) => (
              <button
                key={intensity}
                onClick={() => onTiltIntensityChange(intensity)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                  tiltIntensity === intensity
                    ? 'bg-white/15 border-white/30 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Spatial Particles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spatial Background Constellation</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['low', 'normal', 'high'] as const).map((density) => (
              <button
                key={density}
                onClick={() => onParticleDensityChange(density)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                  particleDensity === density
                    ? 'bg-white/15 border-white/30 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {density}
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
