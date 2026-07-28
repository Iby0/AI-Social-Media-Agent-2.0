import {
  User,
  UserSession,
  LoginCredentials,
  RegisterCredentials,
  PasswordResetPayload,
  OAuthProvider,
  AuthError,
} from '../types/auth';
import { validateEmail, evaluatePasswordStrength, generateToken, sanitizeInput } from '../auth/authUtilities';
import { createMockOAuthUser } from './oauthService';

const USERS_STORAGE_KEY = 'ais_social_users_v2';
const SESSIONS_STORAGE_KEY = 'ais_social_sessions_v2';
const CURRENT_SESSION_KEY = 'ais_social_current_session_token';

// Seed Initial Demo Users if storage is empty
const INITIAL_DEMO_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_demo_001',
    name: 'Sarah Connor (Demo)',
    email: 'demo@aisocial.ai',
    passwordHash: 'password123', // In production, use bcrypt/argon2
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    provider: 'email',
    createdAt: new Date('2026-01-15').toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      defaultTone: 'Professional',
      autoSaveDrafts: true,
      emailNotifications: true,
      twoFactorEnabled: false,
    },
  },
  {
    id: 'usr_demo_002',
    name: 'Marcus Vance (Creator)',
    email: 'creator@aisocial.ai',
    passwordHash: 'creator123',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    provider: 'email',
    createdAt: new Date('2026-02-01').toISOString(),
    lastLoginAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      defaultTone: 'Casual & Friendly',
      autoSaveDrafts: true,
      emailNotifications: false,
      twoFactorEnabled: true,
    },
  },
];

