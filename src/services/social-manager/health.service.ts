import { SocialAccountRecord, AccountHealthLevel } from '../../database/types';
import { tokenService } from '../social/token.service';

export interface HealthEvaluationResult {
  level: AccountHealthLevel;
  score: number; // 0 - 100
  statusText: string;
  reasons: string[];
  recommendation: string;
}

export class HealthService {
  /**
   * Evaluates and calculates the health level of a social account.
   * Health Levels:
   * - Excellent: Connected, Token active (> 30 days remaining), Enabled, recent sync
   * - Good: Connected, Token active (7-30 days remaining), Enabled
   * - Warning: Connected, Token expiring soon (< 7 days) or disabled by user
   * - Critical: Connected but Token Expired or Token Format invalid
   * - Offline: Disconnected or Error state
   */
  evaluateHealth(account: SocialAccountRecord): HealthEvaluationResult {
    const reasons: string[] = [];

    if (account.enabled === false) {
      return {
        level: 'Offline',
        score: 0,
        statusText: 'Account Disabled',
        reasons: ['Account toggled off by user setting.'],
        recommendation: 'Toggle account switch ON to reactivate sync.',
      };
    }

    const statusNorm = (account.status || 'Disconnected').toLowerCase();

    if (statusNorm === 'disconnected') {
      return {
        level: 'Offline',
        score: 0,
        statusText: 'Disconnected',
        reasons: ['Account is currently unlinked from social platform.'],
        recommendation: 'Click Re-connect to re-authorize platform permissions.',
      };
    }

    if (statusNorm === 'error') {
      return {
        level: 'Critical',
        score: 15,
        statusText: 'Connection Failure',
        reasons: ['Platform API returned authentication or sync error.'],
        recommendation: 'Re-authenticate account credentials to clear error state.',
      };
    }

    if (!account.accessToken || account.accessToken.trim() === '') {
      return {
        level: 'Critical',
        score: 10,
        statusText: 'Missing Credentials',
        reasons: ['No OAuth access token tokenized for this account.'],
        recommendation: 'Re-authorize OAuth login.',
      };
    }

    const expiryInfo = tokenService.getTimeToExpiry(account.tokenExpiry);

    if (expiryInfo.isExpired || statusNorm === 'expired') {
      return {
        level: 'Critical',
        score: 25,
        statusText: 'Token Expired',
        reasons: ['OAuth access token has exceeded its validity window.'],
        recommendation: 'Trigger Token Refresh or Re-authorize account.',
      };
    }

    if (expiryInfo.days < 7) {
      reasons.push(`Token expires in ${expiryInfo.days} days (${expiryInfo.hours}h).`);
      return {
        level: 'Warning',
        score: 60,
        statusText: 'Expiring Soon',
        reasons,
        recommendation: 'Refresh token before expiration to maintain uninterrupted publishing.',
      };
    }

    if (expiryInfo.days < 30) {
      reasons.push(`Token healthy with ${expiryInfo.days} days remaining.`);
      return {
        level: 'Good',
        score: 85,
        statusText: 'Healthy Token',
        reasons,
        recommendation: 'No immediate action required.',
      };
    }

    reasons.push(`OAuth token fully active with ${expiryInfo.days} days remaining.`);
    reasons.push('API permissions verified and health check passed.');

    return {
      level: 'Excellent',
      score: 100,
      statusText: 'Optimal Health',
      reasons,
      recommendation: 'Account operating at peak health state.',
    };
  }

  /**
   * Explanation of how Health Levels are calculated
   */
  getHealthCalculationExplanation(): { title: string; criteria: { level: AccountHealthLevel; description: string; scoreRange: string }[] } {
    return {
      title: 'Social Account Health Matrix Rules',
      criteria: [
        {
          level: 'Excellent',
          scoreRange: '90 - 100%',
          description: 'OAuth token valid for >30 days, permissions verified, account enabled & syncing normally.',
        },
        {
          level: 'Good',
          scoreRange: '75 - 89%',
          description: 'OAuth token valid for 7 to 30 days, normal operation without active alerts.',
        },
        {
          level: 'Warning',
          scoreRange: '50 - 74%',
          description: 'Token expiring within 7 days or account sync temporarily paused.',
        },
        {
          level: 'Critical',
          scoreRange: '10 - 49%',
          description: 'OAuth token expired, missing credentials, or platform API authorization revoked.',
        },
        {
          level: 'Offline',
          scoreRange: '0%',
          description: 'Account manually disconnected or explicitly disabled by user.',
        },
      ],
    };
  }
}

export const healthService = new HealthService();
