import { BackupPayload, BackupValidationResult } from '../../types/backup';
import { VersionService } from './version.service';

export class ValidationService {
  public static validateBackupPayload(payload: any): BackupValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!payload || typeof payload !== 'object') {
      return { isValid: false, errors: ['Invalid JSON format or empty payload.'], warnings };
    }

    if (!payload.metadata) {
      errors.push('Missing required metadata root object.');
    } else {
      const meta = payload.metadata;
      if (!meta.id) errors.push('Metadata missing backup ID.');
      if (!meta.backupType) errors.push('Metadata missing backupType.');
      if (!meta.backupVersion) errors.push('Metadata missing backupVersion.');
      if (!meta.checksum) errors.push('Metadata missing integrity checksum.');

      if (meta.backupVersion) {
        const comp = VersionService.isCompatible(meta.backupVersion);
        if (!comp.compatible) {
          errors.push(comp.reason || 'Incompatible version.');
        }
      }
    }

    if (!payload.data || typeof payload.data !== 'object') {
      errors.push('Missing data object in backup.');
    }

    // Verify Checksum if data exists
    if (errors.length === 0 && payload.data) {
      const dataStr = JSON.stringify(payload.data);
      const computedChecksum = VersionService.generateChecksum(dataStr);
      if (computedChecksum !== payload.metadata.checksum) {
        errors.push('Checksum mismatch! The backup data may be corrupted or altered.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: payload.metadata,
    };
  }
}
