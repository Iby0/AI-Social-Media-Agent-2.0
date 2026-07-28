import { StorageInfo } from '../types';
import { settingService } from '../services/settingService';

export async function getStorageMetrics(): Promise<StorageInfo> {
  const settings = await settingService.getSettings();
  const limitMB = settings.storageLimit || 500;
  const quotaBytes = limitMB * 1024 * 1024;

  let usedBytes = 0;

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      usedBytes = estimate.usage || 0;
    } catch {
      usedBytes = 5 * 1024 * 1024; // Fallback mock 5MB if estimation unallowed
    }
  } else {
    usedBytes = 5 * 1024 * 1024;
  }

  const usagePercentage = Math.min(100, Math.round((usedBytes / quotaBytes) * 100));
  const isWarning = usagePercentage >= 80;
  const isLimitExceeded = usagePercentage >= 100;

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return {
    usedBytes,
    quotaBytes,
    usagePercentage,
    isWarning,
    isLimitExceeded,
    usedFormatted: formatSize(usedBytes),
    quotaFormatted: formatSize(quotaBytes),
  };
}
