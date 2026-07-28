export type OAuthProvider = 'google' | 'github' | 'email';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTone: string;
  autoSaveDrafts: boolean;
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: OAuthProvider;
  createdAt: string; // ISO date
  lastLoginAt: string; // ISO date
  preferences: UserPreferences;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string; // ISO date
  createdAt: string; // ISO date
  userAgent?: string;
  isRemembered: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface AuthState {
  user: User | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  acceptTerms?: boolean;
}

export interface PasswordResetPayload {
  email: string;
  code?: string;
  newPassword?: string;
}
