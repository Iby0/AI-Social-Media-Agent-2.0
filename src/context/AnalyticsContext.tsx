import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AnalyticsOverview,
  DailyTimeSeriesMetric,
  ExportFormat,
  PlatformStat,
  SystemErrorRecord,
  SystemLogRecord,
  SystemModuleType,
} from '../types/analytics';
import { AnalyticsService } from '../services/analytics/analytics.service';

interface AnalyticsContextType {
  overview: AnalyticsOverview;
  platformStats: PlatformStat[];
  timeSeries: DailyTimeSeriesMetric[];
  logs: SystemLogRecord[];
  errors: SystemErrorRecord[];
  retentionDays: number;
  activeModuleFilter: SystemModuleType | 'all';
  setActiveModuleFilter: (module: SystemModuleType | 'all') => void;
  refreshAnalytics: () => void;
  updateErrorStatus: (id: string, status: 'unresolved' | 'acknowledged' | 'resolved') => void;
  recordEventLog: (
    module: SystemModuleType,
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    details?: Record<string, any>
  ) => void;
  recordErrorEvent: (
    module: SystemModuleType,
    severity: 'info' | 'warning' | 'error' | 'critical',
    message: string,
    stackTrace?: string
  ) => void;
  updateRetentionDays: (days: number) => void;
  exportReport: (format: ExportFormat) => void;
  clearAllAnalyticsData: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overview, setOverview] = useState<AnalyticsOverview>(() => AnalyticsService.getOverview());
  const [platformStats, setPlatformStats] = useState<PlatformStat[]>(() => AnalyticsService.getPlatformStats());
  const [timeSeries, setTimeSeries] = useState<DailyTimeSeriesMetric[]>(() => AnalyticsService.getTimeSeries());
  const [activeModuleFilter, setActiveModuleFilter] = useState<SystemModuleType | 'all'>('all');
  const [logs, setLogs] = useState<SystemLogRecord[]>(() => AnalyticsService.getLogs());
  const [errors, setErrors] = useState<SystemErrorRecord[]>(() => AnalyticsService.getErrors());
  const [retentionDays, setRetentionDays] = useState<number>(() => AnalyticsService.getRetentionDays());

  const refreshAnalytics = useCallback(() => {
    setOverview(AnalyticsService.getOverview());
    setPlatformStats(AnalyticsService.getPlatformStats());
    setTimeSeries(AnalyticsService.getTimeSeries());
    const filter = activeModuleFilter === 'all' ? undefined : activeModuleFilter;
    setLogs(AnalyticsService.getLogs(filter));
    setErrors(AnalyticsService.getErrors());
  }, [activeModuleFilter]);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const updateErrorStatus = useCallback((id: string, status: 'unresolved' | 'acknowledged' | 'resolved') => {
    AnalyticsService.updateErrorStatus(id, status);
    setErrors(AnalyticsService.getErrors());
  }, []);

  const recordEventLog = useCallback(
    (
      module: SystemModuleType,
      level: 'info' | 'warn' | 'error' | 'debug',
      message: string,
      details?: Record<string, any>
    ) => {
      AnalyticsService.logEvent(module, level, message, details);
      refreshAnalytics();
    },
    [refreshAnalytics]
  );

  const recordErrorEvent = useCallback(
    (
      module: SystemModuleType,
      severity: 'info' | 'warning' | 'error' | 'critical',
      message: string,
      stackTrace?: string
    ) => {
      AnalyticsService.recordError(module, severity, message, stackTrace);
      refreshAnalytics();
    },
    [refreshAnalytics]
  );

  const updateRetentionDays = useCallback((days: number) => {
    AnalyticsService.setRetentionDays(days);
    setRetentionDays(days);
    refreshAnalytics();
  }, [refreshAnalytics]);

  const exportReport = useCallback((format: ExportFormat) => {
    AnalyticsService.exportReport(format);
  }, []);

  const clearAllAnalyticsData = useCallback(() => {
    AnalyticsService.clearAllData();
    refreshAnalytics();
  }, [refreshAnalytics]);

  return (
    <AnalyticsContext.Provider
      value={{
        overview,
        platformStats,
        timeSeries,
        logs,
        errors,
        retentionDays,
        activeModuleFilter,
        setActiveModuleFilter,
        refreshAnalytics,
        updateErrorStatus,
        recordEventLog,
        recordErrorEvent,
        updateRetentionDays,
        exportReport,
        clearAllAnalyticsData,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};
