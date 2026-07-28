/**
 * Token Management Service
 * Responsible for securely masking, storing, validating expiry, and updating OAuth tokens.
 * IMPORTANT SECURITY MANTRA: Never expose raw OAuth tokens in the UI!
 */

export interface TokenExpiryInfo {
  days: number;
  hours: number;
  isExpired: boolean;
  formatted: string;
}

export class TokenService {
  /**
   * Safely masks a raw access token for UI representation.
   * Example: "EAAB_ab123456789xyz" -> "EAAB••••••••789xyz"
   */
  maskToken(token?: string | null): string {
    if (!token) return '••••••••••••••••';
    const trimmed = token.trim();
    if (trimmed.length <= 8) return '••••••••';
    
    const prefix = trimmed.substring(0, 4);
    const suffix = trimmed.substring(trimmed.length - 4);
    return `${prefix}••••••••${suffix}`;
  }

  /**
   * Checks if an OAuth token has passed its expiration window.
   */
  isTokenExpired(tokenExpiry?: string | null): boolean {
    if (!tokenExpiry) return false;
    const expiryTime = new Date(tokenExpiry).getTime();
    if (isNaN(expiryTime)) return false;
    return Date.now() >= expiryTime;
  }

  /**
   * Calculates time remaining until token expiration.
   */
  getTimeToExpiry(tokenExpiry?: string | null): TokenExpiryInfo {
    if (!tokenExpiry) {
      return {
        days: 999,
        hours: 0,
        isExpired: false,
        formatted: 'No Expiry',
      };
    }

    const expiryTime = new Date(tokenExpiry).getTime();
    if (isNaN(expiryTime)) {
      return { days: 0, hours: 0, isExpired: true, formatted: 'Invalid Expiry Date' };
    }

    const diffMs = expiryTime - Date.now();
    if (diffMs <= 0) {
      return { days: 0, hours: 0, isExpired: true, formatted: 'Expired' };
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    let formatted = '';
    if (days > 0) {
      formatted = `${days}d ${hours}h remaining`;
    } else {
      formatted = `${hours}h remaining`;
    }

    return {
      days,
      hours,
      isExpired: false,
      formatted,
    };
  }

  /**
   * Validates token string structure and basic presence
   */
  validateTokenFormat(token?: string | null): boolean {
    if (!token) return false;
    const trimmed = token.trim();
    return trimmed.length >= 10 && !trimmed.includes(' ');
  }

  /**
   * Prepares payload for token refresh request
   */
  prepareRefreshTokenPayload(refreshToken: string, platform: string) {
    if (!refreshToken) {
      throw new Error(`Cannot prepare refresh payload for ${platform}: Missing refresh token.`);
    }

    return {
      platform,
      refreshToken,
      grantType: 'refresh_token',
      requestedAt: new Date().toISOString(),
    };
  }
}

export const tokenService = new TokenService();
