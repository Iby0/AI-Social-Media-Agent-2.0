export type BackupType =
  | 'full'
  | 'settings'
  | 'content'
  | 'media_metadata'
  | 'workflow'
  | 'analytics'
  | 'automation_rules'
  | 'social_accounts';

export type AutoBackupFrequency = 'manual' | 'daily' | 'weekly' | 'monthly';

export interface BackupMetadata {
  id: string;
  name: string;
  backupType: BackupType;
  backupVersion: string;
  appVersion: string;
  moduleVersion: string;
  timestamp: string;
  sizeBytes: number;
  checksum: string;
  status: 'valid' | 'corrupted' | 'restored';
  itemCounts: {
    posts?: number;
    channels?: number;
    workflows?: number;
    logs?: number;
    analytics?: number;
    settings?: number;
  };
}

export interface BackupPayload {
  metadata: BackupMetadata;
  data: {
    settings?: Record<string, any>;
    content?: any[];
    channels?: any[];
    workflows?: any[];
    logs?: any[];
    analytics?: any;
    automationRules?: any;
  };
}

export interface BackupValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: BackupMetadata;
}

export interface BackupSettingsConfig {
  autoBackupEnabled: boolean;
  frequency: AutoBackupFrequency;
  backupBeforeRestore: boolean;
  backupBeforeMajorChanges: boolean;
  maxStoredBackups: number;
  lastBackupDate?: string;
}