class AuthService {
  private getUsers(): (User & { passwordHash?: string })[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_USERS;
    }
  }

  private saveUsers(users: (User & { passwordHash?: string })[]) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  private getSessions(): UserSession[] {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveSessions(sessions: UserSession[]) {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }

  /**
   * Registers a new user.
   */
  async register(credentials: RegisterCredentials): Promise<{ user: User; session: UserSession }> {
    const name = sanitizeInput(credentials.name);
    const email = sanitizeInput(credentials.email).toLowerCase();
    const password = credentials.password || '';

    if (!name) {
      throw { code: 'INVALID_NAME', message: 'Full name is required.', field: 'name' } as AuthError;
    }

    if (!validateEmail(email)) {
      throw { code: 'INVALID_EMAIL', message: 'Please provide a valid email address.', field: 'email' } as AuthError;
    }

    const passwordEval = evaluatePasswordStrength(password);
    if (passwordEval.score < 50) {
      throw {
        code: 'WEAK_PASSWORD',
        message: 'Password is too weak. Please include numbers, uppercase letters and special characters.',
        field: 'password',
      } as AuthError;
    }

    if (!credentials.acceptTerms) {
      throw { code: 'TERMS_NOT_ACCEPTED', message: 'You must accept the terms and conditions.', field: 'terms' } as AuthError;
    }

    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw { code: 'EMAIL_EXISTS', message: 'An account with this email already exists.', field: 'email' } as AuthError;
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      passwordHash: password,
      provider: 'email',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        defaultTone: 'Professional',
        autoSaveDrafts: true,
        emailNotifications: true,
        twoFactorEnabled: false,
      },
    };

    users.push(newUser);
    this.saveUsers(users);

    const session = await this.createSession(newUser.id, true);

    const { passwordHash, ...userClean } = newUser;
    return { user: userClean, session };
  }

  /**
   * Authenticates user via Email & Password.
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; session: UserSession }> {
    const email = sanitizeInput(credentials.email).toLowerCase();
    const password = credentials.password || '';

    if (!validateEmail(email)) {
      throw { code: 'INVALID_EMAIL', message: 'Invalid email address format.', field: 'email' } as AuthError;
    }

    if (!password) {
      throw { code: 'MISSING_PASSWORD', message: 'Password is required.', field: 'password' } as AuthError;
    }

    const users = this.getUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email);

    if (!foundUser) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password combination.' } as AuthError;
    }

    if (foundUser.passwordHash && foundUser.passwordHash !== password) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password combination.' } as AuthError;
    }

    // Update last login
    foundUser.lastLoginAt = new Date().toISOString();
    this.saveUsers(users);

    const session = await this.createSession(foundUser.id, credentials.rememberMe ?? true);

    const { passwordHash, ...userClean } = foundUser;
    return { user: userClean, session };
  }

  /**
   * Authenticates user via OAuth (Google / GitHub).
   */
  async loginWithOAuth(provider: OAuthProvider): Promise<{ user: User; session: UserSession }> {
    const mockUser = createMockOAuthUser(provider);
    const users = this.getUsers();

    let existing = users.find((u) => u.email.toLowerCase() === mockUser.email.toLowerCase());
    if (!existing) {
      users.push(mockUser);
      existing = mockUser;
    } else {
      existing.lastLoginAt = new Date().toISOString();
    }

    this.saveUsers(users);
    const session = await this.createSession(existing.id, true);

    const { passwordHash, ...userClean } = existing;
    return { user: userClean, session };
  }

  /**
   * Creates new active session.
   */
  private async createSession(userId: string, isRemembered: boolean): Promise<UserSession> {
    const durationDays = isRemembered ? 30 : 1;
    const expiresAt = new Date(Date.now() + durationDays * 86400 * 1000).toISOString();

    const session: UserSession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      token: generateToken(userId),
      createdAt: new Date().toISOString(),
      expiresAt,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Applet',
      isRemembered,
    };

    const sessions = this.getSessions().filter((s) => s.userId !== userId || new Date(s.expiresAt) > new Date());
    sessions.push(session);
    this.saveSessions(sessions);

    localStorage.setItem(CURRENT_SESSION_KEY, session.token);
    return session;
  }

  /**
   * Restores active session from token.
   */
  async restoreSession(): Promise<{ user: User; session: UserSession } | null> {
    const token = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!token) return null;

    const sessions = this.getSessions();
    const activeSession = sessions.find((s) => s.token === token);

    if (!activeSession) {
      this.logout();
      return null;
    }

    if (new Date(activeSession.expiresAt).getTime() <= Date.now()) {
      this.logout();
      return null;
    }

    const users = this.getUsers();
    const user = users.find((u) => u.id === activeSession.userId);

    if (!user) {
      this.logout();
      return null;
    }

    const { passwordHash, ...userClean } = user;
    return { user: userClean, session: activeSession };
  }

  /**
   * Logs out current session.
   */
  logout(): void {
    const token = localStorage.getItem(CURRENT_SESSION_KEY);
    if (token) {
      const sessions = this.getSessions().filter((s) => s.token !== token);
      this.saveSessions(sessions);
    }
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }

  /**
   * Requests password reset code for email.
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; resetCode: string }> {
    const cleanEmail = sanitizeInput(email).toLowerCase();
    if (!validateEmail(cleanEmail)) {
      throw { code: 'INVALID_EMAIL', message: 'Please enter a valid email address.', field: 'email' } as AuthError;
    }

    const users = this.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (!exists) {
      throw { code: 'USER_NOT_FOUND', message: 'No account registered with this email address.' } as AuthError;
    }

    // Generate 6-digit code for reset
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    return { success: true, resetCode };
  }

  /**
   * Resets password using verification code.
   */
  async resetPassword(payload: PasswordResetPayload): Promise<boolean> {
    const email = sanitizeInput(payload.email).toLowerCase();
    const newPassword = payload.newPassword || '';

    const passwordEval = evaluatePasswordStrength(newPassword);
    if (passwordEval.score < 50) {
      throw { code: 'WEAK_PASSWORD', message: 'New password does not meet security requirements.' } as AuthError;
    }

    const users = this.getUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email);

    if (userIndex === -1) {
      throw { code: 'USER_NOT_FOUND', message: 'User account not found.' } as AuthError;
    }

    users[userIndex].passwordHash = newPassword;
    this.saveUsers(users);

    return true;
  }

  /**
   * Updates user profile info & preferences.
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      throw { code: 'USER_NOT_FOUND', message: 'User not found.' } as AuthError;
    }

    const existing = users[index];
    const updatedUser = {
      ...existing,
      ...updates,
      preferences: {
        ...existing.preferences,
        ...(updates.preferences || {}),
      },
    };

    users[index] = updatedUser;
    this.saveUsers(users);

    const { passwordHash, ...userClean } = updatedUser;
    return userClean;
  }
}

export const authService = new AuthService();
