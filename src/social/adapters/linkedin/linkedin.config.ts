import { PlatformAdapterConfig } from '../../types';

export const LINKEDIN_REQUIRED_SCOPES = [
  'openid',
  'profile',
  'email',
  'w_member_social',
];

export const getLinkedInConfig = (): PlatformAdapterConfig => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'LINKEDIN_CLIENT_ID_PLACEHOLDER';
  return {
    platform: 'linkedin',
    displayName: 'LinkedIn',
    clientId,
    authEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: LINKEDIN_REQUIRED_SCOPES,
    docUrl: 'https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow',
  };
};
