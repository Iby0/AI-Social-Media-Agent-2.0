import { LinkedInOAuthHandler } from './linkedin.oauth';
import { LinkedInAccount, LinkedInProfile } from './linkedin.types';
import { LINKEDIN_REQUIRED_SCOPES } from './linkedin.config';

export class LinkedInService {
  static async getProfile(accessToken: string): Promise<LinkedInProfile> {
    return await LinkedInOAuthHandler.fetchProfile(accessToken);
  }

  static getRequiredScopes(): string[] {
    return LINKEDIN_REQUIRED_SCOPES;
  }

  static mapToAccount(profile: LinkedInProfile, accessToken: string, refreshToken?: string): LinkedInAccount {
    const now = new Date().toISOString();
    return {
      id: `soc_li_${profile.id}`,
      linkedinId: profile.id,
      name: profile.name,
      profilePicture: profile.profilePicture || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
      email: profile.email || 'user@linkedin.com',
      accessToken,
      refreshToken,
      status: 'Connected',
      connectedAt: now,
      updatedAt: now,
      headline: profile.headline,
      vanityName: profile.vanityName,
    };
  }
}
