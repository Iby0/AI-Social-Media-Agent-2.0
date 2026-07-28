/**
 * Storage Cleanup Rules
 * Module 09 - AI Social Media Agent
 */

import { CleanupRuleResult, CleanupConfig } from '../types';
import { formatBytes, isOlderThanDays, estimateObjectSizeBytes } from './cleanup.utils';
import { logService } from '../../database/services/logService';
import { mediaService } from '../../database/services/mediaService';
import { postService } from '../../database/services/postService';

export class CleanupRulesEngine {
  /**
   * Rule 1: Old Logs Cleanup
   * Removes logs older than configured threshold (e.g. 30 days)
   */
  async cleanOldLogs(keepDays: number): Promise<CleanupRuleResult> {
    const allLogs = await logService.getAll();
    const oldLogs = allLogs.filter((l) => isOlderThanDays(l.createdAt, keepDays));

    let freedBytes = 0;
    for (const logItem of oldLogs) {
      freedBytes += estimateObjectSizeBytes(logItem);
      await logService.delete(logItem.id);
    }

    return {
      ruleName: 'Old System Logs Cleanup',
      itemsRemoved: oldLogs.length,
      bytesFreed: freedBytes,
      details: oldLogs.length > 0
        ? `Pruned ${oldLogs.length} logs older than ${keepDays} days (${formatBytes(freedBytes)} freed).`
        : 'No logs exceeded the age threshold.',
    };
  }

  /**
   * Rule 2: Temporary Files Cleanup
   * Removes temporary files (category 'Temporary File' or source 'temp')
   */
  async cleanTemporaryFiles(): Promise<CleanupRuleResult> {
    const allMedia = await mediaService.getAll();
    const tempMedia = allMedia.filter(
      (m) => m.category === 'Temporary File' || m.source === 'temp'
    );

    let freedBytes = 0;
    for (const media of tempMedia) {
      freedBytes += media.fileSize || estimateObjectSizeBytes(media);
      await mediaService.delete(media.id);
    }

    return {
      ruleName: 'Temporary Files Cleanup',
      itemsRemoved: tempMedia.length,
      bytesFreed: freedBytes,
      details: tempMedia.length > 0
        ? `Cleared ${tempMedia.length} temporary media files (${formatBytes(freedBytes)} freed).`
        : 'No temporary files found.',
    };
  }

  /**
   * Rule 3: Cache Cleanup
   * Removes stale local storage keys (e.g., draft previews, cached states)
   */
  async cleanCacheData(): Promise<CleanupRuleResult> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {
        ruleName: 'Cache Storage Cleanup',
        itemsRemoved: 0,
        bytesFreed: 0,
        details: 'LocalStorage unavailable in current environment.',
      };
    }

    const keysToRemove: string[] = [];
    let freedBytes = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('temp_') || key.startsWith('cache_') || key.includes('_draft_preview'))) {
        const val = localStorage.getItem(key) || '';
        freedBytes += (key.length + val.length) * 2;
        keysToRemove.push(key);
      }
    }

    for (const k of keysToRemove) {
      localStorage.removeItem(k);
    }

    return {
      ruleName: 'Cache & Transient Data Cleanup',
      itemsRemoved: keysToRemove.length,
      bytesFreed: freedBytes,
      details: keysToRemove.length > 0
        ? `Purged ${keysToRemove.length} cached items (${formatBytes(freedBytes)} freed).`
        : 'Cache storage is clean.',
    };
  }

  /**
   * Rule 4: Duplicate Media Cleanup
   * Identifies media records with identical file size and name or duplicate base64 data
   */
  async cleanDuplicateMedia(): Promise<CleanupRuleResult> {
    const allMedia = await mediaService.getAll();
    const seen = new Map<string, string>(); // Signature -> First ID
    const duplicateIds: string[] = [];
    let freedBytes = 0;

    for (const m of allMedia) {
      // Signature based on filename + fileSize or data hash slice
      const signature = `${m.fileName.toLowerCase()}_${m.fileSize}_${(m.fileData || '').substring(0, 100)}`;
      if (seen.has(signature)) {
        duplicateIds.push(m.id);
        freedBytes += m.fileSize || estimateObjectSizeBytes(m);
      } else {
        seen.set(signature, m.id);
      }
    }

    for (const id of duplicateIds) {
      await mediaService.delete(id);
    }

    return {
      ruleName: 'Duplicate Media Assets Cleanup',
      itemsRemoved: duplicateIds.length,
      bytesFreed: freedBytes,
      details: duplicateIds.length > 0
        ? `Removed ${duplicateIds.length} duplicate media assets (${formatBytes(freedBytes)} freed).`
        : 'No duplicate media assets detected.',
    };
  }

  /**
   * Rule 5: Failed Uploads / Orphaned Draft Attachments Cleanup
   * Cleans posts that failed and have no valid attachments, or orphaned post images
   */
  async cleanFailedUploadsAndDrafts(): Promise<CleanupRuleResult> {
    const allPosts = await postService.getAll();
    const failedDrafts = allPosts.filter(
      (p) => p.status === 'draft' && !p.title.trim() && !p.caption.trim() && !p.content.trim()
    );

    let freedBytes = 0;
    for (const post of failedDrafts) {
      freedBytes += estimateObjectSizeBytes(post);
      await postService.delete(post.id);
    }

    return {
      ruleName: 'Incomplete / Failed Draft Cleanup',
      itemsRemoved: failedDrafts.length,
      bytesFreed: freedBytes,
      details: failedDrafts.length > 0
        ? `Pruned ${failedDrafts.length} empty or failed draft posts (${formatBytes(freedBytes)} freed).`
        : 'No incomplete drafts found.',
    };
  }
}

export const cleanupRulesEngine = new CleanupRulesEngine();
