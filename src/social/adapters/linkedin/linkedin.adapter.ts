import {
  ISocialAdapter,
  SocialPlatform,
  PlatformAdapterConfig,
  OAuthAuthUrlOptions,
  OAuthTokenResult,
} from '../../types';

export class LinkedInAdapter implements ISocialAdapter {
  readonly platform: SocialPlatform = 'linkedin';
  readonly displayName = 'LinkedIn';

  getConfig(): PlatformAdapterConfig {
    return {
      platform: 'linkedin',
      displayName: 'LinkedIn',
      clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'LINKEDIN_CLIENT_ID_PLACEHOLDER',
      authEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
      scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social', 'rw_organization_admin'],
      docUrl: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow',
    };
  }

  getAuthUrl(options: OAuthAuthUrlOptions): string {
    const config = this.getConfig();
    const scopes = [...config.scopes, ...(options.additionalScopes || [])].join(' ');
    const state = options.state || `li_state_${Date.now()}`;

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: options.redirectUri,
      state,
      scope: scopes,
    });

    return `${config.authEndpoint}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, _redirectUri: string): Promise<OAuthTokenResult> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    return {
      accessToken: `AQV_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      refreshToken: `li_rf_${Math.random().toString(36).substring(2, 12)}`,
      tokenExpiry: expiryDate.toISOString(),
      accountId: `li_urn_${Math.random().toString(36).substring(2, 10)}`,
      accountName: 'Nexus Global Solutions (LinkedIn)',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
      scopes: this.getPermissions(),
    };
  }

  async validateToken(accessToken: string): Promise<boolean> {
    if (!accessToken || accessToken.trim() === '') return false;
    return accessToken.startsWith('AQV') || accessToken.length > 10;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; tokenExpiry: string }> {
    if (!refreshToken) throw new Error('Missing LinkedIn refresh token');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    return {
      accessToken: `AQV_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
    };
  }

  getPermissions(): string[] {
    return this.getConfig().scopes;
  }

  async getAccountDetails(_accessToken: string): Promise<{ accountId: string; accountName: string; avatar: string }> {
    return {
      accountId: `li_urn_${Math.random().toString(36).substring(2, 10)}`,
      accountName: 'Nexus Global Solutions (LinkedIn)',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
    };
  }
}
