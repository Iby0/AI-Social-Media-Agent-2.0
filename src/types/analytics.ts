export type SystemModuleType = 'workflow' | 'publishing' | 'ai' | 'automation' | 'storage' | 'accounts';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
export type ErrorStatus = 'unresolved' | 'acknowledged' | 'resolved';

export interface AnalyticsOverview {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  aiRequests: number;
  imagesGenerated: number;
  automationRuns: number;
  connectedAccounts: number;
  errorsToday: number;
}

export interface PlatformStat {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'github';
  totalPosts: number;
  failures: number;
  successRate: number; // percentage e.g. 95.5
  lastActivity: string;
}

export interface SystemErrorRecord {
  id: string;
  timestamp: string;
  module: SystemModuleType;
  severity: ErrorSeverity;
  message: string;
  status: ErrorStatus;
  stackTrace?: string;
}

export interface SystemLogRecord {
  id: string;
  timestamp: string;
  module: SystemModuleType;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  details?: Record<string, any>;
}

export interface DailyTimeSeriesMetric {
  date: string; // YYYY-MM-DD
  posts: number;
  aiRequests: number;
  published: number;
  failures: number;
  storageMb: number;
}

export type ExportFormat = 'json' | 'csv' | 'pdf';
