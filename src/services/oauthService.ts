import { OAuthProvider, User } from '../types/auth';

export interface OAuthConfig {
  clientId?: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
}

const OAUTH_PROVIDERS: Record<OAuthProvider, Partial<OAuthConfig>> = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid profile email',
  },
  github: {
    authUrl: 'https://github.com/login/oauth/authorize',
    scope: 'user:email read:user',
  },
  email: {},
};

/**
 * Constructs official OAuth Provider authorization URL.
 */
export function getOAuthAuthorizeUrl(provider: OAuthProvider, redirectUri: string): string {
  const config = OAUTH_PROVIDERS[provider];
  if (!config || !config.authUrl) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const clientId =
    provider === 'google'
      ? import.meta.env.VITE_GOOGLE_CLIENT_ID || 'DEMO_GOOGLE_CLIENT_ID'
      : import.meta.env.VITE_GITHUB_CLIENT_ID || 'DEMO_GITHUB_CLIENT_ID';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scope || '',
    state: `oauth_state_${Date.now()}`,
  });

  return `${config.authUrl}?${params.toString()}`;
}

/**
 * Simulated OAuth authentication response generator for demo/fallback environments.
 */
export function createMockOAuthUser(provider: OAuthProvider): User {
  const isGoogle = provider === 'google';
  return {
    id: `usr_${provider}_${Math.random().toString(36).substring(2, 9)}`,
    name: isGoogle ? 'Alex Rivera (Google)' : 'Devon Vance (GitHub)',
    email: isGoogle ? 'alex.rivera@gmail.com' : 'devon.vance@github.com',
    avatarUrl: isGoogle
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    provider,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      defaultTone: 'Professional',
      autoSaveDrafts: true,
      emailNotifications: true,
      twoFactorEnabled: false,
    },
  };
}
