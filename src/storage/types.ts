/**
 * Storage Manager & Auto Cleanup Engine Types
 * Module 09 - AI Social Media Agent
 */

export type DataPriorityLevel = 'High' | 'Medium' | 'Low';

export type CleanupFrequency = 'daily' | 'weekly' | 'monthly' | 'never';

export interface StorageBreakdown {
  totalUsedBytes: number;
  quotaBytes: number;
  usagePercentage: number;
  mediaSizeBytes: number;
  databaseSizeBytes: number;
  cacheSizeBytes: number;
  tempSizeBytes: number;
  availableBytes: number;
  formatted: {
    totalUsed: string;
    quota: string;
    available: string;
    mediaSize: string;
    databaseSize: string;
    cacheSize: string;
    tempSize: string;
  };
  isWarning: boolean;
  isCritical: boolean;
}

export interface CleanupConfig {
  autoCleanupEnabled: boolean;
  frequency: CleanupFrequency;
  maxStorageLimitMB: number;
  keepLogsDays: number;
  keepRecentFilesCount: number;
  cleanTempFiles: boolean;
  cleanDuplicates: boolean;
  cleanFailedUploads: boolean;
  cleanCache: boolean;
}

export interface CleanupRuleResult {
  ruleName: string;
  itemsRemoved: number;
  bytesFreed: number;
  details: string;
}

export interface CleanupReport {
  id: string;
  executedAt: string;
  mode: 'manual' | 'auto';
  totalBytesFreed: number;
  totalItemsRemoved: number;
  formattedBytesFreed: string;
  ruleResults: CleanupRuleResult[];
  status: 'success' | 'warning' | 'error';
  message: string;
}

export interface DataPriorityItem {
  id: string;
  name: string;
  type: 'post' | 'media' | 'log' | 'cache' | 'temp' | 'account';
  sizeBytes: number;
  priority: DataPriorityLevel;
  createdAt: string;
  protected: boolean;
}
