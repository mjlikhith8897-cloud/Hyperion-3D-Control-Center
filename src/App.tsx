import React, { useState, useEffect } from 'react';
import { Scene3DBackground } from './components/3d/Scene3DBackground';
import { HologramViewer } from './components/3d/HologramViewer';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { StatCards } from './components/dashboard/StatCards';
import { AnalyticsChart } from './components/dashboard/AnalyticsChart';
import { NodeClusterGrid } from './components/dashboard/NodeClusterGrid';
import { RecentActivity } from './components/dashboard/RecentActivity';
import { DeployModal } from './components/modals/DeployModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { SettingsModal } from './components/modals/SettingsModal';
import { SystemDiagnosticsModal } from './components/modals/SystemDiagnosticsModal';
import { TiltCard } from './components/common/TiltCard';
import { AccentTheme, TimeRange } from './types/dashboard';
import { CheckCircle2, ShieldCheck, Zap, Radio, Database, Sliders, Activity } from 'lucide-react';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [accentTheme, setAccentTheme] = useState<AccentTheme>('cyan');

  // Modals
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // Settings
  const [tiltIntensity, setTiltIntensity] = useState<'subtle' | 'cinematic' | 'ultra'>('cinematic');
  const [particleDensity, setParticleDensity] = useState<'low' | 'normal' | 'high'>('normal');

  // Streaming Live Data Simulation
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamingData, setStreamingData] = useState({
    throughput: 842.6,
    activeNodes: 1248,
    latency: 14.2,
    requestsSec: 54200,
  });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Neon Accent Hex Map
  const accentHex =
    accentTheme === 'violet'
      ? '#a855f7'
      : accentTheme === 'emerald'
      ? '#10b981'
      : '#06b6d4';

  // Real-time telemetry tick simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setStreamingData((prev) => {
        const deltaThroughput = (Math.random() - 0.48) * 8;
        const deltaLatency = (Math.random() - 0.5) * 0.4;
        const deltaReqs = Math.floor((Math.random() - 0.48) * 350);

        return {
          throughput: Math.max(780, Math.min(920, +(prev.throughput + deltaThroughput).toFixed(1))),
          activeNodes: prev.activeNodes,
          latency: Math.max(11, Math.min(18, +(prev.latency + deltaLatency).toFixed(1))),
          requestsSec: Math.max(48000, Math.min(62000, prev.requestsSec + deltaReqs)),
        };
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Keyboard shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDeploySuccess = (nodeName: string) => {
    setStreamingData((prev) => ({
      ...prev,
      activeNodes: prev.activeNodes + 1,
      throughput: +(prev.throughput + 12.4).toFixed(1),
    }));
    showToast(`Shard ${nodeName} deployed and synced with global topology!`);
  };

  const handleExportTelemetry = () => {
    showToast('Exporting high-resolution telemetry snapshot to JSON archive...');
  };

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3D Background Canvas */}
      <Scene3DBackground
        accentColor={accentHex}
        particleDensity={particleDensity}
      />

      {/* Collapsible Futuristic Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        accentTheme={accentTheme}
        accentHex={accentHex}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative z-10 ${
          sidebarCollapsed ? 'lg:pl-[74px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Top Bar with 3-Zone Contract */}
        <TopBar
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          accentTheme={accentTheme}
          onAccentChange={setAccentTheme}
          accentHex={accentHex}
          onOpenCommand={() => setIsCommandOpen(true)}
          onOpenDeploy={() => setIsDeployOpen(true)}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onToggleMobile={() => setMobileSidebarOpen(true)}
          isStreaming={isStreaming}
          onToggleStreaming={() => {
            setIsStreaming(!isStreaming);
            showToast(isStreaming ? 'Live data streaming paused' : 'Real-time telemetry stream resumed');
          }}
        />

        {/* Page Body Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Welcome / Header Section */}
          <WelcomeBanner
            accentHex={accentHex}
            onDeployClick={() => setIsDeployOpen(true)}
            onExportReport={handleExportTelemetry}
          />

          {/* Key Statistics 3D Cards */}
          <StatCards
            accentHex={accentHex}
            streamingData={streamingData}
          />

          {/* Analytics Chart & 3D Hologram Spatial Core (Bento Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Realtime Chart */}
            <div className="lg:col-span-2 flex">
              <AnalyticsChart
                accentHex={accentHex}
                timeRange={timeRange}
              />
            </div>

            {/* 3D Holographic Spatial Core Visualizer */}
            <div className="lg:col-span-1 flex">
              <TiltCard
                glowColor={`${accentHex}20`}
                maxTilt={6}
                className="w-full h-full"
              >
                <HologramViewer
                  accentColor={accentHex}
                  className="w-full h-full"
                />
              </TiltCard>
            </div>
          </div>

          {/* Distributed Node Shard Grid & Live Audit Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            <NodeClusterGrid accentHex={accentHex} />
            <RecentActivity accentHex={accentHex} />
          </div>

          {/* Security & Invariant Verification Row */}
          <TiltCard
            glowColor="rgba(16, 185, 129, 0.15)"
            maxTilt={3}
            className="w-full"
          >
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      Zero-Trust Distributed Consensus
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">100% Invariant Pass</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous post-quantum cryptographic proof verifies all inter-cluster packet hashes.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 self-end md:self-auto font-mono text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  mTLS 1.3 Active
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  Cert Valid: 89d
                </div>
                <button
                  onClick={() => setIsDiagnosticsOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Enclave Diagnostics</span>
                </button>
              </div>
            </div>
          </TiltCard>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/5 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Hyperion Ops Core</span>
            <span>·</span>
            <span>Build 2026.09.25</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Latency SLA 99.99%</span>
            <span>·</span>
            <span>Hardware Enclaves Active</span>
          </div>
        </footer>
      </div>

      {/* Interactive Modals */}
      <DeployModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        accentHex={accentHex}
        onDeploySuccess={handleDeploySuccess}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectSection={setActiveSection}
        onOpenDeploy={() => setIsDeployOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onToggleStreaming={() => {
          setIsStreaming(!isStreaming);
          showToast(isStreaming ? 'Streaming paused' : 'Streaming resumed');
        }}
        onAccentChange={setAccentTheme}
        accentHex={accentHex}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        accentTheme={accentTheme}
        onAccentChange={setAccentTheme}
        accentHex={accentHex}
        tiltIntensity={tiltIntensity}
        onTiltIntensityChange={setTiltIntensity}
        particleDensity={particleDensity}
        onParticleDensityChange={setParticleDensity}
      />

      <SystemDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        accentHex={accentHex}
      />

      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl glass-panel-elevated border border-cyan-500/30 text-xs text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
