/**
 * Storage Cleanup Service
 * Module 09 - AI Social Media Agent
 */

import { CleanupReport, CleanupRuleResult, CleanupConfig } from '../types';
import { DEFAULT_CLEANUP_CONFIG } from '../constants';
import { cleanupRulesEngine } from './cleanup.rules';
import { formatBytes } from './cleanup.utils';
import { logService } from '../../database/services/logService';
import { settingService } from '../../database/services/settingService';

export class CleanupService {
  /**
   * Executes the full cleanup process based on active rules configuration
   */
  async executeCleanup(
    mode: 'manual' | 'auto' = 'manual',
    customConfig?: Partial<CleanupConfig>
  ): Promise<CleanupReport> {
    const settings = await settingService.getSettings();
    const config: CleanupConfig = {
      ...DEFAULT_CLEANUP_CONFIG,
      autoCleanupEnabled: settings?.autoCleanup ?? DEFAULT_CLEANUP_CONFIG.autoCleanupEnabled,
      ...customConfig,
    };

    const results: CleanupRuleResult[] = [];

    try {
      // 1. Old Logs Cleanup
      if (config.keepLogsDays > 0) {
        const logRes = await cleanupRulesEngine.cleanOldLogs(config.keepLogsDays);
        results.push(logRes);
      }

      // 2. Temporary Files Cleanup
      if (config.cleanTempFiles) {
        const tempRes = await cleanupRulesEngine.cleanTemporaryFiles();
        results.push(tempRes);
      }

      // 3. Cache Cleanup
      if (config.cleanCache) {
        const cacheRes = await cleanupRulesEngine.cleanCacheData();
        results.push(cacheRes);
      }

      // 4. Duplicate Media Cleanup
      if (config.cleanDuplicates) {
        const dupRes = await cleanupRulesEngine.cleanDuplicateMedia();
        results.push(dupRes);
      }

      // 5. Incomplete Uploads / Empty Drafts Cleanup
      if (config.cleanFailedUploads) {
        const failedRes = await cleanupRulesEngine.cleanFailedUploadsAndDrafts();
        results.push(failedRes);
      }

      const totalItemsRemoved = results.reduce((sum, r) => sum + r.itemsRemoved, 0);
      const totalBytesFreed = results.reduce((sum, r) => sum + r.bytesFreed, 0);
      const formattedBytesFreed = formatBytes(totalBytesFreed);

      const report: CleanupReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        executedAt: new Date().toISOString(),
        mode,
        totalBytesFreed,
        totalItemsRemoved,
        formattedBytesFreed,
        ruleResults: results,
        status: 'success',
        message: totalItemsRemoved > 0
          ? `Cleanup completed successfully. Removed ${totalItemsRemoved} items and freed ${formattedBytesFreed}.`
          : 'Storage is already optimal. No items needed cleanup.',
      };

      // Record in Module 07 system log
      await logService.log(
        `[Storage Manager] ${report.message}`,
        'system',
        'info'
      );

      return report;
    } catch (error: any) {
      const errReport: CleanupReport = {
        id: `report_${Date.now()}`,
        executedAt: new Date().toISOString(),
        mode,
        totalBytesFreed: 0,
        totalItemsRemoved: 0,
        formattedBytesFreed: '0 Bytes',
        ruleResults: [],
        status: 'error',
        message: `Cleanup engine encountered an error: ${error?.message || 'Unknown failure'}`,
      };

      await logService.log(`[Storage Manager Error] ${errReport.message}`, 'system', 'error');
      return errReport;
    }
  }
}

export const cleanupService = new CleanupService();
