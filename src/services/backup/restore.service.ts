import { db } from '../../lib/db';
import { BackupPayload, BackupType } from '../../types/backup';
import { BackupService } from './backup.service';
import { ValidationService } from './validation.service';

export interface RestoreSummary {
  postsRestored: number;
  channelsRestored: number;
  workflowsRestored: number;
  logsRestored: number;
  settingsRestored: boolean;
}

export class RestoreService {
  public static async restoreFromPayload(
    payload: BackupPayload,
    selectiveType?: BackupType
  ): Promise<RestoreSummary> {
    // 1. Validation
    const validation = ValidationService.validateBackupPayload(payload);
    if (!validation.isValid) {
      throw new Error(`Restore failed validation: ${validation.errors.join('; ')}`);
    }

    // 2. Create Safety Backup first if configured
    const settings = BackupService.getBackupSettings();
    if (settings.backupBeforeRestore) {
      await BackupService.createBackup('full', 'Auto Safety Backup before Restore');
    }

    const mode = selectiveType || payload.metadata.backupType;
    const data = payload.data;

    const summary: RestoreSummary = {
      postsRestored: 0,
      channelsRestored: 0,
      workflowsRestored: 0,
      logsRestored: 0,
      settingsRestored: false,
    };

    try {
      // 3. Selective or Full Restore execution
      if ((mode === 'full' || mode === 'content') && Array.isArray(data.content)) {
        await db.posts.clear();
        await db.posts.bulkAdd(data.content);
        summary.postsRestored = data.content.length;
      }

      if (
        (mode === 'full' || mode === 'social_accounts' || mode === 'media_metadata') &&
        Array.isArray(data.channels)
      ) {
        await db.channels.clear();
        await db.channels.bulkAdd(data.channels);
        summary.channelsRestored = data.channels.length;
      }

      if (
        (mode === 'full' || mode === 'workflow' || mode === 'automation_rules') &&
        Array.isArray(data.workflows)
      ) {
        await db.workflows.clear();
        await db.workflows.bulkAdd(data.workflows);
        summary.workflowsRestored = data.workflows.length;
      }

      if ((mode === 'full' || mode === 'analytics') && Array.isArray(data.logs)) {
        await db.activityLogs.clear();
        await db.activityLogs.bulkAdd(data.logs);
        summary.logsRestored = data.logs.length;
      }

      if ((mode === 'full' || mode === 'settings') && data.settings) {
        localStorage.setItem('ai_social_backup_settings', JSON.stringify(data.settings));
        summary.settingsRestored = true;
      }

      return summary;
    } catch (err: any) {
      throw new Error(`Restore transaction failed: ${err.message || 'Unknown database error'}`);
    }
  }
}
