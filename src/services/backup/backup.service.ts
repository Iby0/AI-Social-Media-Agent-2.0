import { db } from '../../lib/db';
import {
  BackupMetadata,
  BackupPayload,
  BackupSettingsConfig,
  BackupType,
} from '../../types/backup';
import { VersionService } from './version.service';

const BACKUP_HISTORY_KEY = 'ai_social_backup_history';
const BACKUP_SETTINGS_KEY = 'ai_social_backup_settings';

export class BackupService {
  public static async createBackup(
    backupType: BackupType = 'full',
    customName?: string
  ): Promise<BackupPayload> {
    const timestamp = new Date().toISOString();
    const id = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Read stored items from IndexedDB
    const posts = await db.posts.toArray();
    const channels = await db.channels.toArray();
    const workflows = await db.workflows.toArray();
    const logs = await db.activityLogs.toArray();

    // Sensitive key masking for safety
    const maskedChannels = channels.map((c) => ({
      ...c,
      accessToken: c.accessToken ? '***REDACTED***' : undefined,
    }));

    const rawSettings = localStorage.getItem('ai_social_backup_settings') || '{}';
    const settingsObj = JSON.parse(rawSettings);

    const dataPayload: BackupPayload['data'] = {};

    if (backupType === 'full' || backupType === 'content') {
      dataPayload.content = posts;
    }

    if (backupType === 'full' || backupType === 'social_accounts' || backupType === 'media_metadata') {
      dataPayload.channels = maskedChannels;
    }

    if (backupType === 'full' || backupType === 'workflow' || backupType === 'automation_rules') {
      dataPayload.workflows = workflows;
      dataPayload.automationRules = { activeRulesCount: workflows.length };
    }

    if (backupType === 'full' || backupType === 'analytics') {
      dataPayload.logs = logs;
      dataPayload.analytics = { exportTimestamp: timestamp, logCount: logs.length };
    }

    if (backupType === 'full' || backupType === 'settings') {
      dataPayload.settings = settingsObj;
    }

    const dataString = JSON.stringify(dataPayload);
    const checksum = VersionService.generateChecksum(dataString);
    const sizeBytes = new Blob([JSON.stringify({ data: dataPayload })]).size;

    const metadata: BackupMetadata = {
      id,
      name: customName || `${backupType.toUpperCase()} Backup - ${new Date().toLocaleDateString()}`,
      backupType,
      backupVersion: VersionService.CURRENT_BACKUP_VERSION,
      appVersion: VersionService.CURRENT_APP_VERSION,
      moduleVersion: VersionService.CURRENT_MODULE_VERSION,
      timestamp,
      sizeBytes,
      checksum,
      status: 'valid',
      itemCounts: {
        posts: posts.length,
        channels: channels.length,
        workflows: workflows.length,
        logs: logs.length,
        settings: Object.keys(settingsObj).length,
      },
    };

    const payload: BackupPayload = {
      metadata,
      data: dataPayload,
    };

    // Save to local backup history
    this.recordBackupHistory(metadata);

    return payload;
  }

  public static getBackupHistory(): BackupMetadata[] {
    try {
      const raw = localStorage.getItem(BACKUP_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public static recordBackupHistory(meta: BackupMetadata): void {
    const history = this.getBackupHistory();
    history.unshift(meta);
    localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  }

  public static clearBackupHistory(): void {
    localStorage.removeItem(BACKUP_HISTORY_KEY);
  }

  public static getBackupSettings(): BackupSettingsConfig {
    try {
      const raw = localStorage.getItem(BACKUP_SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {
      autoBackupEnabled: false,
      frequency: 'manual',
      backupBeforeRestore: true,
      backupBeforeMajorChanges: true,
      maxStoredBackups: 10,
    };
  }

  public static updateBackupSettings(settings: Partial<BackupSettingsConfig>): BackupSettingsConfig {
    const current = this.getBackupSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(BACKUP_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  }
}
