import {
  ISocialAdapter,
  SocialPlatform,
  PlatformAdapterConfig,
  OAuthAuthUrlOptions,
  OAuthTokenResult,
} from '../../types';

export class GitHubAdapter implements ISocialAdapter {
  readonly platform: SocialPlatform = 'github';
  readonly displayName = 'GitHub';

  getConfig(): PlatformAdapterConfig {
    return {
      platform: 'github',
      displayName: 'GitHub',
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID_PLACEHOLDER',
      authEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
      scopes: ['read:user', 'user:email', 'repo'],
      docUrl: 'https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app',
    };
  }

  getAuthUrl(options: OAuthAuthUrlOptions): string {
    const config = this.getConfig();
    const scopes = [...config.scopes, ...(options.additionalScopes || [])].join(' ');
    const state = options.state || `gh_state_${Date.now()}`;

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: options.redirectUri,
      scope: scopes,
      state,
    });

    return `${config.authEndpoint}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, _redirectUri: string): Promise<OAuthTokenResult> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365); // GitHub personal/OAuth tokens often have long/no expiry

    return {
      accessToken: `gho_${Math.random().toString(36).substring(2, 20)}_${Date.now()}`,
      refreshToken: `ghr_${Math.random().toString(36).substring(2, 12)}`,
      tokenExpiry: expiryDate.toISOString(),
      accountId: `gh_usr_${Math.floor(100000 + Math.random() * 900000)}`,
      accountName: 'nexustech-dev-org',
      avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
      scopes: this.getPermissions(),
    };
  }

  async validateToken(accessToken: string): Promise<boolean> {
    if (!accessToken || accessToken.trim() === '') return false;
    return accessToken.startsWith('gho_') || accessToken.startsWith('ghp_') || accessToken.length > 10;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; tokenExpiry: string }> {
    if (!refreshToken) throw new Error('Missing GitHub refresh token');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365);

    return {
      accessToken: `gho_${Math.random().toString(36).substring(2, 20)}_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
    };
  }

  getPermissions(): string[] {
    return this.getConfig().scopes;
  }

  async getAccountDetails(_accessToken: string): Promise<{ accountId: string; accountName: string; avatar: string }> {
    return {
      accountId: `gh_usr_${Math.floor(100000 + Math.random() * 900000)}`,
      accountName: 'nexustech-dev-org',
      avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
    };
  }
}
