import { PlatformAdapterConfig } from '../../types';

export const FACEBOOK_REQUIRED_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'public_profile',
];

export const getFacebookConfig = (): PlatformAdapterConfig => {
  const appId = import.meta.env.VITE_META_APP_ID || import.meta.env.VITE_FACEBOOK_APP_ID || 'META_APP_ID_PLACEHOLDER';
  return {
    platform: 'facebook',
    displayName: 'Facebook Page',
    clientId: appId,
    authEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: FACEBOOK_REQUIRED_SCOPES,
    docUrl: 'https://developers.facebook.com/docs/pages-api',
  };
};
