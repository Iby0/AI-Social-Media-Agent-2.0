import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserSession,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  PasswordResetPayload,
  OAuthProvider,
  AuthError,
} from '../types/auth';
import { authService } from '../services/authService';
import { isSessionExpired } from '../auth/authUtilities';

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; resetCode: string }>;
  resetPassword: (payload: PasswordResetPayload) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Session Restore & Heartbeat Check
  const restoreSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const restored = await authService.restoreSession();
      if (restored) {
        setState({
          user: restored.user,
          session: restored.session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch {
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Session Expiration Monitoring Timer
  useEffect(() => {
    if (!state.session || !state.isAuthenticated) return;

    const interval = setInterval(() => {
      if (isSessionExpired(state.session)) {
        logout();
      }
    }, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, [state.session, state.isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user, session } = await authService.login(credentials);
      setState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: authErr.message ? authErr : { code: 'UNKNOWN_ERROR', message: 'Failed to authenticate.' },
      }));
      throw authErr;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user, session } = await authService.register(credentials);
      setState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: authErr.message ? authErr : { code: 'UNKNOWN_ERROR', message: 'Registration failed.' },
      }));
      throw authErr;
    }
  };

  const loginWithOAuth = async (provider: OAuthProvider) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { user, session } = await authService.loginWithOAuth(provider);
      setState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: authErr.message ? authErr : { code: 'OAUTH_FAILED', message: 'OAuth Authentication failed.' },
      }));
      throw authErr;
    }
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const requestPasswordReset = async (email: string) => {
    clearError();
    try {
      return await authService.requestPasswordReset(email);
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({ ...prev, error: authErr }));
      throw authErr;
    }
  };

  const resetPassword = async (payload: PasswordResetPayload) => {
    clearError();
    try {
      return await authService.resetPassword(payload);
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({ ...prev, error: authErr }));
      throw authErr;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) return;
    try {
      const updatedUser = await authService.updateProfile(state.user.id, updates);
      setState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (err) {
      const authErr = err as AuthError;
      setState((prev) => ({ ...prev, error: authErr }));
      throw authErr;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithOAuth,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
