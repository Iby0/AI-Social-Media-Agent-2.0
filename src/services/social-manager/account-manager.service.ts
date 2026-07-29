import { socialAccountService } from '../../database/services/socialAccountService';
import { SocialAccountRecord, SocialPlatform } from '../../database/types';
import { socialService } from '../social/social.service';
import { healthService, HealthEvaluationResult } from './health.service';
import { tokenMonitorService, TokenStatusSummary } from './token-monitor.service';
import { connectionHistoryService } from './connection-history.service';

export interface AccountQueryOptions {
  status?: string; // 'All' | 'Connected' | 'Disconnected' | 'Needs Attention' | 'Expired'
  platform?: string; // 'All' | 'facebook' | 'instagram' | 'linkedin' | 'github'
  searchQuery?: string;
  sortBy?: 'Recently Connected' | 'Platform' | 'Health' | 'Status' | 'Name';
}

export class AccountManagerService {
  /**
   * Retrieves social accounts with health level & token status calculated, filtered and sorted
   */
  async getAccounts(options?: AccountQueryOptions): Promise<SocialAccountRecord[]> {
    let accounts = await socialService.getAccounts({
      status: options?.status === 'Needs Attention' ? 'All' : options?.status,
      platform: options?.platform,
      searchQuery: options?.searchQuery,
    });

    // Enrich accounts with Module 15 computed values (health, enabled default, display name)
    accounts = accounts.map((acc) => {
      const health = healthService.evaluateHealth(acc);
      const tokenSummary = tokenMonitorService.evaluateToken(acc);

      return {
        ...acc,
        enabled: acc.enabled !== undefined ? acc.enabled : true,
        displayName: acc.displayName || acc.accountName,
        healthLevel: health.level,
        accountType: acc.accountType || this.getAccountTypeLabel(acc.platform),
        lastSyncAt: acc.lastSyncAt || acc.updatedAt || acc.connectedAt,
        status: tokenSummary.isExpired ? 'Expired' : acc.status,
      };
    });

    // Special Filter: Needs Attention
    if (options?.status === 'Needs Attention') {
      accounts = accounts.filter(
        (a) =>
          a.status === 'Expired' ||
          a.status === 'Error' ||
          a.healthLevel === 'Warning' ||
          a.healthLevel === 'Critical' ||
          a.healthLevel === 'Offline'
      );
    }

    // Apply Sorting
    if (options?.sortBy) {
      accounts = this.sortAccounts(accounts, options.sortBy);
    }

    return accounts;
  }

  /**
   * Sorts accounts array
   */
  private sortAccounts(accounts: SocialAccountRecord[], sortBy: AccountQueryOptions['sortBy']): SocialAccountRecord[] {
    const list = [...accounts];
    switch (sortBy) {
      case 'Recently Connected':
        return list.sort(
          (a, b) => new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime()
        );
      case 'Platform':
        return list.sort((a, b) => a.platform.localeCompare(b.platform));
      case 'Name':
        return list.sort((a, b) => (a.displayName || a.accountName).localeCompare(b.displayName || b.accountName));
      case 'Status':
        return list.sort((a, b) => a.status.localeCompare(b.status));
      case 'Health': {
        const order = { Excellent: 1, Good: 2, Warning: 3, Critical: 4, Offline: 5 };
        return list.sort(
          (a, b) => (order[a.healthLevel || 'Good'] || 3) - (order[b.healthLevel || 'Good'] || 3)
        );
      }
      default:
        return list;
    }
  }

  /**
   * Connects a new social account
   */
  async connectAccount(
    platform: SocialPlatform,
    code?: string,
    redirectUri?: string
  ): Promise<SocialAccountRecord> {
    const account = await socialService.connectAccount(platform as any, code, redirectUri);
    account.accountType = this.getAccountTypeLabel(platform);
    account.enabled = true;
    account.lastSyncAt = new Date().toISOString();

    await socialAccountService.save(account);

    await connectionHistoryService.addHistoryLog(
      platform,
      'Connect',
      'Success',
      `Connected ${account.accountName} (${this.getAccountTypeLabel(platform)}).`,
      account.id
    );

    return account;
  }

  /**
   * Reconnects an existing account
   */
  async reconnectAccount(id: string): Promise<SocialAccountRecord> {
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Account ${id} not found.`);

    const refreshed = await socialService.connectAccount(
      account.platform as any,
      `reconnect_code_${Date.now()}`
    );

    refreshed.id = account.id; // Keep existing record ID
    refreshed.displayName = account.displayName || account.accountName;
    refreshed.enabled = true;
    refreshed.lastSyncAt = new Date().toISOString();

    await socialAccountService.save(refreshed);

    await connectionHistoryService.addHistoryLog(
      account.platform,
      'Reconnect',
      'Success',
      `Reconnected and re-authorized OAuth tokens for ${account.accountName}.`,
      account.id
    );

    return refreshed;
  }

  /**
   * Disconnects account
   */
  async disconnectAccount(id: string): Promise<SocialAccountRecord> {
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Account ${id} not found.`);

