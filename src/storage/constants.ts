/**
 * Storage Manager Constants
 * Module 09 - AI Social Media Agent
 */

import { CleanupConfig } from './types';

export const DEFAULT_STORAGE_LIMIT_MB = 500;
export const STORAGE_WARNING_THRESHOLD = 0.80; // 80%
export const STORAGE_CRITICAL_THRESHOLD = 0.92; // 92%

export const DEFAULT_CLEANUP_CONFIG: CleanupConfig = {
  autoCleanupEnabled: true,
  frequency: 'weekly',
  maxStorageLimitMB: DEFAULT_STORAGE_LIMIT_MB,
  keepLogsDays: 30,
  keepRecentFilesCount: 50,
  cleanTempFiles: true,
  cleanDuplicates: true,
  cleanFailedUploads: true,
  cleanCache: true,
};

export const PRIORITY_MAP = {
  HIGH: 'High' as const,     // Connected accounts, active/scheduled posts, core settings
  MEDIUM: 'Medium' as const, // Published posts, user-uploaded library media
  LOW: 'Low' as const,        // Old logs, temporary files, cached thumbnails, failed draft uploads
};
