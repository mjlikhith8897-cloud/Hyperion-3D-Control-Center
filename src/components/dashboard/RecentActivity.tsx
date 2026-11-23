import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { ActivityEvent } from '../../types/dashboard';

interface RecentActivityProps {
  accentHex: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ accentHex }) => {
  const [filter, setFilter] = useState<'all' | 'deployment' | 'security' | 'autoscale'>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<ActivityEvent | null>(null);

  const events: ActivityEvent[] = [
    {
      id: 'ev-1',
      timestamp: '2 minutes ago',
      title: 'Distributed Shard Rebalance Completed',
      actor: 'Orchestrator Daemon',
      category: 'autoscale',
      status: 'completed',
      details: 'Traffic re-routed seamlessly from us-west-2a to 2b with zero dropped requests. Median latency dropped by 3.2ms.',
    },
    {
      id: 'ev-2',
      timestamp: '14 minutes ago',
      title: 'Zero-Trust MTLS Handshake Key Rotation',
      actor: 'Elena Vance (Security Lead)',
      category: 'security',
      status: 'completed',
      details: 'Rotated root ephemeral certificates across 12 global edge ingress points. Cryptographic invariants verified.',
    },
    {
      id: 'ev-3',
      timestamp: '42 minutes ago',
      title: 'Container Image Rollout: Hyperion-Node v3.4',
      actor: 'CI/CD Pipeline #4829',
      category: 'deployment',
      status: 'completed',
      details: 'Canary deployment reached 100% saturation. 248 node pods updated without interruption.',
    },
    {
      id: 'ev-4',
      timestamp: '1 hour ago',
      title: 'DDoS Scrubbing Threshold Auto-Adjusted',
      actor: 'Network Firewall Agent',
      category: 'security',
      status: 'completed',
      details: 'Detected synthetic SYN flood from transit AS9124. Automated rule block applied to edge ingress.',
    },
    {
      id: 'ev-5',
      timestamp: '2 hours ago',
      title: 'NVMe Cluster IOPS Health Verification',
      actor: 'Storage Patrol',
      category: 'maintenance',
      status: 'completed',
      details: 'Routine integrity scan of distributed volume pools finished with 0 defective blocks reported.',
    },
  ];

  const filteredEvents = events.filter((ev) => {
    if (filter === 'all') return true;
    return ev.category === filter;
  });

  const getCategoryIcon = (cat: ActivityEvent['category']) => {
    switch (cat) {
      case 'deployment':
        return Layers;
      case 'security':
        return Shield;
      case 'autoscale':
        return Cpu;
      case 'maintenance':
        return Activity;
    }
  };

  return (
    <>
      <TiltCard glowColor={`${accentHex}15`} maxTilt={3} className="w-full">
        <div className="p-5 md:p-6 flex flex-col space-y-4">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white tracking-tight">
                  Audit Log & Operational Stream
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-0.5 inline-block">
                Immutable cluster ledger updates
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Events
              </button>
              <button
                onClick={() => setFilter('deployment')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'deployment'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Deployments
              </button>
              <button
                onClick={() => setFilter('security')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'security'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setFilter('autoscale')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === 'autoscale'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Scaling
              </button>
            </div>
          </div>

          {/* Event Stream List */}
          <div className="space-y-2 pt-1">
            {filteredEvents.map((ev) => {
              const Icon = getCategoryIcon(ev.category);
              return (
                <div
                  key={ev.id}
                  onClick={() => setActiveModalEvent(ev)}
                  className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-slate-100 group-hover:text-white truncate">
                        {ev.title}
                      </div>

                      {/* Clean unboxed metadata according to Zero-Pill discipline */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                        <span>{ev.actor}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ev.timestamp}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-400">Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-3">
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </TiltCard>

      {/* Event Details Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel-elevated rounded-2xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Audit Record #{activeModalEvent.id}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeModalEvent.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Actor:</span>
                <span className="text-slate-200">{activeModalEvent.actor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-200">{activeModalEvent.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Classification:</span>
                <span className="text-cyan-300 uppercase">{activeModalEvent.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 uppercase">{activeModalEvent.status}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeModalEvent.details}
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveModalEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-white/10 hover:bg-white/15 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
