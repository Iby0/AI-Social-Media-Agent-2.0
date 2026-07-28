import {
  ISocialAdapter,
  SocialPlatform,
  PlatformAdapterConfig,
  OAuthAuthUrlOptions,
  OAuthTokenResult,
} from '../../types';
import { getInstagramConfig, INSTAGRAM_REQUIRED_SCOPES } from './instagram.config';
import { InstagramOAuthHandler } from './instagram.oauth';
import { InstagramBusinessSelectOption } from './instagram.types';

export class InstagramService implements ISocialAdapter {
  readonly platform: SocialPlatform = 'instagram';
  readonly displayName = 'Instagram Business';

  getConfig(): PlatformAdapterConfig {
    return getInstagramConfig();
  }

  getAuthUrl(options: OAuthAuthUrlOptions): string {
    return InstagramOAuthHandler.getAuthUrl(options);
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    return InstagramOAuthHandler.exchangeCode(code, redirectUri);
  }

  async validateToken(accessToken: string): Promise<boolean> {
    if (!accessToken || accessToken.trim() === '') return false;
    return accessToken.startsWith('EAAI') || accessToken.startsWith('EAAB') || accessToken.length > 10;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; tokenExpiry: string }> {
    if (!refreshToken) throw new Error('Missing Instagram refresh token');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    return {
      accessToken: `EAAI_renewed_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
    };
  }

  getPermissions(): string[] {
    return INSTAGRAM_REQUIRED_SCOPES;
  }

  async getAccountDetails(accessToken: string): Promise<{ accountId: string; accountName: string; avatar: string }> {
    return {
      accountId: `ig_biz_${Math.floor(100000000 + Math.random() * 900000000)}`,
      accountName: 'nexustech.official',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    };
  }

  async getConnectedInstagramAccounts(
    userAccessToken: string
  ): Promise<InstagramBusinessSelectOption[]> {
    return InstagramOAuthHandler.fetchConnectedInstagramAccounts(userAccessToken);
  }
}
