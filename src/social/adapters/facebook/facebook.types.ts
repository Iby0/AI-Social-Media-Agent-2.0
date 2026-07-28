export interface FacebookPage {
  id: string;
  pageId: string;
  pageName: string;
  pageUsername?: string;
  pageAvatar: string;
  accessToken: string;
  permissions: string[];
  status: 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending';
  connectedAt: string;
  category?: string;
  fanCount?: number;
}

export interface FacebookOAuthResult {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  longLivedToken?: string;
  grantedScopes: string[];
}

export interface FacebookPageSelectOption {
  pageId: string;
  pageName: string;
  pageUsername?: string;
  pageAvatar: string;
  category?: string;
  fanCount?: number;
  accessToken: string;
  tasks?: string[];
  instagramBusinessAccountId?: string;
}
