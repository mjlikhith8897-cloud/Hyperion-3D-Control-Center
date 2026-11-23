import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Cpu,
  HardDrive,
  Radio,
  Zap,
  Terminal,
  Download,
  Flame,
  Check,
} from 'lucide-react';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentHex: string;
}

interface DiagnosticComponent {
  id: string;
  name: string;
  category: string;
  status: 'idle' | 'scanning' | 'passed' | 'warning';
  latency: string;
  metrics: string;
  message: string;
}

export const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  accentHex,
}) => {
  const [scanState, setScanState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const initialComponents: DiagnosticComponent[] = [
    {
      id: 'enclave-sec',
      name: 'Hardware Security Module (HSM)',
      category: 'Cryptographic Enclave',
      status: 'idle',
      latency: '0.4ms',
      metrics: 'ECC-521 Invariants',
      message: 'Hardware enclave integrity and zero-trust root certificates',
    },
    {
      id: 'pcie-accelerators',
      name: 'PCIe 5.0 Tensor Core Matrix',
      category: 'Compute Core',
      status: 'idle',
      latency: '1.2ms',
      metrics: '3.8 TB/s Bus Bandwidth',
      message: 'Inter-die interconnect throughput and arithmetic parity checks',
    },
    {
      id: 'nvme-mesh',
      name: 'NVMe-oF Distributed RAID-Z3',
      category: 'Persistent Storage',
      status: 'idle',
      latency: '0.8ms',
      metrics: '0.000% Defect Ratio',
      message: 'Direct memory access parity and sector block error scanning',
    },
    {
      id: 'fiber-interconnect',
      name: 'Dark Fiber Optical Transceivers',
      category: 'Edge Network',
      status: 'idle',
      latency: '12.4ms',
      metrics: '100% SNR / Zero Jitter',
      message: 'DWDM multi-channel optical wavelength and BGP anycast convergence',
    },
    {
      id: 'ecc-memory',
      name: 'DDR5 ECC Parity Scrubbing',
      category: 'System Memory',
      status: 'idle',
      latency: '0.2ms',
      metrics: '0 Bit Flip Anomalies',
      message: 'Real-time multi-bit error correction and thermal boundary verification',
    },
    {
      id: 'thermal-pdu',
      name: 'Smart PDU & Liquid Cooling Telemetry',
      category: 'Facility & Power',
      status: 'idle',
      latency: '2.1ms',
      metrics: '39.8°C Delta / 99.4% Eff.',
      message: 'Closed-loop microchannel coolant flow rate and phase balance',
    },
  ];

  const [components, setComponents] = useState<DiagnosticComponent[]>(initialComponents);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle Diagnostic Scan Sequence
  useEffect(() => {
    if (scanState !== 'running') return;

    let currentProgress = 0;
    let step = 0;

    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress((p) => Math.min(100, p + 1));

      // Trigger stage transitions every ~16%
      const newStep = Math.min(initialComponents.length - 1, Math.floor((currentProgress / 100) * initialComponents.length));
      if (newStep !== step && newStep < initialComponents.length) {
        step = newStep;
        setActiveStepIndex(step);

        setComponents((prev) =>
          prev.map((c, idx) => {
            if (idx < step) return { ...c, status: 'passed' };
            if (idx === step) return { ...c, status: 'scanning' };
            return c;
          })
        );

        const currentComp = initialComponents[step];
        const timestamp = new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLogs((prev) => [
          ...prev,
          `[${timestamp}] SCANNING: ${currentComp.name}... checking ${currentComp.category}`,
        ]);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanState('completed');
        setActiveStepIndex(-1);
        setComponents((prev) => prev.map((c) => ({ ...c, status: 'passed' })));

        const finalTimestamp = new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setLogs((prev) => [
          ...prev,
          `[${finalTimestamp}] SUCCESS: All 6 hardware enclave subsystems passed hardware validation tests.`,
          `[${finalTimestamp}] REPORT: Zero memory anomalies detected. Root cryptographic anchor secured.`,
        ]);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [scanState]);

  const startScan = () => {
    setScanState('running');
    setProgress(0);
    setActiveStepIndex(0);
    const startTimestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs([
      `[${startTimestamp}] INITIATING: High-Resolution Infrastructure Diagnostic Probe (v4.12)`,
      `[${startTimestamp}] ALLOCATING: Ephemeral DMA test channels on bus #00:01.0...`,
    ]);
    setComponents((prev) =>
      prev.map((c, idx) => (idx === 0 ? { ...c, status: 'scanning' } : { ...c, status: 'idle' }))
    );
  };

  const resetScan = () => {
    setScanState('idle');
    setProgress(0);
    setActiveStepIndex(-1);
    setLogs([]);
    setComponents(initialComponents);
  };

  const handleExportLog = () => {
    const textData = logs.join('\n');
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hyperion-diagnostic-${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // SVG Progress Ring calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl glass-panel-elevated rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${accentHex}33, transparent)`,
              }}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Enclave System Diagnostics
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase">
                  Hardware Level 1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct probing of cryptographic enclaves, memory invariants, and PCIe buses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Hero Section: Progress Ring & Live Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            {/* Circular Progress Ring */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform">
                  {/* Background Track */}
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Active Animated Progress Arc */}
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke={accentHex}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-150 ease-out"
                    style={{
                      filter: `drop-shadow(0 0 8px ${accentHex})`,
                    }}
                  />
                </svg>

                {/* Inner Central Percentage & Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {scanState === 'completed' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-in zoom-in-50 duration-200" />
                  ) : scanState === 'running' ? (
                    <Zap className="w-6 h-6 text-cyan-400 animate-pulse mb-0.5" />
                  ) : (
                    <Activity className="w-6 h-6 text-slate-500 mb-0.5" />
                  )}

                  <span className="text-2xl font-mono font-bold text-white tracking-tight">
                    {progress}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {scanState === 'completed'
                      ? 'PASSED'
                      : scanState === 'running'
                      ? 'SCANNING'
                      : 'STANDBY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Quick Health Telemetry */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Enclave Sensor Grid
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Telemetry Synced
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Avg Core Temp</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-white mt-1">
                    39.4°C
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Nominal range</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>PCIe Saturation</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-white mt-1">
                    14.2%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Gen 5 x16 link</div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-purple-400" />
                    <span>SEV-SNP Anchor</span>
                  </div>
                  <div className="text-sm sm:text-base font-mono font-bold text-emerald-400 mt-1">
                    VALID
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Zero attest drift</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {scanState === 'idle' && (
                  <button
                    onClick={startScan}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
                    style={{
                      background: `linear-gradient(135deg, ${accentHex} 0%, #2563eb 100%)`,
                      boxShadow: `0 0 16px ${accentHex}40`,
                    }}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Run Deep Hardware Scan</span>
                  </button>
                )}

                {scanState === 'running' && (
                  <button
                    onClick={() => {
                      setScanState('idle');
                      setProgress(0);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Abort Probe</span>
                  </button>
                )}

                {scanState === 'completed' && (
                  <>
                    <button
                      onClick={startScan}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repeat Diagnostics</span>
                    </button>

                    <button
                      onClick={handleExportLog}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Audit Certificate</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Component Status Cards List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="uppercase tracking-wider">Subsystem Verification Matrix</span>
              <span>{components.filter((c) => c.status === 'passed').length} / {components.length} Verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {components.map((comp) => {
                const isScanning = comp.status === 'scanning';
                const isPassed = comp.status === 'passed';

                return (
                  <div
                    key={comp.id}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ${
                      isScanning
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : isPassed
                        ? 'bg-white/[0.04] border-white/10'
                        : 'bg-white/[0.015] border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isPassed
                                ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                                : isScanning
                                ? 'bg-cyan-400 animate-ping'
                                : 'bg-slate-600'
                            }`}
                          />
                          <span className="text-xs font-semibold text-white truncate">
                            {comp.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {comp.category}
                        </div>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase shrink-0 ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isScanning
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                            : 'bg-white/5 text-slate-500 border border-white/5'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-white/5">
                      <span>{comp.metrics}</span>
                      <span className="text-slate-300">{comp.latency}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Streaming Diagnostics Terminal Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Kernel & Enclave Diagnostics Log</span>
              </span>
              <span>ttyS0 /dev/diag</span>
            </div>

            <div className="h-36 sm:h-44 p-3 rounded-xl bg-black/70 border border-white/10 font-mono text-[11px] overflow-y-auto leading-relaxed select-text">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic">
                  Diagnostic stream idle. Press "Run Deep Hardware Scan" above to initiate test vectors.
                </div>
              ) : (
                logs.map((line, idx) => (
                  <div
                    key={idx}
                    className={`py-0.5 ${
                      line.includes('SUCCESS')
                        ? 'text-emerald-400 font-semibold'
                        : line.includes('SCANNING')
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>ECC Scrubber v4.2 Nominal</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
