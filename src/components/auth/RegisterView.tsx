import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, UserPlus, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { Alert } from '../ui/Alert';
import { evaluatePasswordStrength } from '../../auth/authUtilities';
import { OAuthProvider } from '../../types/auth';

export interface RegisterViewProps {
  onNavigateToLogin: () => void;
  onSuccess?: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigateToLogin, onSuccess }) => {
  const { register, loginWithOAuth, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  const passwordEval = evaluatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    if (password !== confirmPassword) {
      setCustomError('Passwords do not match. Please re-enter passwords.');
      return;
    }

    try {
      await register({ name, email, password, acceptTerms });
      onSuccess?.();
    } catch {
      // AuthContext handles error state
    }
  };

  const handleOAuthSignup = async (provider: OAuthProvider) => {
    try {
      await loginWithOAuth(provider);
      onSuccess?.();
    } catch {
      // AuthContext handles error state
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 my-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/20 mb-1">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Create AI Studio Account</h2>
        <p className="text-xs text-slate-400">
          Get started with your autonomous social media publishing studio
        </p>
      </div>

      {/* Error Alert Display */}
      {(error || customError) && (
        <Alert type="error" onClose={() => { clearError(); setCustomError(null); }}>
          {customError || error?.message}
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Sarah Connor"
          value={name}
          onChange={(e) => {
            clearError();
            setName(e.target.value);
          }}
          leftIcon={<UserIcon className="h-4 w-4" />}
          required
        />

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

        {/* Real-Time Password Strength Meter */}
        {password.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Password Strength:</span>
              <span
                className={`font-bold ${
                  passwordEval.score >= 75
                    ? 'text-emerald-400'
                    : passwordEval.score >= 50
                    ? 'text-cyan-400'
                    : passwordEval.score >= 25
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {passwordEval.label} ({passwordEval.score}%)
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordEval.score >= 75
                    ? 'bg-emerald-500'
                    : passwordEval.score >= 50
                    ? 'bg-cyan-500'
                    : passwordEval.score >= 25
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${passwordEval.score}%` }}
              />
            </div>

            {passwordEval.feedback.length > 0 && (
              <ul className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                {passwordEval.feedback.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-slate-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Input
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
        />

        <div className="pt-1">
          <Checkbox
            label={
              <span className="text-slate-300">
                I agree to the{' '}
                <span className="text-indigo-400 font-semibold underline">Terms of Service</span> and{' '}
                <span className="text-indigo-400 font-semibold underline">Privacy Policy</span>
              </span>
            }
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
          rightIcon={<UserPlus className="h-4 w-4" />}
        >
          Create Workspace Account
        </Button>
      </form>

      {/* OAuth Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-800 w-full" />
        <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          Or Register With
        </span>
        <div className="border-t border-slate-800 w-full" />
      </div>

      {/* OAuth Sign Up Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthSignup('google')}
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
          onClick={() => handleOAuthSignup('github')}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Switch to Login */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Sign In</span>
          </button>
        </p>
      </div>
    </div>
  );
};
