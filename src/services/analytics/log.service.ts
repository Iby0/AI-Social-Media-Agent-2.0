import { SystemErrorRecord, SystemLogRecord, SystemModuleType } from '../../types/analytics';

const LOGS_STORAGE_KEY = 'ai_social_system_logs';
const ERRORS_STORAGE_KEY = 'ai_social_system_errors';
const RETENTION_DAYS_KEY = 'ai_social_log_retention_days';

export class LogService {
  static getRetentionDays(): number {
    try {
      const val = localStorage.getItem(RETENTION_DAYS_KEY);
      return val ? parseInt(val, 10) : 30; // default 30 days
    } catch {
      return 30;
    }
  }

  static setRetentionDays(days: number): void {
    try {
      localStorage.setItem(RETENTION_DAYS_KEY, days.toString());
      this.cleanupExpiredLogs();
    } catch (e) {
      console.warn('Failed to save log retention setting', e);
    }
  }

  static getLogs(moduleFilter?: SystemModuleType): SystemLogRecord[] {
    try {
      const raw = localStorage.getItem(LOGS_STORAGE_KEY);
      let logs: SystemLogRecord[] = raw ? JSON.parse(raw) : [];
      if (!raw) {
        logs = this.getInitialSeedLogs();
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
      }
      if (moduleFilter) {
        return logs.filter((l) => l.module === moduleFilter);
      }
      return logs;
    } catch {
      return this.getInitialSeedLogs();
    }
  }

  static addLog(
    module: SystemModuleType,
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    details?: Record<string, any>
  ): SystemLogRecord {
    const logs = this.getLogs();
    const newLog: SystemLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      module,
      level,
      message,
      details,
    };
    logs.unshift(newLog);
    if (logs.length > 500) logs.pop();

    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to write system log', e);
    }
    return newLog;
  }

  static getErrors(): SystemErrorRecord[] {
    try {
      const raw = localStorage.getItem(ERRORS_STORAGE_KEY);
      let errors: SystemErrorRecord[] = raw ? JSON.parse(raw) : [];
      if (!raw) {
        errors = this.getInitialSeedErrors();
        localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(errors));
      }
      return errors;
    } catch {
      return this.getInitialSeedErrors();
    }
  }

  static addError(
    module: SystemModuleType,
    severity: 'info' | 'warning' | 'error' | 'critical',
    message: string,
    stackTrace?: string
  ): SystemErrorRecord {
    const errors = this.getErrors();
    const newError: SystemErrorRecord = {
      id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      module,
      severity,
      message,
      status: 'unresolved',
      stackTrace,
    };
    errors.unshift(newError);
    if (errors.length > 200) errors.pop();

    try {
      localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(errors));
    } catch (e) {
      console.warn('Failed to record system error', e);
    }
    return newError;
  }

  static updateErrorStatus(id: string, status: 'unresolved' | 'acknowledged' | 'resolved'): void {
    const errors = this.getErrors();
    const idx = errors.findIndex((e) => e.id === id);
    if (idx >= 0) {
      errors[idx].status = status;
      try {
        localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(errors));
      } catch (e) {
        console.warn('Failed to update error status', e);
      }
    }
  }

  static cleanupExpiredLogs(): void {
    const days = this.getRetentionDays();
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const logs = this.getLogs().filter((l) => l.timestamp >= cutoff);
    const errors = this.getErrors().filter((e) => e.timestamp >= cutoff);

    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
      localStorage.setItem(ERRORS_STORAGE_KEY, JSON.stringify(errors));
    } catch (e) {
      console.warn('Log cleanup failed', e);
    }
  }

  static clearAllLogsAndErrors(): void {
    localStorage.removeItem(LOGS_STORAGE_KEY);
    localStorage.removeItem(ERRORS_STORAGE_KEY);
  }

  private static getInitialSeedLogs(): SystemLogRecord[] {
    const now = new Date();
    return [
      {
        id: 'log_seed_1',
        timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
        module: 'ai',
        level: 'info',
        message: 'Gemini 2.5 Flash API prompt processed successfully for LinkedIn caption generation.',
      },
      {
        id: 'log_seed_2',
        timestamp: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
        module: 'publishing',
        level: 'info',
        message: 'Official Graph API post dispatched to Facebook Page (Post ID: fb_9812739).',
      },
      {
        id: 'log_seed_3',
        timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
        module: 'automation',
        level: 'info',
        message: 'Decision Engine triggered autonomous post cycle for topic "AI Tech Trends".',
      },
      {
        id: 'log_seed_4',
        timestamp: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
        module: 'storage',
        level: 'info',
        message: 'Local IndexedDB quota health check: 12.4 MB stored (clean operating margin).',
      },
    ];
  }

  private static getInitialSeedErrors(): SystemErrorRecord[] {
    const now = new Date();
    return [
      {
        id: 'err_seed_1',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        module: 'publishing',
        severity: 'warning',
        message: 'LinkedIn API Rate Limit warning: 85% quota consumed for current hourly window.',
        status: 'unresolved',
      },
      {
        id: 'err_seed_2',
        timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
        module: 'ai',
        severity: 'info',
        message: 'Safety filter adjusted prompt threshold during image caption synthesis.',
        status: 'acknowledged',
      },
    ];
  }
}
