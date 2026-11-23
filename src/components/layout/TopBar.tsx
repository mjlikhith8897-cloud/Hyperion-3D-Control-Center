import React, { useState } from 'react';
import {
  Search,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Command,
  Radio,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { AccentTheme, TimeRange, SystemNotification } from '../../types/dashboard';

interface TopBarProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  accentTheme: AccentTheme;
  onAccentChange: (theme: AccentTheme) => void;
  accentHex: string;
  onOpenCommand: () => void;
  onOpenDeploy: () => void;
  onOpenDiagnostics: () => void;
  onOpenSettings: () => void;
  onToggleMobile: () => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  timeRange,
  onTimeRangeChange,
  accentTheme,
  onAccentChange,
  accentHex,
  onOpenCommand,
  onOpenDeploy,
  onOpenDiagnostics,
  onOpenSettings,
  onToggleMobile,
  isStreaming,
  onToggleStreaming,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'n-1',
      title: 'Auto-scaled Shard US-East-4',
      message: 'Node capacity expanded to 48 replicas under load.',
      timeAgo: '4m ago',
      read: false,
      severity: 'info',
    },
    {
      id: 'n-2',
      title: 'Edge Gateway TLS Renewed',
      message: 'Zero-downtime certificate rotation verified.',
      timeAgo: '18m ago',
      read: false,
      severity: 'success',
    },
    {
      id: 'n-3',
      title: 'Throughput Peak Detected',
      message: 'Global bandwidth reached 912 GB/s without degradation.',
      timeAgo: '1h ago',
      read: true,
      severity: 'info',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full glass-panel border-b border-white/10 px-4 md:px-6 flex items-center justify-between">
      {/* Zone 1: Brand / Context Navigation */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-white font-semibold tracking-tight">Main Cluster</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 hidden sm:inline">Telemetry & Control</span>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <button
            onClick={onOpenDiagnostics}
            title="Open Hardware Enclave Diagnostics"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 cursor-pointer transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="whitespace-nowrap">Nominal 99.99%</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Search Trigger & Timeframe Selector */}
      <div className="hidden md:flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-400 hover:text-slate-200 transition-colors w-52 justify-between"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search commands, nodes...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-slate-300">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Timeframe Selector Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
          {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(range)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-white/15 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Zone 3: Actions, Streaming Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Streaming Pulse Button */}
        <button
          onClick={onToggleStreaming}
          title={isStreaming ? 'Live Data Stream Active' : 'Data Stream Paused'}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
            isStreaming
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-cyan-400' : 'text-slate-500'}`} />
          <span>{isStreaming ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* System Diagnostics Trigger */}
        <button
          onClick={onOpenDiagnostics}
          title="Run Hardware System Diagnostics"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all active:scale-95"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Diagnostics</span>
        </button>

        {/* Deploy Cluster Quick Action */}
        <button
          onClick={onOpenDeploy}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl transition-all shadow-md active:scale-95 hover:brightness-110 whitespace-nowrap"
          style={{
            background: `linear-gradient(135deg, ${accentHex} 0%, #2563eb 100%)`,
            boxShadow: `0 0 16px ${accentHex}40`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deploy Node</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: accentHex, boxShadow: `0 0 6px ${accentHex}` }}
              />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel-elevated p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">System Events</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.read
                        ? 'bg-white/[0.02] border-white/5 text-slate-400'
                        : 'bg-white/[0.06] border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5 text-center">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="w-full py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Console Settings Trigger */}
        <button
          onClick={onOpenSettings}
          title="Console & 3D Settings"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <img
              src="/src/assets/images/avatar_lead_user_1790346050215.jpg"
              alt="Elena Vance profile avatar"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg object-cover border border-white/20"
            />
            <span className="hidden xl:inline text-xs font-medium text-slate-200">Elena V.</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel-elevated p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <img
                  src="/src/assets/images/avatar_lead_user_1790346050215.jpg"
                  alt="Elena Vance"
                  className="w-10 h-10 rounded-xl object-cover border border-white/20"
                />
                <div className="truncate">
                  <div className="text-sm font-semibold text-white">Elena Vance</div>
                  <div className="text-xs text-slate-400">Lead Cluster Architect</div>
                </div>
              </div>

              {/* Accent Color Chooser */}
              <div className="py-3 border-b border-white/10">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Neon Accent Theme
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onAccentChange('cyan')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      accentTheme === 'cyan'
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                    <span>Cyan</span>
                  </button>

                  <button
                    onClick={() => onAccentChange('violet')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      accentTheme === 'violet'
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                    <span>Violet</span>
                  </button>

                  <button
                    onClick={() => onAccentChange('emerald')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      accentTheme === 'emerald'
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                    <span>Emerald</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center justify-between"
                >
                  <span>Preferences & 3D FX</span>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10"
                >
                  Lock Console Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
