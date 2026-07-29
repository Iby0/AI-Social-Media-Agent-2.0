import { ConnectionHistoryItem, SocialPlatform } from '../../database/types';
import { db } from '../../lib/db';

export class ConnectionHistoryService {
  private inMemoryHistory: ConnectionHistoryItem[] = [
    {
      id: 'hist_1',
      accountId: 'soc_fb_1',
      platform: 'facebook',
      action: 'Connect',
      time: new Date(Date.now() - 3600000 * 48).toISOString(),
      status: 'Success',
      result: 'Meta OAuth 2.0 Page Token acquired & permissions granted.',
    },
    {
      id: 'hist_2',
      accountId: 'soc_ig_1',
      platform: 'instagram',
      action: 'Health Check',
      time: new Date(Date.now() - 3600000 * 24).toISOString(),
      status: 'Success',
      result: 'Instagram Graph API health verified. Token valid for 42 days.',
    },
    {
      id: 'hist_3',
      accountId: 'soc_li_1',
      platform: 'linkedin',
      action: 'Refresh Token',
      time: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: 'Warning',
      result: 'LinkedIn token expired. Re-authorization prompt requested.',
    },
    {
      id: 'hist_4',
      accountId: 'soc_gh_1',
      platform: 'github',
      action: 'Connect',
      time: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: 'Success',
      result: 'GitHub Web App OAuth flow authorized. User scopes linked.',
    },
  ];

  /**
   * Logs a new connection event
   */
  async addHistoryLog(
    platform: SocialPlatform,
    action: ConnectionHistoryItem['action'],
    status: ConnectionHistoryItem['status'],
    result: string,
    accountId?: string
  ): Promise<ConnectionHistoryItem> {
    const item: ConnectionHistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      accountId,
      platform,
      action,
      time: new Date().toISOString(),
      status,
      result,
    };

    this.inMemoryHistory.unshift(item);

    // Also persist log into IndexedDB activity logs
    try {
      await db.logActivity(
        `Social Action: ${action} (${platform})`,
        'channel',
        result,
        status === 'Success' ? 'success' : status === 'Error' ? 'error' : 'info'
      );
    } catch (e) {
      console.warn('Could not persist history to db logs:', e);
    }

    return item;
  }

  /**
   * Retrieves connection history logs
   */
  async getHistory(options?: {
    platform?: string;
    accountId?: string;
    limit?: number;
  }): Promise<ConnectionHistoryItem[]> {
    let logs = [...this.inMemoryHistory];

    if (options?.platform && options.platform !== 'All') {
      logs = logs.filter((l) => l.platform.toLowerCase() === options.platform!.toLowerCase());
    }

    if (options?.accountId) {
      logs = logs.filter((l) => l.accountId === options.accountId);
    }

    if (options?.limit) {
      logs = logs.slice(0, options.limit);
    }

    return logs;
  }

  /**
   * Clears in-memory connection history
   */
  clearHistory(): void {
    this.inMemoryHistory = [];
  }
}

export const connectionHistoryService = new ConnectionHistoryService();
