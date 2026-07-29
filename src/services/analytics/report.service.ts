import { ExportFormat } from '../../types/analytics';
import { MetricsService } from './metrics.service';
import { LogService } from './log.service';

export class ReportService {
  static sanitizeData<T>(data: T): T {
    const jsonStr = JSON.stringify(data, (key, value) => {
      if (/token|secret|password|key|auth|bearer/i.test(key)) {
        return '[REDACTED]';
      }
      return value;
    });
    return JSON.parse(jsonStr);
  }

  static generateReportPayload() {
    const overview = MetricsService.getOverviewMetrics();
    const platforms = MetricsService.getPlatformStats();
    const timeSeries = MetricsService.getTimeSeriesData();
    const logs = LogService.getLogs().slice(0, 50);
    const errors = LogService.getErrors().slice(0, 50);

    const rawReport = {
      generatedAt: new Date().toISOString(),
      appName: 'AI Social Media Agent',
      version: '1.0.0',
      overview,
      platforms,
      timeSeries,
      logs,
      errors,
    };

    return this.sanitizeData(rawReport);
  }

  static exportReport(format: ExportFormat): void {
    const payload = this.generateReportPayload();

    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `ai_social_analytics_report_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'csv') {
      // Create CSV summary of daily time-series and platform stats
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += '--- OVERVIEW METRICS ---\n';
      csvContent += 'Metric,Value\n';
      Object.entries(payload.overview).forEach(([k, v]) => {
        csvContent += `${k},${v}\n`;
      });

      csvContent += '\n--- PLATFORM METRICS ---\n';
      csvContent += 'Platform,Total Posts,Failures,Success Rate (%),Last Activity\n';
      payload.platforms.forEach((p: any) => {
        csvContent += `${p.platform},${p.totalPosts},${p.failures},${p.successRate},${p.lastActivity}\n`;
      });

      csvContent += '\n--- DAILY TIME SERIES ---\n';
      csvContent += 'Date,Posts,AI Requests,Published,Failures,Storage (MB)\n';
      payload.timeSeries.forEach((t: any) => {
        csvContent += `${t.date},${t.posts},${t.aiRequests},${t.published},${t.failures},${t.storageMb}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodedUri);
      downloadAnchor.setAttribute('download', `ai_social_analytics_report_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'pdf') {
      // Open clean printable HTML summary report
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>AI Social Media Agent - System Analytics Report</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
                h2 { font-size: 16px; margin-top: 28px; color: #334155; }
                .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
                .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; rounded-radius: 8px; }
                .card-title { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
                .card-value { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
                th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
                th { background: #f1f5f9; font-weight: bold; }
                .footer { margin-top: 40px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
              </style>
            </head>
            <body>
              <h1>System Analytics & Health Executive Report</h1>
              <p style="font-size: 12px; color: #64748b;">Generated at: ${payload.generatedAt} | App: ${payload.appName} v${payload.version}</p>

              <h2>System Performance Overview</h2>
              <div class="grid">
                <div class="card"><div class="card-title">Total Posts</div><div class="card-value">${payload.overview.totalPosts}</div></div>
                <div class="card"><div class="card-title">Published</div><div class="card-value">${payload.overview.publishedPosts}</div></div>
                <div class="card"><div class="card-title">AI Requests</div><div class="card-value">${payload.overview.aiRequests}</div></div>
                <div class="card"><div class="card-title">Images Generated</div><div class="card-value">${payload.overview.imagesGenerated}</div></div>
              </div>

              <h2>Platform Performance</h2>
              <table>
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Total Posts</th>
                    <th>Failures</th>
                    <th>Success Rate</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  ${payload.platforms
                    .map(
                      (p: any) => `
                    <tr>
                      <td style="text-transform: capitalize; font-weight: bold;">${p.platform}</td>
                      <td>${p.totalPosts}</td>
                      <td>${p.failures}</td>
                      <td>${p.successRate}%</td>
                      <td>${new Date(p.lastActivity).toLocaleString()}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>

              <h2>Recent System Errors (${payload.errors.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Module</th>
                    <th>Severity</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${payload.errors
                    .slice(0, 10)
                    .map(
                      (e: any) => `
                    <tr>
                      <td>${new Date(e.timestamp).toLocaleTimeString()}</td>
                      <td>${e.module}</td>
                      <td style="text-transform: uppercase; font-weight: bold;">${e.severity}</td>
                      <td>${e.message}</td>
                      <td>${e.status}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>

              <div class="footer">
                This local analytics report was produced natively on-device. No data was transmitted to external servers.
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  }
}
