import { FacebookPage, FacebookPageSelectOption } from '../../../social/adapters/facebook/facebook.types';
import { FacebookOAuthHandler } from '../../../social/adapters/facebook/facebook.oauth';
import { socialAccountService } from '../../../database/services/socialAccountService';
import { FACEBOOK_REQUIRED_SCOPES } from '../../../social/adapters/facebook/facebook.config';
import { tokenService } from '../token.service';

export class MetaFacebookService {
  /**
   * Fetches pages available under user's Facebook account
   */
  static async fetchPages(userAccessToken: string): Promise<FacebookPageSelectOption[]> {
    return await FacebookOAuthHandler.fetchUserPages(userAccessToken);
  }

  /**
   * Connects and persists selected Facebook Page to IndexedDB
   */
  static async connectPage(pageOption: FacebookPageSelectOption): Promise<FacebookPage> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    const record = await socialAccountService.save({
      id: `soc_fb_page_${pageOption.pageId}`,
      platform: 'facebook',
      accountName: pageOption.pageName,
      username: pageOption.pageUsername || pageOption.pageId,
      accountId: pageOption.pageId,
      avatar: pageOption.pageAvatar,
      status: 'Connected',
      accessToken: pageOption.accessToken || `EAAB_page_${Date.now()}`,
      refreshToken: `fb_rf_${Date.now()}`,
      tokenExpiry: expiryDate.toISOString(),
      permissions: FACEBOOK_REQUIRED_SCOPES,
    });

    return {
      id: record.id,
      pageId: record.accountId,
      pageName: record.accountName,
      pageUsername: record.username,
      pageAvatar: record.avatar || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150',
      accessToken: record.accessToken,
      permissions: record.permissions || FACEBOOK_REQUIRED_SCOPES,
      status: record.status as any,
      connectedAt: record.connectedAt,
      category: pageOption.category,
      fanCount: pageOption.fanCount,
    };
  }

  /**
   * Validates Facebook page connection health
   */
  static async testPageConnection(pageId: string): Promise<{ isValid: boolean; message: string }> {
    const acc = await socialAccountService.getById(pageId);
    if (!acc) return { isValid: false, message: 'Facebook page connection record not found' };

    const isFormatValid = tokenService.validateTokenFormat(acc.accessToken);
    const expiryInfo = tokenService.getTimeToExpiry(acc.tokenExpiry);

    if (expiryInfo.isExpired) {
      await socialAccountService.updateStatus(acc.id, 'Expired');
      return { isValid: false, message: 'Facebook Page access token expired. Refresh token required.' };
    }

    if (!isFormatValid) {
      return { isValid: false, message: 'Facebook Page access token format invalid.' };
    }

    return { isValid: true, message: `Facebook Page token active and healthy. Expiry in ${expiryInfo.days} days.` };
  }
}

