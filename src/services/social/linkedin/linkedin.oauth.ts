import { LinkedInOAuthHandler } from '../../../social/adapters/linkedin/linkedin.oauth';
import { OAuthAuthUrlOptions, OAuthTokenResult } from '../../../social/types';
import { tokenService } from '../token.service';

export class SocialLinkedInOAuthService {
  /**
   * Generates LinkedIn OAuth authorization URL
   */
  static getAuthUrl(redirectUri: string): string {
    const options: OAuthAuthUrlOptions = {
      redirectUri,
      state: `linkedin_state_${Date.now()}`,
    };
    return LinkedInOAuthHandler.getAuthUrl(options);
  }

  /**
   * Exchanges authorization code for access token
   */
  static async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    if (!code || code.trim() === '') {
      throw new Error('OAuth authorization code is required for LinkedIn exchange');
    }
    return await LinkedInOAuthHandler.exchangeCode(code, redirectUri);
  }

  /**
   * Validates LinkedIn access token format & validity
   */
  static validateToken(token: string): boolean {
    if (!token) return false;
    return tokenService.validateTokenFormat(token) && (token.startsWith('AQV') || token.length > 10);
  }
}
