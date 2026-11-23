import React, { useState } from 'react';
import {
  Server,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sliders,
  X,
  Zap,
} from 'lucide-react';
import { TiltCard } from '../common/TiltCard';
import { ClusterNode } from '../../types/dashboard';

interface NodeClusterGridProps {
  accentHex: string;
}

export const NodeClusterGrid: React.FC<NodeClusterGridProps> = ({ accentHex }) => {
  const [selectedNode, setSelectedNode] = useState<ClusterNode | null>(null);
  const [filterRegion, setFilterRegion] = useState<'all' | 'us' | 'eu' | 'ap'>('all');

  // 24 realistic cluster shards
  const rawNodes: ClusterNode[] = [
    { id: 'shard-01', name: 'us-east-1a-titan', region: 'us', status: 'nominal', cpuUsage: 48, memoryUsage: 64, latencyMs: 12.4, shardsCount: 64 },
    { id: 'shard-02', name: 'us-east-1b-titan', region: 'us', status: 'nominal', cpuUsage: 52, memoryUsage: 71, latencyMs: 13.1, shardsCount: 64 },
    { id: 'shard-03', name: 'us-west-2a-aurora', region: 'us', status: 'nominal', cpuUsage: 61, memoryUsage: 78, latencyMs: 24.2, shardsCount: 48 },
    { id: 'shard-04', name: 'us-west-2b-aurora', region: 'us', status: 'syncing', cpuUsage: 82, memoryUsage: 89, latencyMs: 26.8, shardsCount: 48 },
    { id: 'shard-05', name: 'eu-west-1a-celtic', region: 'eu', status: 'nominal', cpuUsage: 44, memoryUsage: 59, latencyMs: 16.5, shardsCount: 64 },
    { id: 'shard-06', name: 'eu-west-1b-celtic', region: 'eu', status: 'nominal', cpuUsage: 49, memoryUsage: 63, latencyMs: 17.1, shardsCount: 64 },
    { id: 'shard-07', name: 'eu-central-1a-rhine', region: 'eu', status: 'nominal', cpuUsage: 55, memoryUsage: 67, latencyMs: 18.9, shardsCount: 32 },
    { id: 'shard-08', name: 'eu-central-1b-rhine', region: 'eu', status: 'nominal', cpuUsage: 58, memoryUsage: 70, latencyMs: 19.3, shardsCount: 32 },
    { id: 'shard-09', name: 'ap-northeast-1a-tokyo', region: 'ap', status: 'nominal', cpuUsage: 66, memoryUsage: 76, latencyMs: 34.2, shardsCount: 64 },
    { id: 'shard-10', name: 'ap-northeast-1b-tokyo', region: 'ap', status: 'rebalancing', cpuUsage: 79, memoryUsage: 84, latencyMs: 36.5, shardsCount: 64 },
    { id: 'shard-11', name: 'ap-southeast-1a-merlion', region: 'ap', status: 'nominal', cpuUsage: 41, memoryUsage: 54, latencyMs: 42.1, shardsCount: 32 },
    { id: 'shard-12', name: 'ap-southeast-1b-merlion', region: 'ap', status: 'nominal', cpuUsage: 45, memoryUsage: 58, latencyMs: 43.4, shardsCount: 32 },
    { id: 'shard-13', name: 'us-central-1a-plains', region: 'us', status: 'nominal', cpuUsage: 39, memoryUsage: 49, latencyMs: 19.2, shardsCount: 32 },
    { id: 'shard-14', name: 'us-central-1b-plains', region: 'us', status: 'nominal', cpuUsage: 42, memoryUsage: 52, latencyMs: 19.8, shardsCount: 32 },
    { id: 'shard-15', name: 'eu-north-1a-viking', region: 'eu', status: 'nominal', cpuUsage: 36, memoryUsage: 48, latencyMs: 22.4, shardsCount: 32 },
    { id: 'shard-16', name: 'eu-north-1b-viking', region: 'eu', status: 'nominal', cpuUsage: 38, memoryUsage: 51, latencyMs: 22.9, shardsCount: 32 },
    { id: 'shard-17', name: 'ap-south-1a-mumbai', region: 'ap', status: 'nominal', cpuUsage: 64, memoryUsage: 72, latencyMs: 48.6, shardsCount: 32 },
    { id: 'shard-18', name: 'ap-south-1b-mumbai', region: 'ap', status: 'syncing', cpuUsage: 73, memoryUsage: 81, latencyMs: 50.1, shardsCount: 32 },
  ];

  const filteredNodes = rawNodes.filter((node) => {
    if (filterRegion === 'all') return true;
    return node.region === filterRegion;
  });

  const getStatusColor = (status: ClusterNode['status']) => {
    switch (status) {
      case 'nominal':
        return 'bg-emerald-400';
      case 'syncing':
        return 'bg-cyan-400';
      case 'rebalancing':
        return 'bg-purple-400';
    }
  };

  return (
    <TiltCard glowColor={`${accentHex}15`} maxTilt={3} className="w-full">
      <div className="p-5 md:p-6 flex flex-col space-y-4">
        {/* Header and Region Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white tracking-tight">
              Distributed Compute Shard Grid
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredNodes.length} Shards online)
            </span>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
            {(['all', 'us', 'eu', 'ap'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRegion(r)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                  filterRegion === r
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Shard Cell Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2.5">
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-200 relative group cursor-pointer ${
                  isSelected
                    ? 'bg-white/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-2 h-2 rounded-full ${getStatusColor(node.status)} ${
                      node.status !== 'nominal' ? 'animate-pulse' : ''
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300">
                    {node.latencyMs.toFixed(0)}ms
                  </span>
                </div>

                <div className="text-xs font-mono font-semibold text-slate-200 mt-2 truncate">
                  {node.name.split('-')[0]}-{node.name.split('-')[1]}
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{node.cpuUsage}% CPU</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details Drawer / Bar */}
        {selectedNode && (
          <div className="mt-3 p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold font-mono text-white">
                    {selectedNode.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    {selectedNode.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                  <span>Latency: {selectedNode.latencyMs} ms</span>
                  <span aria-hidden="true">·</span>
                  <span>CPU: {selectedNode.cpuUsage}%</span>
                  <span aria-hidden="true">·</span>
                  <span>Memory: {selectedNode.memoryUsage}%</span>
                  <span aria-hidden="true">·</span>
                  <span>Shards: {selectedNode.shardsCount} vCores</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => alert(`Routing health audit dispatched to ${selectedNode.name}`)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-colors"
              >
                Health Audit
              </button>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close shard details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </TiltCard>
  );
};
