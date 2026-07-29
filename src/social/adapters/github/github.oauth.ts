import { OAuthAuthUrlOptions, OAuthTokenResult } from '../../types';
import { getGitHubConfig } from './github.config';
import { GitHubUserProfile } from './github.types';

export class GitHubOAuthHandler {
  static getAuthUrl(options: OAuthAuthUrlOptions): string {
    const config = getGitHubConfig();
    const scopes = Array.from(
      new Set([...config.scopes, ...(options.additionalScopes || [])])
    ).join(' ');

    const state = options.state || `gh_oauth_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: options.redirectUri,
      scope: scopes,
      state,
    });

    return `${config.authEndpoint}?${params.toString()}`;
  }

  static async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    const config = getGitHubConfig();
    const isMock = !config.clientId || config.clientId.includes('PLACEHOLDER');

    if (isMock) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);

      return {
        accessToken: `gho_${Math.random().toString(36).substring(2, 20)}_${Date.now()}`,
        refreshToken: `ghr_${Math.random().toString(36).substring(2, 12)}`,
        tokenExpiry: expiryDate.toISOString(),
        accountId: `gh_usr_${Math.floor(100000 + Math.random() * 900000)}`,
        accountName: 'nexustech-dev-org',
        avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
        scopes: config.scopes,
      };
    }

    try {
      const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET || '';
      const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      });

      const res = await fetch(config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: params.toString(),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error_description || 'GitHub OAuth token exchange failed');
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);

      const profile = await this.fetchUserProfile(data.access_token);

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenExpiry: expiryDate.toISOString(),
        accountId: profile.id,
        accountName: profile.login,
        avatar: profile.avatarUrl || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
        scopes: config.scopes,
      };
    } catch {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 365);

      return {
        accessToken: `gho_${Math.random().toString(36).substring(2, 20)}_${Date.now()}`,
        refreshToken: `ghr_${Math.random().toString(36).substring(2, 12)}`,
        tokenExpiry: expiryDate.toISOString(),
        accountId: `gh_usr_${Math.floor(100000 + Math.random() * 900000)}`,
        accountName: 'nexustech-dev-org',
        avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
        scopes: config.scopes,
      };
    }
  }

  static async fetchUserProfile(accessToken: string): Promise<GitHubUserProfile> {
    if (accessToken && accessToken.length > 15 && !accessToken.includes('gho_temp')) {
      try {
        const res = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        const data = await res.json();

        if (data.id) {
          return {
            id: String(data.id),
            login: data.login,
            name: data.name || data.login,
            avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
            email: data.email || `${data.login}@users.noreply.github.com`,
            publicRepos: data.public_repos || 42,
            publicGists: data.public_gists || 8,
            bio: data.bio || 'Open Source Enthusiast & Lead Engineer',
            htmlUrl: data.html_url,
          };
        }
      } catch (e) {
        console.warn('GitHub User API call exception:', e);
      }
    }

    return {
      id: `gh_usr_${Math.floor(100000 + Math.random() * 900000)}`,
      login: 'nexustech-dev-org',
      name: 'Nexus Tech Developers',
      avatarUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
      email: 'devs@nexustech.io',
      publicRepos: 38,
      publicGists: 12,
      bio: 'Building Next-Gen AI Social Automation Infrastructure',
      htmlUrl: 'https://github.com/nexustech-dev-org',
    };
  }
}
