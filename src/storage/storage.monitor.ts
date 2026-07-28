/**
 * Storage Monitor Service
 * Module 09 - AI Social Media Agent
 */

import { StorageBreakdown, CleanupConfig } from './types';
import { DEFAULT_STORAGE_LIMIT_MB, STORAGE_WARNING_THRESHOLD, STORAGE_CRITICAL_THRESHOLD } from './constants';
import { formatBytes, estimateObjectSizeBytes, calculateLocalStorageSizeBytes } from './cleanup/cleanup.utils';
import { postService } from '../database/services/postService';
import { scheduleService } from '../database/services/scheduleService';
import { userService } from '../database/services/userService';
import { logService } from '../database/services/logService';
import { socialAccountService } from '../database/services/socialAccountService';
import { mediaService } from '../database/services/mediaService';
import { settingService } from '../database/services/settingService';

export class StorageMonitor {
  /**
   * Computes a detailed storage breakdown across Media, Database, Cache, and Temp files
   */
  async getStorageBreakdown(config?: Partial<CleanupConfig>): Promise<StorageBreakdown> {
    const settings = await settingService.getSettings();
    const limitMB = config?.maxStorageLimitMB || settings?.storageLimit || DEFAULT_STORAGE_LIMIT_MB;
    const quotaBytes = limitMB * 1024 * 1024;

    // 1. Calculate Media Size
    const mediaList = await mediaService.getAll();
    let mediaSizeBytes = 0;
    let tempSizeBytes = 0;

    for (const media of mediaList) {
      const itemSize = media.fileSize || estimateObjectSizeBytes(media);
      if (media.category === 'Temporary File' || media.source === 'temp') {
        tempSizeBytes += itemSize;
      } else {
        mediaSizeBytes += itemSize;
      }
    }

    // 2. Calculate Database Size (Posts, Schedules, Users, Logs, Social Accounts, Settings)
    const [posts, schedules, users, logs, accounts] = await Promise.all([
      postService.getAll(),
      scheduleService.getAll(),
      userService.getAll(),
      logService.getAll(),
      socialAccountService.getAll(),
    ]);

    const databaseSizeBytes =
      estimateObjectSizeBytes(posts) +
      estimateObjectSizeBytes(schedules) +
      estimateObjectSizeBytes(users) +
      estimateObjectSizeBytes(logs) +
      estimateObjectSizeBytes(accounts) +
      estimateObjectSizeBytes(settings);

    // 3. Calculate Cache Size (localStorage)
    const cacheSizeBytes = calculateLocalStorageSizeBytes();

    // 4. Estimate Total Used Bytes
    let totalUsedBytes = mediaSizeBytes + databaseSizeBytes + cacheSizeBytes + tempSizeBytes;

    // Check system storage estimation API if available
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage && estimate.usage > totalUsedBytes) {
          // Adjust if browser reports larger usage
          totalUsedBytes = Math.max(totalUsedBytes, estimate.usage);
        }
      } catch {
        // Fallback to calculated sum
      }
    }

    const availableBytes = Math.max(0, quotaBytes - totalUsedBytes);
    const usageRatio = totalUsedBytes / quotaBytes;
    const usagePercentage = Math.min(100, Math.round(usageRatio * 100));

    const isWarning = usageRatio >= STORAGE_WARNING_THRESHOLD;
    const isCritical = usageRatio >= STORAGE_CRITICAL_THRESHOLD;

    return {
      totalUsedBytes,
      quotaBytes,
      usagePercentage,
      mediaSizeBytes,
      databaseSizeBytes,
      cacheSizeBytes,
      tempSizeBytes,
      availableBytes,
      formatted: {
        totalUsed: formatBytes(totalUsedBytes),
        quota: formatBytes(quotaBytes),
        available: formatBytes(availableBytes),
        mediaSize: formatBytes(mediaSizeBytes),
        databaseSize: formatBytes(databaseSizeBytes),
        cacheSize: formatBytes(cacheSizeBytes),
        tempSize: formatBytes(tempSizeBytes),
      },
      isWarning,
      isCritical,
    };
  }
}

export const storageMonitor = new StorageMonitor();
