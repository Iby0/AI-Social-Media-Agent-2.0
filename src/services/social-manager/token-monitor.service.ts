import { SocialAccountRecord, TokenState } from '../../database/types';
import { tokenService } from '../social/token.service';

export interface TokenStatusSummary {
  tokenState: TokenState;
  daysRemaining: number;
  hoursRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean;
  maskedToken: string;
  badgeLabel: string;
  badgeVariant: 'emerald' | 'amber' | 'rose' | 'orange' | 'slate';
}

export class TokenMonitorService {
  /**
   * Evaluates token state for a given social account
   */
  evaluateToken(account: SocialAccountRecord): TokenStatusSummary {
    const statusNorm = (account.status || 'Disconnected').toLowerCase();

    if (statusNorm === 'disconnected') {
      return {
        tokenState: 'Disconnected',
        daysRemaining: 0,
        hoursRemaining: 0,
        isExpired: true,
        isExpiringSoon: false,
        maskedToken: 'Not Tokenized',
        badgeLabel: 'Disconnected',
        badgeVariant: 'slate',
      };
    }

    if (!account.accessToken || account.accessToken.trim() === '') {
      return {
        tokenState: 'Refresh Required',
        daysRemaining: 0,
        hoursRemaining: 0,
        isExpired: true,
        isExpiringSoon: false,
        maskedToken: 'Missing Token',
        badgeLabel: 'Refresh Required',
        badgeVariant: 'orange',
      };
    }

    const expiryInfo = tokenService.getTimeToExpiry(account.tokenExpiry);
    const masked = tokenService.maskToken(account.accessToken);

    if (expiryInfo.isExpired || statusNorm === 'expired') {
      return {
        tokenState: 'Expired',
        daysRemaining: 0,
        hoursRemaining: 0,
        isExpired: true,
        isExpiringSoon: false,
        maskedToken: masked,
        badgeLabel: 'Token Expired',
        badgeVariant: 'rose',
      };
    }

    if (expiryInfo.days < 7) {
      return {
        tokenState: 'Expiring Soon',
        daysRemaining: expiryInfo.days,
        hoursRemaining: expiryInfo.hours,
        isExpired: false,
        isExpiringSoon: true,
        maskedToken: masked,
        badgeLabel: `Expiring (${expiryInfo.days}d)`,
        badgeVariant: 'amber',
      };
    }

    return {
      tokenState: 'Valid',
      daysRemaining: expiryInfo.days,
      hoursRemaining: expiryInfo.hours,
      isExpired: false,
      isExpiringSoon: false,
      maskedToken: masked,
      badgeLabel: 'Valid Token',
      badgeVariant: 'emerald',
    };
  }

  /**
   * Scans multiple accounts to return expiring token metrics
   */
  getExpiringTokensSummary(accounts: SocialAccountRecord[]): {
    total: number;
    validCount: number;
    expiringSoonCount: number;
    expiredCount: number;
    expiringAccounts: SocialAccountRecord[];
  } {
    let validCount = 0;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    const expiringAccounts: SocialAccountRecord[] = [];

    for (const acc of accounts) {
      const summary = this.evaluateToken(acc);
      if (summary.tokenState === 'Valid') validCount++;
      if (summary.tokenState === 'Expiring Soon') {
        expiringSoonCount++;
        expiringAccounts.push(acc);
      }
      if (summary.tokenState === 'Expired' || summary.tokenState === 'Refresh Required') {
        expiredCount++;
      }
    }

    return {
      total: accounts.length,
      validCount,
      expiringSoonCount,
      expiredCount,
      expiringAccounts,
    };
  }
}

export const tokenMonitorService = new TokenMonitorService();
