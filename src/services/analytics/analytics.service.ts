import { MetricsService } from './metrics.service';
import { LogService } from './log.service';
import { ReportService } from './report.service';
import { AnalyticsOverview, DailyTimeSeriesMetric, PlatformStat, SystemErrorRecord, SystemLogRecord, SystemModuleType } from '../../types/analytics';

export class AnalyticsService {
  static getOverview(): AnalyticsOverview {
    return MetricsService.getOverviewMetrics();
  }

  static getPlatformStats(): PlatformStat[] {
    return MetricsService.getPlatformStats();
  }

  static getTimeSeries(): DailyTimeSeriesMetric[] {
    return MetricsService.getTimeSeriesData();
  }

  static getLogs(moduleFilter?: SystemModuleType): SystemLogRecord[] {
    return LogService.getLogs(moduleFilter);
  }

  static getErrors(): SystemErrorRecord[] {
    return LogService.getErrors();
  }

  static updateErrorStatus(id: string, status: 'unresolved' | 'acknowledged' | 'resolved'): void {
    LogService.updateErrorStatus(id, status);
  }

  static logEvent(
    module: SystemModuleType,
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    details?: Record<string, any>
  ): SystemLogRecord {
    return LogService.addLog(module, level, message, details);
  }

  static recordError(
    module: SystemModuleType,
    severity: 'info' | 'warning' | 'error' | 'critical',
    message: string,
    stackTrace?: string
  ): SystemErrorRecord {
    MetricsService.incrementMetric('errorsToday');
    return LogService.addError(module, severity, message, stackTrace);
  }

  static exportReport(format: 'json' | 'csv' | 'pdf'): void {
    ReportService.exportReport(format);
  }

  static getRetentionDays(): number {
    return LogService.getRetentionDays();
  }

  static setRetentionDays(days: number): void {
    LogService.setRetentionDays(days);
  }

  static clearAllData(): void {
    LogService.clearAllLogsAndErrors();
  }
}
