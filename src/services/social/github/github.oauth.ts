import { GitHubOAuthHandler } from '../../../social/adapters/github/github.oauth';
import { OAuthAuthUrlOptions, OAuthTokenResult } from '../../../social/types';
import { tokenService } from '../token.service';

export class SocialGitHubOAuthService {
  /**
   * Generates GitHub OAuth authorization URL
   */
  static getAuthUrl(redirectUri: string): string {
    const options: OAuthAuthUrlOptions = {
      redirectUri,
      state: `github_state_${Date.now()}`,
    };
    return GitHubOAuthHandler.getAuthUrl(options);
  }

  /**
   * Exchanges authorization code for access token
   */
  static async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokenResult> {
    if (!code || code.trim() === '') {
      throw new Error('OAuth authorization code is required for GitHub exchange');
    }
    return await GitHubOAuthHandler.exchangeCode(code, redirectUri);
  }

  /**
   * Validates GitHub access token format & status
   */
  static validateToken(token: string): boolean {
    if (!token) return false;
    return (
      tokenService.validateTokenFormat(token) &&
      (token.startsWith('gho_') || token.startsWith('ghp_') || token.length > 10)
    );
  }
}
