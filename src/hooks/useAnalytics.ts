import { useAnalyticsContext } from '../context/AnalyticsContext';

export function useAnalytics() {
  const context = useAnalyticsContext();

  return {
    overview: context.overview,
    platformStats: context.platformStats,
    timeSeries: context.timeSeries,
    logs: context.logs,
    errors: context.errors,
    activeModuleFilter: context.activeModuleFilter,
    setActiveModuleFilter: context.setActiveModuleFilter,
    refreshAnalytics: context.refreshAnalytics,
    updateErrorStatus: context.updateErrorStatus,
    recordEventLog: context.recordEventLog,
    recordErrorEvent: context.recordErrorEvent,
    retentionDays: context.retentionDays,
    updateRetentionDays: context.updateRetentionDays,
    clearAllAnalyticsData: context.clearAllAnalyticsData,
  };
}
