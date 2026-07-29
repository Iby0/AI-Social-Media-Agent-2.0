import { BackupPayload, BackupValidationResult } from '../../types/backup';
import { ValidationService } from './validation.service';
import { VersionService } from './version.service';

export class ImportService {
  public static async parseAndValidateJsonFile(file: File): Promise<{
    payload?: BackupPayload;
    validation: BackupValidationResult;
  }> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          const validation = ValidationService.validateBackupPayload(parsed);

          if (validation.isValid) {
            resolve({ payload: parsed as BackupPayload, validation });
          } else {
            resolve({ validation });
          }
        } catch (e: any) {
          resolve({
            validation: {
              isValid: false,
              errors: [`File read or JSON parsing error: ${e.message || 'SyntaxError'}`],
              warnings: [],
            },
          });
        }
      };

      reader.onerror = () => {
        resolve({
          validation: {
            isValid: false,
            errors: ['Failed to read input file from system.'],
            warnings: [],
          },
        });
      };

      reader.readAsText(file);
    });
  }

  public static async parseCsvFile(file: File): Promise<BackupPayload> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const lines = content.split('\n').filter((l) => l.trim().length > 0);

          const posts: any[] = [];
          const channels: any[] = [];

          // Skip header
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length >= 4) {
              const section = parts[0].trim();
              const id = parts[1].trim();
              const title = parts[2].replace(/^"|"$/g, '').trim();
              const status = parts[3].trim();

              if (section === 'Content') {
                posts.push({ id, title, status, createdAt: new Date().toISOString() });
              } else if (section === 'Channel') {
                channels.push({ id, name: title, platform: status, connectedAt: new Date().toISOString() });
              }
            }
          }

          const dataPayload = { content: posts, channels };
          const dataStr = JSON.stringify(dataPayload);
          const checksum = VersionService.generateChecksum(dataStr);

          const payload: BackupPayload = {
            metadata: {
              id: `imported-csv-${Date.now()}`,
              name: `CSV Import - ${file.name}`,
              backupType: 'full',
              backupVersion: VersionService.CURRENT_BACKUP_VERSION,
              appVersion: VersionService.CURRENT_APP_VERSION,
              moduleVersion: VersionService.CURRENT_MODULE_VERSION,
              timestamp: new Date().toISOString(),
              sizeBytes: file.size,
              checksum,
              status: 'valid',
              itemCounts: {
                posts: posts.length,
                channels: channels.length,
              },
            },
            data: dataPayload,
          };

          resolve(payload);
        } catch (err: any) {
          reject(new Error(`CSV Parsing failed: ${err.message}`));
        }
      };

      reader.readAsText(file);
    });
  }
}
