import { socialAccountService } from '../../database/services/socialAccountService';
import { SocialAccountRecord, SocialAccountStatus } from '../../database/types';
import { SocialPlatform, SocialAccount } from '../../social/types';
import { platformService } from './platform.service';
import { tokenService } from './token.service';

export interface SocialAccountFilterOptions {
  status?: string;
  platform?: string;
  searchQuery?: string;
}

export interface SocialAccountStats {
  total: number;
  connected: number;
  disconnected: number;
  expired: number;
  error: number;
  pending: number;
}

const DEFAULT_SEED_ACCOUNTS: Omit<SocialAccountRecord, 'connectedAt'>[] = [
  {
    id: 'soc_fb_1',
    userId: 'usr_main',
    platform: 'facebook',
    accountName: 'Nexus Tech Facebook Page',
    accountId: 'fb_page_88492011',
    avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150',
    status: 'Connected',
    accessToken: 'EAAB_fb992104812309482',
    refreshToken: 'fb_rf_77281039',
    tokenExpiry: new Date(Date.now() + 55 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'soc_ig_1',
    userId: 'usr_main',
    platform: 'instagram',
    accountName: '@nexustech_official',
    accountId: 'ig_biz_44920192',
    avatar: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150',
    status: 'Connected',
    accessToken: 'IGQVJ_ig99210481230',
    refreshToken: 'ig_rf_11029384',
    tokenExpiry: new Date(Date.now() + 42 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'soc_li_1',
    userId: 'usr_main',
    platform: 'linkedin',
    accountName: 'Nexus Global Solutions',
    accountId: 'li_urn_company_982103',
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
    status: 'Expired',
    accessToken: 'AQV_li8829102394',
    refreshToken: 'li_rf_99182301',
    tokenExpiry: new Date(Date.now() - 2 * 86400000).toISOString(), // Expired 2 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'soc_gh_1',
    userId: 'usr_main',
    platform: 'github',
    accountName: 'nexustech-dev-org',
    accountId: 'gh_usr_991823',
    avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
    status: 'Connected',
    accessToken: 'gho_882910293848123901923',
    refreshToken: 'ghr_11029381',
    tokenExpiry: new Date(Date.now() + 300 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class SocialService {
  /**
   * Initializes seed accounts if IndexedDB is empty
   */
  private async ensureInitialized(): Promise<void> {
    try {
      const accounts = await socialAccountService.getAll();
      if (accounts.length === 0) {
        for (const account of DEFAULT_SEED_ACCOUNTS) {
          await socialAccountService.save({
            ...account,
            connectedAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.error('Error initializing social accounts store:', err);
    }
  }

  /**
   * Retrieves all social accounts with filter and search capabilities
   */
  async getAccounts(options?: SocialAccountFilterOptions): Promise<SocialAccountRecord[]> {
    await this.ensureInitialized();
    let accounts = await socialAccountService.getAll();

    // Auto update expired statuses
    accounts = accounts.map((acc) => {
      if (acc.status === 'Connected' && tokenService.isTokenExpired(acc.tokenExpiry)) {
        return { ...acc, status: 'Expired' };
      }
      return acc;
    });

    if (options?.status && options.status !== 'All') {
      accounts = accounts.filter(
        (acc) => acc.status.toLowerCase() === options.status!.toLowerCase()
      );
    }

    if (options?.platform && options.platform !== 'All') {
      accounts = accounts.filter(
        (acc) => acc.platform.toLowerCase() === options.platform!.toLowerCase()
      );
    }

    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase().trim();
      accounts = accounts.filter(
        (acc) =>
          acc.accountName.toLowerCase().includes(q) ||
          acc.platform.toLowerCase().includes(q) ||
          acc.accountId.toLowerCase().includes(q)
      );
    }

    return accounts;
  }

  /**
   * Fetches account details by ID
   */
  async getAccountById(id: string): Promise<SocialAccountRecord | null> {
    await this.ensureInitialized();
    return socialAccountService.getById(id);
  }

  /**
   * Connects or reconnects a social account using platform OAuth code exchange
   */
  async connectAccount(
    platform: SocialPlatform,
    code: string = 'auth_code_demo',
    redirectUri: string = 'http://localhost:3000/oauth/callback'
  ): Promise<SocialAccountRecord> {
    await this.ensureInitialized();
    const adapter = platformService.getAdapter(platform);

    // Exchange OAuth code for access token via platform adapter
    const tokenResult = await adapter.exchangeCodeForToken(code, redirectUri);

    const existingAccounts = await socialAccountService.getAll();
    const existing = existingAccounts.find(
      (a) => a.platform.toLowerCase() === platform.toLowerCase() && a.accountId === tokenResult.accountId
    );

    const now = new Date().toISOString();
    const newRecord: SocialAccountRecord = {
      id: existing ? existing.id : `soc_${platform.substring(0, 2)}_${Date.now()}`,
      userId: 'usr_main',
      platform,
      accountName: tokenResult.accountName,
      accountId: tokenResult.accountId,
      avatar: tokenResult.avatar,
      status: 'Connected',
      accessToken: tokenResult.accessToken,
      refreshToken: tokenResult.refreshToken,
      tokenExpiry: tokenResult.tokenExpiry,
      connectedAt: existing ? existing.connectedAt : now,
      updatedAt: now,
    };

    await socialAccountService.save(newRecord);
    return newRecord;
  }

  /**
   * Disconnects an account, revokes local tokens and updates status
   */
  async disconnectAccount(id: string): Promise<SocialAccountRecord> {
    await this.ensureInitialized();
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Social account with ID ${id} not found.`);

    const updatedRecord: SocialAccountRecord = {
      ...account,
      status: 'Disconnected',
      accessToken: '',
      refreshToken: '',
      updatedAt: new Date().toISOString(),
    };

    await socialAccountService.save(updatedRecord);
    return updatedRecord;
  }

  /**
   * Triggers a token refresh operation for an expired account
   */
  async refreshAccountToken(id: string): Promise<SocialAccountRecord> {
    await this.ensureInitialized();
    const account = await socialAccountService.getById(id);
    if (!account) throw new Error(`Social account with ID ${id} not found.`);

    const adapter = platformService.getAdapter(account.platform as SocialPlatform);
    const refreshed = await adapter.refreshToken(account.refreshToken || 'rf_demo');

    const updatedRecord: SocialAccountRecord = {
      ...account,
      status: 'Connected',
      accessToken: refreshed.accessToken,
      tokenExpiry: refreshed.tokenExpiry,
      updatedAt: new Date().toISOString(),
    };

    await socialAccountService.save(updatedRecord);
    return updatedRecord;
  }

  /**
   * Validates token health against platform adapter
   */
  async testConnection(id: string): Promise<{ isValid: boolean; message: string }> {
    await this.ensureInitialized();
    const account = await socialAccountService.getById(id);
    if (!account) return { isValid: false, message: 'Account not found' };

    if (!account.accessToken) {
      return { isValid: false, message: 'Missing Access Token' };
    }

    if (tokenService.isTokenExpired(account.tokenExpiry)) {
      return { isValid: false, message: 'Access Token Expired' };
    }

    const adapter = platformService.getAdapter(account.platform as SocialPlatform);
    const isValid = await adapter.validateToken(account.accessToken);

    return {
      isValid,
      message: isValid ? 'Connection Active & Verified' : 'Token invalid or revoked',
    };
  }

  /**
   * Returns social account metrics
   */
  async getAccountStats(): Promise<SocialAccountStats> {
    await this.ensureInitialized();
    const accounts = await socialAccountService.getAll();

    const stats: SocialAccountStats = {
      total: accounts.length,
      connected: 0,
      disconnected: 0,
      expired: 0,
      error: 0,
      pending: 0,
    };

    for (const acc of accounts) {
      if (acc.status === 'Connected' && tokenService.isTokenExpired(acc.tokenExpiry)) {
        stats.expired++;
      } else {
        switch (acc.status) {
          case 'Connected':
            stats.connected++;
            break;
          case 'Disconnected':
            stats.disconnected++;
            break;
          case 'Expired':
            stats.expired++;
            break;
          case 'Error':
            stats.error++;
            break;
          case 'Pending':
            stats.pending++;
            break;
          default:
            stats.disconnected++;
            break;
        }
      }
    }

    return stats;
  }
}

export const socialService = new SocialService();
