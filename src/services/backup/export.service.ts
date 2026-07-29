import { BackupPayload } from '../../types/backup';

export class ExportService {
  public static downloadJson(payload: BackupPayload, filename?: string): void {
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${payload.metadata.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public static downloadCsv(payload: BackupPayload, filename?: string): void {
    const rows: string[] = [];
    rows.push('Section,ID,Title_Or_Name,Status_Or_Type,Created_At');

    if (Array.isArray(payload.data.content)) {
      payload.data.content.forEach((item: any) => {
        rows.push(
          `Content,${item.id || ''},"${(item.title || item.content || '').replace(/"/g, '""')}",${
            item.status || ''
          },${item.createdAt || ''}`
        );
      });
    }

    if (Array.isArray(payload.data.channels)) {
      payload.data.channels.forEach((item: any) => {
        rows.push(
          `Channel,${item.id || ''},"${(item.name || '').replace(/"/g, '""')}",${item.platform || ''},${
            item.connectedAt || ''
          }`
        );
      });
    }

    if (Array.isArray(payload.data.workflows)) {
      payload.data.workflows.forEach((item: any) => {
        rows.push(
          `Workflow,${item.id || ''},"${(item.name || '').replace(/"/g, '""')}",${item.status || ''},${
            item.createdAt || ''
          }`
        );
      });
    }

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `backup_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
