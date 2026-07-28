import { FacebookOAuthHandler } from '../../../social/adapters/facebook/facebook.oauth';
import { InstagramOAuthHandler } from '../../../social/adapters/instagram/instagram.oauth';
import { OAuthAuthUrlOptions, OAuthTokenResult } from '../../../social/types';
import { tokenService } from '../token.service';

export class MetaOAuthService {
  /**
   * Generates Meta OAuth authorization URL for Facebook or Instagram
   */
  static getMetaAuthUrl(platform: 'facebook' | 'instagram', redirectUri: string): string {
    const options: OAuthAuthUrlOptions = {
      redirectUri,
      state: `meta_state_${platform}_${Date.now()}`,
    };

    if (platform === 'instagram') {
      return InstagramOAuthHandler.getAuthUrl(options);
    }
    return FacebookOAuthHandler.getAuthUrl(options);
  }

  /**
   * Exchanges authorization code for long-lived access token
   */
  static async exchangeCode(
    platform: 'facebook' | 'instagram',
    code: string,
    redirectUri: string
  ): Promise<OAuthTokenResult> {
    if (!code || code.trim() === '') {
      throw new Error('OAuth authorization code is required for Meta exchange');
    }

    if (platform === 'instagram') {
      return await InstagramOAuthHandler.exchangeCode(code, redirectUri);
    }
    return await FacebookOAuthHandler.exchangeCode(code, redirectUri);
  }

  /**
   * Validates Meta access token format & status
   */
  static validateMetaToken(token: string): boolean {
    if (!token) return false;
    return tokenService.validateTokenFormat(token) && (token.startsWith('EAAB') || token.startsWith('EAAI') || token.length > 15);
  }
}
