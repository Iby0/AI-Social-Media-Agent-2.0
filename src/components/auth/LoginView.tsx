import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Alert } from '../ui/Alert';
import { OAuthProvider } from '../../types/auth';

export interface LoginViewProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onSuccess,
}) => {
  const { login, loginWithOAuth, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, rememberMe });
      onSuccess?.();
    } catch {
      // Error handled by AuthContext state
    }
  };

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    try {
      await loginWithOAuth(provider);
      onSuccess?.();
    } catch {
      // Error handled by AuthContext state
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    clearError();
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 my-6">
      {/* View Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/20 mb-1">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-xs text-slate-400">
          Sign in to your AI Social Media Agent workspace
        </p>
      </div>

      {/* Quick Demo Credentials Autofill Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Quick Demo Accounts (1-Click Fill)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('demo@aisocial.ai', 'password123')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors text-left cursor-pointer"
          >
            <p className="font-semibold text-white">Sarah Connor</p>
            <p className="text-[10px] text-slate-500 truncate">demo@aisocial.ai</p>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('creator@aisocial.ai', 'creator123')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors text-left cursor-pointer"
          >
            <p className="font-semibold text-white">Marcus Vance</p>
            <p className="text-[10px] text-slate-500 truncate">creator@aisocial.ai</p>
          </button>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <Alert type="error" onClose={clearError}>
          {error.message}
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. sarah@company.com"
          value={email}
          onChange={(e) => {
            clearError();
            setEmail(e.target.value);
          }}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            clearError();
            setPassword(e.target.value);
          }}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label="Remember me for 30 days"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <button
            type="button"
            onClick={onNavigateToForgotPassword}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
          rightIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In to Workspace
        </Button>
      </form>

      {/* OAuth Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          Or Continue With
        </span>
        <div className="border-t border-slate-800 w-full" />
      </div>

      {/* OAuth Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Switch to Register */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </p>
      </div>
    </div>
  );
};
