import { logService } from '../services/logService';
import { settingService } from '../services/settingService';

export interface CleanupResult {
  removedLogsCount: number;
  executedAt: string;
}

export async function runAutoCleanup(maxLogAgeDays: number = 30): Promise<CleanupResult> {
  const settings = await settingService.getSettings();

  if (!settings.autoCleanup) {
    return {
      removedLogsCount: 0,
      executedAt: new Date().toISOString(),
    };
  }

  const removedLogs = await logService.deleteOlderThanDays(maxLogAgeDays);

  if (removedLogs > 0) {
    await logService.log(
      `Auto Cleanup executed: pruned ${removedLogs} logs older than ${maxLogAgeDays} days`,
      'system',
      'info'
    );
  }

  return {
    removedLogsCount: removedLogs,
    executedAt: new Date().toISOString(),
  };
}
