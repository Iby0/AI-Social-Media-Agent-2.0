/**
 * Storage Manager Service
 * Module 09 - AI Social Media Agent
 */

import { storageMonitor } from './storage.monitor';
import { cleanupService } from './cleanup/cleanup.service';
import { StorageBreakdown, CleanupConfig, CleanupReport, DataPriorityItem } from './types';
import { DEFAULT_CLEANUP_CONFIG, PRIORITY_MAP } from './constants';
import { postService } from '../database/services/postService';
import { mediaService } from '../database/services/mediaService';
import { socialAccountService } from '../database/services/socialAccountService';
import { logService } from '../database/services/logService';
import { estimateObjectSizeBytes } from './cleanup/cleanup.utils';

export class StorageManagerService {
  /**
   * Retrieves live metrics breakdown
   */
  async getStorageMetrics(config?: Partial<CleanupConfig>): Promise<StorageBreakdown> {
    return await storageMonitor.getStorageBreakdown(config);
  }

  /**
   * Validates whether a file of given size can be stored without exceeding limits
   */
  async validateStorageCapacity(incomingSizeBytes: number): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    const breakdown = await this.getStorageMetrics();
    if (breakdown.totalUsedBytes + incomingSizeBytes > breakdown.quotaBytes) {
      return {
        allowed: false,
        reason: `Storage quota exceeded! Available space: ${breakdown.formatted.available}, requested: ${(
          incomingSizeBytes / (1024 * 1024)
        ).toFixed(2)} MB. Please run storage cleanup.`,
      };
    }
    return { allowed: true };
  }

  /**
   * Lists items categorized by Data Priority System (High, Medium, Low)
   */
  async getDataPriorityBreakdown(): Promise<DataPriorityItem[]> {
    const items: DataPriorityItem[] = [];

    // 1. High Priority (Protected: Social accounts & active posts)
    const accounts = await socialAccountService.getAll();
    for (const acc of accounts) {
      items.push({
        id: acc.id,
        name: `@${acc.username} (${acc.platform})`,
        type: 'account',
        sizeBytes: estimateObjectSizeBytes(acc),
        priority: PRIORITY_MAP.HIGH,
        createdAt: acc.connectedAt,
        protected: true,
      });
    }

    const posts = await postService.getAll();
    for (const p of posts) {
      const isHigh = p.status === 'scheduled' || p.status === 'published';
      items.push({
        id: p.id,
        name: p.title || 'Untitled Post',
        type: 'post',
        sizeBytes: estimateObjectSizeBytes(p),
        priority: isHigh ? PRIORITY_MAP.HIGH : PRIORITY_MAP.MEDIUM,
        createdAt: p.createdAt,
        protected: isHigh,
      });
    }

    // 2. Medium Priority (User uploaded media assets)
    const mediaList = await mediaService.getAll();
    for (const m of mediaList) {
      const isTemp = m.category === 'Temporary File' || m.source === 'temp';
      items.push({
        id: m.id,
        name: m.fileName,
        type: 'media',
        sizeBytes: m.fileSize || estimateObjectSizeBytes(m),
        priority: isTemp ? PRIORITY_MAP.LOW : PRIORITY_MAP.MEDIUM,
        createdAt: m.createdAt,
        protected: false,
      });
    }

    // 3. Low Priority (Logs)
    const logs = await logService.getAll();
    for (const l of logs) {
      items.push({
        id: l.id,
        name: `Log: ${l.message.substring(0, 30)}...`,
        type: 'log',
        sizeBytes: estimateObjectSizeBytes(l),
        priority: PRIORITY_MAP.LOW,
        createdAt: l.createdAt,
        protected: false,
      });
    }

    return items;
  }

  /**
   * Runs storage cleanup
   */
  async runCleanup(
    mode: 'manual' | 'auto' = 'manual',
    customConfig?: Partial<CleanupConfig>
  ): Promise<CleanupReport> {
    return await cleanupService.executeCleanup(mode, customConfig);
  }

  /**
   * Schedules architecture preparation for periodic cleanup
   */
  prepareCleanupSchedule(frequency: CleanupConfig['frequency']): {
    nextScheduledRun: string;
    frequency: string;
  } {
    const now = new Date();
    let daysToAdd = 7;
    if (frequency === 'daily') daysToAdd = 1;
    if (frequency === 'monthly') daysToAdd = 30;

    now.setDate(now.getDate() + daysToAdd);

    return {
      nextScheduledRun: now.toISOString(),
      frequency,
    };
  }
}

export const storageManager = new StorageManagerService();
