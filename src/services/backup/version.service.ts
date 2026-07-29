export class VersionService {
  public static CURRENT_APP_VERSION = '2.2.0';
  public static CURRENT_BACKUP_VERSION = '1.0.0';
  public static CURRENT_MODULE_VERSION = '22.0.0';

  public static generateChecksum(contentString: string): string {
    let hash = 0;
    for (let i = 0; i < contentString.length; i++) {
      const char = contentString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  public static isCompatible(backupVersion: string): { compatible: boolean; reason?: string } {
    const major = parseInt(backupVersion.split('.')[0] || '0', 10);
    const currentMajor = parseInt(this.CURRENT_BACKUP_VERSION.split('.')[0], 10);

    if (major > currentMajor) {
      return {
        compatible: false,
        reason: `Backup version ${backupVersion} is newer than current app supported version ${this.CURRENT_BACKUP_VERSION}.`,
      };
    }
    return { compatible: true };
  }
}
