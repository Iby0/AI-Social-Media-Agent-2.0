import { SocialAccountStatus } from '../../types';

export interface LinkedInAccount {
  id: string;
  linkedinId: string;
  name: string;
  profilePicture: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  status: SocialAccountStatus;
  connectedAt: string;
  updatedAt: string;
  headline?: string;
  vanityName?: string;
}

export interface LinkedInProfile {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  name: string;
  email?: string;
  profilePicture?: string;
  headline?: string;
  vanityName?: string;
}

export interface LinkedInOAuthOptions {
  redirectUri: string;
  state?: string;
  additionalScopes?: string[];
}
