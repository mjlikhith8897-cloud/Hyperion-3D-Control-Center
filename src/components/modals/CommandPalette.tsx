import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Cpu,
  Activity,
  Shield,
  Zap,
  Radio,
  Sliders,
  Sparkles,
  Command,
  ArrowRight,
} from 'lucide-react';
import { AccentTheme } from '../../types/dashboard';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: string) => void;
  onOpenDeploy: () => void;
  onOpenDiagnostics: () => void;
  onToggleStreaming: () => void;
  onAccentChange: (theme: AccentTheme) => void;
  accentHex: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  onOpenDeploy,
  onOpenDiagnostics,
  onToggleStreaming,
  onAccentChange,
  accentHex,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'diagnostics',
      title: 'Run Enclave System Diagnostics',
      subtitle: 'Simulated hardware health scan of compute enclaves',
      icon: Activity,
      action: () => {
        onClose();
        onOpenDiagnostics();
      },
    },
    {
      id: 'deploy',
      title: 'Deploy New Compute Shard',
      subtitle: 'Provision a high-throughput edge node',
      icon: Sparkles,
      action: () => {
        onClose();
        onOpenDeploy();
      },
    },
    {
      id: 'nav-overview',
      title: 'Go to Command Overview',
      subtitle: 'Primary telemetry & active cluster status',
      icon: LayoutDashboard,
      action: () => {
        onSelectSection('overview');
        onClose();
      },
    },
    {
      id: 'nav-compute',
      title: 'Go to Compute Clusters',
      subtitle: 'Inspect distributed shard allocations',
      icon: Cpu,
      action: () => {
        onSelectSection('compute');
        onClose();
      },
    },
    {
      id: 'nav-telemetry',
      title: 'Go to Realtime Telemetry',
      subtitle: 'Real-time bandwidth and latency charts',
      icon: Activity,
      action: () => {
        onSelectSection('telemetry');
        onClose();
      },
    },
    {
      id: 'toggle-stream',
      title: 'Toggle Real-Time Data Stream',
      subtitle: 'Pause or resume live incoming packets',
      icon: Radio,
      action: () => {
        onToggleStreaming();
        onClose();
      },
    },
    {
      id: 'theme-cyan',
      title: 'Set Accent: Electric Cyan',
      subtitle: 'Switch futuristic glow to Cyan',
      icon: Zap,
      action: () => {
        onAccentChange('cyan');
        onClose();
      },
    },
    {
      id: 'theme-violet',
      title: 'Set Accent: Cyber Violet',
      subtitle: 'Switch futuristic glow to Violet',
      icon: Zap,
      action: () => {
        onAccentChange('violet');
        onClose();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl glass-panel-elevated rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to section..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white/10 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg border border-white/10"
                      style={{
                        backgroundColor: isSelected ? `${accentHex}33` : 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-transparent'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate with arrows</span>
          <span>ENTER to execute</span>
        </div>
      </div>
    </div>
  );
};
