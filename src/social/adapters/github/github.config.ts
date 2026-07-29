import { PlatformAdapterConfig } from '../../types';

export const GITHUB_REQUIRED_SCOPES = ['read:user', 'user:email', 'repo'];

export const getGitHubConfig = (): PlatformAdapterConfig => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID_PLACEHOLDER';
  return {
    platform: 'github',
    displayName: 'GitHub',
    clientId,
    authEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    scopes: GITHUB_REQUIRED_SCOPES,
    docUrl: 'https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app',
  };
};
