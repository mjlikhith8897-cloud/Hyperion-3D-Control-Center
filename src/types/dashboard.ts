export type AccentTheme = 'cyan' | 'violet' | 'emerald';

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  delta: number;
  isPositive: boolean;
  history: number[];
  subtext: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  actor: string;
  category: 'deployment' | 'security' | 'autoscale' | 'maintenance';
  status: 'completed' | 'in_progress' | 'warning';
  details: string;
}

export interface ClusterNode {
  id: string;
  name: string;
  region: string;
  status: 'nominal' | 'syncing' | 'rebalancing';
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
  shardsCount: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  severity: 'info' | 'success' | 'warning';
}
