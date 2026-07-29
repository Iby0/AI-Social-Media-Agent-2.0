import { useAnalyticsContext } from '../context/AnalyticsContext';
import { ExportFormat } from '../types/analytics';

export function useReports() {
  const context = useAnalyticsContext();

  const exportReport = (format: ExportFormat) => {
    context.exportReport(format);
  };

  return {
    exportReport,
    retentionDays: context.retentionDays,
    updateRetentionDays: context.updateRetentionDays,
  };
}
