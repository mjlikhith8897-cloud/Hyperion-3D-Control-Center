import React, { useState } from 'react';
import { Sparkles, Server, CheckCircle2, Shield, X, Cpu } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentHex: string;
  onDeploySuccess: (nodeName: string) => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  accentHex,
  onDeploySuccess,
}) => {
  const [nodeName, setNodeName] = useState('hyperion-shard-us4');
  const [region, setRegion] = useState('us-east-1');
  const [tier, setTier] = useState<'standard' | 'high-mem' | 'accelerated'>('standard');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  if (!isOpen) return null;

  const handleStartDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);

    setTimeout(() => {
      setDeployStep(2);
      setTimeout(() => {
        setDeployStep(3);
        setTimeout(() => {
          setIsDeploying(false);
          setDeployStep(0);
          onDeploySuccess(nodeName);
          onClose();
        }, 800);
      }, 900);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel-elevated rounded-2xl p-6 border border-white/20 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border border-white/10"
              style={{
                background: `linear-gradient(135deg, ${accentHex}33, transparent)`,
              }}
            >
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Deploy Compute Shard
              </h3>
              <p className="text-xs text-slate-400">
                Provision a low-latency edge node in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeploying}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isDeploying ? (
          <div className="py-4 space-y-4">
            {/* Shard identifier */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Shard Identifier
              </label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                placeholder="e.g. hyperion-shard-us4"
              />
            </div>

            {/* Region picker */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Edge Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="us-east-1">US East (N. Virginia) · 12ms latency</option>
                <option value="us-west-2">US West (Oregon) · 24ms latency</option>
                <option value="eu-central-1">EU Central (Frankfurt) · 18ms latency</option>
                <option value="ap-northeast-1">AP Northeast (Tokyo) · 34ms latency</option>
              </select>
            </div>

            {/* Architecture Tier */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Compute Configuration
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTier('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tier === 'standard'
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">Standard</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">32 vCPUs</div>
                  <div className="text-[10px] text-slate-400">64 GB RAM</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('high-mem')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tier === 'high-mem'
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">High-Mem</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">64 vCPUs</div>
                  <div className="text-[10px] text-slate-400">256 GB RAM</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('accelerated')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tier === 'accelerated'
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-semibold">Quantum</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">128 vCPUs</div>
                  <div className="text-[10px] text-slate-400">512 GB RAM</div>
                </button>
              </div>
            </div>

            {/* Invariants & Security */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-xs text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Node is automatically secured with zero-trust mTLS and automated health heartbeat.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartDeploy}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all active:scale-95 hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${accentHex} 0%, #2563eb 100%)`,
                  boxShadow: `0 0 18px ${accentHex}40`,
                }}
              >
                Launch Provisioning
              </button>
            </div>
          </div>
        ) : (
          /* Deployment in progress view */
          <div className="py-8 px-4 flex flex-col items-center justify-center space-y-5 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center animate-spin"
              style={{
                border: `3px solid ${accentHex}33`,
                borderTopColor: accentHex,
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                {deployStep === 1 && 'Allocating Hardware Hypervisor...'}
                {deployStep === 2 && 'Exchanging TLS Certificates & Ingress...'}
                {deployStep === 3 && 'Routing BGP Traffic & Joining Mesh...'}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Shard: {nodeName} ({region})
              </p>
            </div>

            <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden max-w-xs">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${deployStep * 33.3}%`,
                  backgroundColor: accentHex,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
