import {
  ISocialAdapter,
  SocialPlatform,
  PlatformAdapterConfig,
  OAuthAuthUrlOptions,
  OAuthTokenResult,
} from '../../types';
import { getFacebookConfig, FACEBOOK_REQUIRED_SCOPES } from './facebook.config';
import { FacebookOAuthHandler } from './facebook.oauth';
import { FacebookPageSelectOption } from './facebook.types';

export class FacebookService implements ISocialAdapter {
  readonly platform: SocialPlatform = 'facebook';
  readonly displayName = 'Facebook Page';

  getConfig(): PlatformAdapterConfig {
    return getFacebookConfig();
  }

  getAuthUrl(options: OAuthAuthUrlOptions): string {
    return FacebookOAuthHandler.getAuthUrl(options);
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    return FacebookOAuthHandler.exchangeCode(code, redirectUri);
  }

  async validateToken(accessToken: string): Promise<boolean> {
    if (!accessToken || accessToken.trim() === '') return false;
    return accessToken.startsWith('EAAB') || accessToken.length > 10;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; tokenExpiry: string }> {
    if (!refreshToken) throw new Error('Missing Facebook refresh token');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    return {
      accessToken: `EAAB_renewed_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
    };
  }

  getPermissions(): string[] {
    return FACEBOOK_REQUIRED_SCOPES;
  }

  async getAccountDetails(accessToken: string): Promise<{ accountId: string; accountName: string; avatar: string }> {
    return {
      accountId: `fb_page_${Math.floor(100000000 + Math.random() * 900000000)}`,
      accountName: 'Official Tech Facebook Page',
      avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150',
    };
  }

  async getPages(userAccessToken: string): Promise<FacebookPageSelectOption[]> {
    return FacebookOAuthHandler.fetchUserPages(userAccessToken);
  }
}
