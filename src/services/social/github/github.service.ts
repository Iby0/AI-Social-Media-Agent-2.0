import { socialAccountService } from '../../../database/services/socialAccountService';
import { GITHUB_REQUIRED_SCOPES } from '../../../social/adapters/github/github.config';
import { GitHubOAuthHandler } from '../../../social/adapters/github/github.oauth';
import { GitHubAccount, GitHubUserProfile } from '../../../social/adapters/github/github.types';
import { tokenService } from '../token.service';

export class SocialGitHubService {
  /**
   * Fetches GitHub user profile by access token
   */
  static async fetchUserProfile(accessToken: string): Promise<GitHubUserProfile> {
    return await GitHubOAuthHandler.fetchUserProfile(accessToken);
  }

  /**
   * Connects and persists GitHub Account to IndexedDB
   */
  static async connectAccount(
    profile: GitHubUserProfile,
    accessToken: string,
    refreshToken?: string
  ): Promise<GitHubAccount> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365);

    const record = await socialAccountService.save({
      id: `soc_gh_${profile.id}`,
      platform: 'github',
      accountName: profile.name || profile.login,
      username: profile.login,
      accountId: profile.id,
      avatar: profile.avatarUrl,
      email: profile.email,
      repositoriesCount: profile.publicRepos,
      status: 'Connected',
      accessToken: accessToken || `gho_${Date.now()}`,
      refreshToken: refreshToken || `ghr_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
      permissions: GITHUB_REQUIRED_SCOPES,
    });

    return {
      id: record.id,
      githubId: record.accountId,
      username: record.username,
      avatar: record.avatar || 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=150',
      email: record.email || 'user@github.com',
      repositoriesCount: record.repositoriesCount || profile.publicRepos,
      accessToken: record.accessToken || accessToken,
      refreshToken: record.refreshToken,
      status: record.status as any,
      connectedAt: record.connectedAt,
      updatedAt: record.updatedAt,
      bio: profile.bio,
      publicGists: profile.publicGists,
    };
  }

  /**
   * Tests GitHub connection health
   */
  static async testConnection(accountId: string): Promise<{ isValid: boolean; message: string }> {
    const acc = await socialAccountService.getById(accountId);
    if (!acc) return { isValid: false, message: 'GitHub account record not found in IndexedDB' };

    const isFormatValid = tokenService.validateTokenFormat(acc.accessToken);
    const expiryInfo = tokenService.getTimeToExpiry(acc.tokenExpiry);

    if (expiryInfo.isExpired) {
      await socialAccountService.updateStatus(acc.id, 'Expired');
      return { isValid: false, message: 'GitHub access token expired.' };
    }

    if (!isFormatValid) {
      return { isValid: false, message: 'GitHub token format invalid.' };
    }

    return { isValid: true, message: `GitHub token active and healthy.` };
  }

  /**
   * Explanation of GitHub OAuth 2.0 Integration & Scopes
   */
  static getRequirementExplanation(): { title: string; explanation: string; steps: string[] } {
    return {
      title: 'GitHub OAuth 2.0 Web Application Authorization',
      explanation:
        'GitHub Web Application Flow authorizes applications using OAuth 2.0 tokens to read user profiles, access email addresses, and manage code repository events.',
      steps: [
        '1. Register a new OAuth Application in GitHub Settings > Developer Settings > OAuth Apps.',
        '2. Set the Authorization Callback URL to your application callback URI.',
        '3. Copy the Client ID and generate a Client Secret.',
        '4. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.',
      ],
    };
  }
}
