import { User, UserSession } from '../types/auth';
import { isSessionExpired } from '../auth/authUtilities';

export interface RouteProtectionResult {
  isAllowed: boolean;
  reason?: 'UNAUTHENTICATED' | 'SESSION_EXPIRED' | 'INSUFFICIENT_PERMISSIONS';
  redirectTo?: string;
}

/**
 * Checks if current user and session are valid for route access.
 */
export function verifyRouteAccess(
  user: User | null,
  session: UserSession | null,
  isProtected: boolean = true
): RouteProtectionResult {
  if (!isProtected) {
    return { isAllowed: true };
  }

  if (!user || !session) {
    return {
      isAllowed: false,
      reason: 'UNAUTHENTICATED',
      redirectTo: 'login',
    };
  }

  if (isSessionExpired(session)) {
    return {
      isAllowed: false,
      reason: 'SESSION_EXPIRED',
      redirectTo: 'login',
    };
  }

  return { isAllowed: true };
}