    const disconnected = await socialService.disconnectAccount(id);

    await connectionHistoryService.addHistoryLog(
      account.platform,
      'Disconnect',
      'Info',
      `Disconnected ${account.accountName}. Revoked local tokens.`,
      account.id
    );

    return disconnected;
  }

  /**
   * Triggers OAuth token refresh
   */
  async refreshToken(id: string): Promise<SocialAccountRecord> {
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Account ${id} not found.`);

    const updated = await socialService.refreshAccountToken(id);
    updated.lastSyncAt = new Date().toISOString();
    await socialAccountService.save(updated);

    await connectionHistoryService.addHistoryLog(
      account.platform,
      'Refresh Token',
      'Success',
      `OAuth access token successfully refreshed for ${account.accountName}.`,
      account.id
    );

    return updated;
  }

  /**
   * Refreshes all active connected tokens across all platforms
   */
  async refreshAllTokens(): Promise<{ successCount: number; errorCount: number }> {
    const accounts = await socialAccountService.getAll();
    let successCount = 0;
    let errorCount = 0;

    for (const acc of accounts) {
      if (acc.status === 'Connected' || acc.status === 'Expired') {
        try {
          await this.refreshToken(acc.id);
          successCount++;
        } catch (e) {
          errorCount++;
          console.warn(`Failed token refresh for ${acc.accountName}:`, e);
        }
      }
    }

    return { successCount, errorCount };
  }

  /**
   * Renames account display name
   */
  async renameDisplayName(id: string, newDisplayName: string): Promise<SocialAccountRecord> {
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Account ${id} not found.`);

    account.displayName = newDisplayName.trim();
    account.updatedAt = new Date().toISOString();

    await socialAccountService.save(account);

    await connectionHistoryService.addHistoryLog(
      account.platform,
      'Rename',
      'Success',
      `Display name updated to "${newDisplayName.trim()}"`,
      account.id
    );

    return account;
  }

  /**
   * Toggles enable/disable state of an account
   */
  async toggleEnableAccount(id: string, enabled: boolean): Promise<SocialAccountRecord> {
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Account ${id} not found.`);

    account.enabled = enabled;
    account.updatedAt = new Date().toISOString();

    await socialAccountService.save(account);

    await connectionHistoryService.addHistoryLog(
      account.platform,
      'Toggle State',
      'Info',
      `Account sync state set to ${enabled ? 'Enabled' : 'Disabled'}.`,
      account.id
    );

    return account;
  }

  /**
   * Permanently removes account record from IndexedDB
   */
  async removeAccount(id: string): Promise<void> {
    const account = await socialAccountService.getById(id);
    if (account) {
      await connectionHistoryService.addHistoryLog(
        account.platform,
        'Disconnect',
        'Warning',
        `Account record permanently deleted from IndexedDB: ${account.accountName}`,
        id
      );
    }
    await socialAccountService.delete(id);
  }

  /**
   * Tests and evaluates account health
   */
  async checkAccountHealth(id: string): Promise<{
    account: SocialAccountRecord;
    evaluation: HealthEvaluationResult;
    connectionTest: { isValid: boolean; message: string };
  }> {
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Account ${id} not found.`);

    const connectionTest = await socialService.testConnection(id);
    const evaluation = healthService.evaluateHealth(account);

    account.lastSyncAt = new Date().toISOString();
    account.healthLevel = evaluation.level;
    await socialAccountService.save(account);

    await connectionHistoryService.addHistoryLog(
      account.platform,
      'Health Check',
      connectionTest.isValid ? 'Success' : 'Warning',
      `Health evaluation: ${evaluation.level} (${evaluation.score}%). Message: ${connectionTest.message}`,
      id
    );

    return { account, evaluation, connectionTest };
  }

  /**
   * Helper to resolve platform default account type label
   */
  private getAccountTypeLabel(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'Facebook Business Page';
      case 'instagram':
        return 'Instagram Business Account';
      case 'linkedin':
        return 'LinkedIn Member / Company';
      case 'github':
        return 'GitHub Developer / Organization';
      default:
        return 'Social Media Account';
    }
  }
}

export const accountManagerService = new AccountManagerService();
