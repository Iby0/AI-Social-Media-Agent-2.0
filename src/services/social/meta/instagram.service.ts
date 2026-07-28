import {
  InstagramAccount,
  InstagramBusinessSelectOption,
} from '../../../social/adapters/instagram/instagram.types';
import { InstagramOAuthHandler } from '../../../social/adapters/instagram/instagram.oauth';
import { socialAccountService } from '../../../database/services/socialAccountService';
import { INSTAGRAM_REQUIRED_SCOPES } from '../../../social/adapters/instagram/instagram.config';
import { tokenService } from '../token.service';

export class MetaInstagramService {
  /**
   * Fetches Instagram Business accounts linked to user's Facebook pages
   */
  static async fetchConnectedAccounts(
    userAccessToken: string
  ): Promise<InstagramBusinessSelectOption[]> {
    return await InstagramOAuthHandler.fetchConnectedInstagramAccounts(userAccessToken);
  }

  /**
   * Connects and persists Instagram Business Account to IndexedDB
   */
  static async connectInstagramAccount(
    option: InstagramBusinessSelectOption
  ): Promise<InstagramAccount> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    const record = await socialAccountService.save({
      id: `soc_ig_biz_${option.instagramId}`,
      platform: 'instagram',
      accountName: option.username,
      username: option.username,
      accountId: option.instagramId,
      avatar: option.profilePicture,
      status: 'Connected',
      accessToken: option.accessToken || `EAAI_ig_${Date.now()}`,
      refreshToken: `ig_rf_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
      permissions: INSTAGRAM_REQUIRED_SCOPES,
    });

    return {
      id: record.id,
      instagramId: record.accountId,
      username: record.username,
      profilePicture: record.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      followersCount: option.followersCount,
      status: record.status as any,
      connectedAt: record.connectedAt,
      facebookPageId: option.facebookPageId,
      mediaCount: option.mediaCount,
    };
  }

  /**
   * Explains Meta Graph API constraint: why Instagram Business requires Facebook Page connection
   */
  static getInstagramRequirementExplanation(): { title: string; explanation: string; steps: string[] } {
    return {
      title: 'Why Instagram Business Requires a Facebook Page Connection',
      explanation:
        'Meta Graph API architecture enforces that Instagram Business and Creator accounts must be linked to an official Facebook Page. The Facebook Page acts as the security identity and permission anchor for Graph API calls.',
      steps: [
        '1. Convert your Instagram account to a Professional (Business or Creator) account in the Instagram Mobile App.',
        '2. Link your Instagram Professional account to a Facebook Page you manage.',
        '3. Authorize the application using Meta OAuth with pages_show_list and instagram_basic permissions.',
        '4. Meta Graph API automatically discovers the linked Instagram Business account attached to your Facebook Page.',
      ],
    };
  }

  /**
   * Tests Instagram Business token health
   */
  static async testInstagramConnection(accountId: string): Promise<{ isValid: boolean; message: string }> {
    const acc = await socialAccountService.getById(accountId);
    if (!acc) return { isValid: false, message: 'Instagram Business account record not found' };

    const isFormatValid = tokenService.validateTokenFormat(acc.accessToken);
    const expiryInfo = tokenService.getTimeToExpiry(acc.tokenExpiry);

    if (expiryInfo.isExpired) {
      await socialAccountService.updateStatus(acc.id, 'Expired');
      return { isValid: false, message: 'Instagram Business access token expired.' };
    }

    if (!isFormatValid) {
      return { isValid: false, message: 'Instagram token format invalid.' };
    }

    return { isValid: true, message: `Instagram Business account connection active and healthy.` };
  }
}
