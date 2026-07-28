export interface InstagramAccount {
  id: string;
  instagramId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  status: 'Connected' | 'Disconnected' | 'Expired' | 'Error' | 'Pending';
  connectedAt: string;
  facebookPageId?: string;
  mediaCount?: number;
}

export interface InstagramOAuthResult {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  grantedScopes: string[];
  instagramBusinessAccountId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
}

export interface InstagramBusinessSelectOption {
  instagramId: string;
  username: string;
  name?: string;
  profilePicture: string;
  followersCount: number;
  mediaCount?: number;
  facebookPageId: string;
  facebookPageName: string;
  accessToken: string;
}
