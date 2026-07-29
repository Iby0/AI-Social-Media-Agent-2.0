import { GitHubOAuthHandler } from './github.oauth';
import { GitHubAccount, GitHubUserProfile } from './github.types';
import { GITHUB_REQUIRED_SCOPES } from './github.config';

export class GitHubService {
  static async getUserProfile(accessToken: string): Promise<GitHubUserProfile> {
    return await GitHubOAuthHandler.fetchUserProfile(accessToken);
  }

  static getRequiredScopes(): string[] {
    return GITHUB_REQUIRED_SCOPES;
  }

  static mapToAccount(profile: GitHubUserProfile, accessToken: string, refreshToken?: string): GitHubAccount {
    const now = new Date().toISOString();
    return {
      id: `soc_gh_${profile.id}`,
      githubId: profile.id,
      username: profile.login,
      avatar: profile.avatarUrl || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
      email: profile.email || 'user@github.com',
      repositoriesCount: profile.publicRepos,
      accessToken,
      refreshToken,
      status: 'Connected',
      connectedAt: now,
      updatedAt: now,
      bio: profile.bio,
      publicGists: profile.publicGists,
    };
  }
}
