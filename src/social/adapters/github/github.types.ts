import { SocialAccountStatus } from '../../types';

export interface GitHubAccount {
  id: string;
  githubId: string;
  username: string;
  avatar: string;
  email: string;
  repositoriesCount: number;
  accessToken: string;
  refreshToken?: string;
  status: SocialAccountStatus;
  connectedAt: string;
  updatedAt?: string;
  bio?: string;
  publicGists?: number;
}

export interface GitHubUserProfile {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  email?: string;
  publicRepos: number;
  publicGists?: number;
  bio?: string;
  htmlUrl?: string;
}

export interface GitHubOAuthOptions {
  redirectUri: string;
  state?: string;
  additionalScopes?: string[];
}
