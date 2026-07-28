import { PlatformAdapterConfig } from '../../types';

export const INSTAGRAM_REQUIRED_SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_comments',
  'pages_show_list',
  'pages_read_engagement',
];

export const getInstagramConfig = (): PlatformAdapterConfig => {
  const appId = import.meta.env.VITE_META_APP_ID || import.meta.env.VITE_INSTAGRAM_CLIENT_ID || 'META_APP_ID_PLACEHOLDER';
  return {
    platform: 'instagram',
    displayName: 'Instagram Business',
    clientId: appId,
    authEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: INSTAGRAM_REQUIRED_SCOPES,
    docUrl: 'https://developers.facebook.com/docs/instagram-api',
  };
};
