import { socialAccountService } from '../../../database/services/socialAccountService';
import { LINKEDIN_REQUIRED_SCOPES } from '../../../social/adapters/linkedin/linkedin.config';
import { LinkedInOAuthHandler } from '../../../social/adapters/linkedin/linkedin.oauth';
import { LinkedInAccount, LinkedInProfile } from '../../../social/adapters/linkedin/linkedin.types';
import { tokenService } from '../token.service';

export class SocialLinkedInService {
  /**
   * Fetches LinkedIn Profile by access token
   */
  static async fetchProfile(accessToken: string): Promise<LinkedInProfile> {
    return await LinkedInOAuthHandler.fetchProfile(accessToken);
  }

  /**
   * Connects and persists LinkedIn account to IndexedDB
   */
  static async connectAccount(
    profile: LinkedInProfile,
    accessToken: string,
    refreshToken?: string
  ): Promise<LinkedInAccount> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    const record = await socialAccountService.save({
      id: `soc_li_${profile.id}`,
      platform: 'linkedin',
      accountName: profile.name,
      username: profile.vanityName || profile.email || profile.id,
      accountId: profile.id,
      avatar: profile.profilePicture,
      email: profile.email,
      status: 'Connected',
      accessToken: accessToken || `AQV_li_${Date.now()}`,
      refreshToken: refreshToken || `li_rf_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
      permissions: LINKEDIN_REQUIRED_SCOPES,
    });

    return {
      id: record.id,
      linkedinId: record.accountId,
      name: record.accountName,
      profilePicture: record.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
      email: record.email || 'user@linkedin.com',
      accessToken: record.accessToken || accessToken,
      refreshToken: record.refreshToken,
      status: record.status as any,
      connectedAt: record.connectedAt,
      updatedAt: record.updatedAt || record.connectedAt,
      headline: profile.headline || 'Professional LinkedIn Member',
      vanityName: profile.vanityName,
    };
  }

  /**
   * Tests LinkedIn token and account connection health
   */
  static async testConnection(accountId: string): Promise<{ isValid: boolean; message: string }> {
    const acc = await socialAccountService.getById(accountId);
    if (!acc) return { isValid: false, message: 'LinkedIn account record not found in IndexedDB' };

    const isFormatValid = tokenService.validateTokenFormat(acc.accessToken);
    const expiryInfo = tokenService.getTimeToExpiry(acc.tokenExpiry);

    if (expiryInfo.isExpired) {
      await socialAccountService.updateStatus(acc.id, 'Expired');
      return { isValid: false, message: 'LinkedIn access token expired. Re-authorization required.' };
    }

    if (!isFormatValid) {
      return { isValid: false, message: 'LinkedIn token string structure invalid.' };
    }

    return { isValid: true, message: `LinkedIn token healthy. Expiry in ${expiryInfo.days} days.` };
  }

  /**
   * Returns LinkedIn Architecture Explanation & OAuth Requirements
   */
  static getRequirementExplanation(): { title: string; explanation: string; steps: string[] } {
    return {
      title: 'LinkedIn Member OAuth 2.0 & OpenID Connect',
      explanation:
        'LinkedIn API uses OAuth 2.0 with OpenID Connect scopes (openid, profile, email) to authenticate members securely. Long-lived access tokens are granted for 60 days.',
      steps: [
        '1. Create a LinkedIn App in the LinkedIn Developer Portal.',
        '2. Request "Share on LinkedIn" and "Sign In with LinkedIn using OpenID Connect" products.',
        '3. Add authorized OAuth 2.0 redirect URLs in your LinkedIn App settings.',
        '4. Provide LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.',
      ],
    };
  }
}
