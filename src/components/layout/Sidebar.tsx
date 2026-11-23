import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Activity,
  Shield,
  Radio,
  KeyRound,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Database,
  Terminal,
  Zap,
} from 'lucide-react';
import { AccentTheme } from '../../types/dashboard';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  accentTheme: AccentTheme;
  accentHex: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeSection,
  onSelectSection,
  accentHex,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
    { id: 'compute', label: 'Compute Clusters', icon: Cpu, badge: '48' },
    { id: 'telemetry', label: 'Realtime Telemetry', icon: Activity },
    { id: 'security', label: 'Security & Auth', icon: Shield },
    { id: 'edge', label: 'Edge Gateways', icon: Radio },
    { id: 'storage', label: 'Distributed Mesh', icon: Database },
    { id: 'settings', label: 'Console Preferences', icon: Sliders },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out flex flex-col border-r border-white/10 glass-panel ${
          isCollapsed ? 'w-[74px]' : 'w-[260px]'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: 'rgba(8, 11, 18, 0.92)',
        }}
      >
        {/* Top Brand Zone */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Glowing 3D Emblem */}
            <div
              className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/20 transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${accentHex}33 0%, rgba(255,255,255,0.05) 100%)`,
                boxShadow: `0 0 15px ${accentHex}40`,
              }}
            >
              <Zap className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-base tracking-wider text-white truncate">
                  HYPERION
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">
                  3D Control Center
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 pb-2 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
            {!isCollapsed ? 'Architecture' : '•'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {/* Active neon highlight bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full"
                    style={{
                      backgroundColor: accentHex,
                      boxShadow: `0 0 10px ${accentHex}`,
                    }}
                  />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                  style={isActive ? { color: accentHex } : undefined}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Resource Quota Widget in Footer */}
        <div className="p-3 border-t border-white/5">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Cluster Allocation</span>
                <span className="font-mono text-cyan-300 font-semibold">78.4%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: '78.4%',
                    backgroundColor: accentHex,
                    boxShadow: `0 0 8px ${accentHex}`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>1,248 / 1,600 vCPUs</span>
                <span className="text-emerald-400">Normal</span>
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center bg-white/5 text-slate-400 hover:text-white cursor-pointer"
              title="Cluster Allocation: 78.4%"
            >
              <Activity className="w-5 h-5" style={{ color: accentHex }} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
