export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'github';

export type SocialAccountStatus = 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending';

export interface SocialAccount {
  id: string;
  userId: string;
  platform: SocialPlatform;
  accountName: string;
  accountId: string;
  avatar: string;
  status: SocialAccountStatus;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: string;
  connectedAt: string;
  updatedAt: string;
}

export interface PlatformAdapterConfig {
  platform: SocialPlatform;
  displayName: string;
  clientId: string;
  authEndpoint: string;
  tokenEndpoint: string;
  scopes: string[];
  docUrl: string;
}

export interface OAuthAuthUrlOptions {
  redirectUri: string;
  state?: string;
  additionalScopes?: string[];
}

export interface OAuthTokenResult {
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: string; // ISO string timestamp
  accountId: string;
  accountName: string;
  avatar: string;
  scopes: string[];
}

export interface ISocialAdapter {
  platform: SocialPlatform;
  displayName: string;
  getConfig(): PlatformAdapterConfig;
  getAuthUrl(options: OAuthAuthUrlOptions): string;
  exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokenResult>;
  validateToken(accessToken: string): Promise<boolean>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string; tokenExpiry: string }>;
  getPermissions(): string[];
  getAccountDetails(accessToken: string): Promise<{ accountId: string; accountName: string; avatar: string }>;
}
