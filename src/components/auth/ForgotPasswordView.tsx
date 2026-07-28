import React, { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

export interface ForgotPasswordViewProps {
  onNavigateToLogin: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigateToLogin }) => {
  const { requestPasswordReset, resetPassword, error, clearError } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Request, 2 = Verify Code & New Password, 3 = Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    try {
      const res = await requestPasswordReset(email);
      setGeneratedCode(res.resetCode);
      setStep(2);
    } catch {
      // AuthContext sets error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);

    if (code !== generatedCode) {
      setLocalError('Invalid verification code. Please check code or request new link.');
      setIsSubmitting(false);
      return;
    }

    try {
      await resetPassword({ email, code, newPassword });
      setStep(3);
    } catch {
      // AuthContext sets error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 my-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {step === 1 && 'Reset Password'}
          {step === 2 && 'Verify Code & Set Password'}
          {step === 3 && 'Password Reset Complete'}
        </h2>
        <p className="text-xs text-slate-400">
          {step === 1 && 'Enter your email address to receive password recovery code'}
          {step === 2 && `Verification code sent to ${email}`}
          {step === 3 && 'Your account password has been updated successfully'}
        </p>
      </div>

      {/* Error Alert Display */}
      {(error || localError) && (
        <Alert type="error" onClose={() => { clearError(); setLocalError(null); }}>
          {localError || error?.message}
        </Alert>
      )}

      {/* Step 1: Request Code */}
      {step === 1 && (
        <form onSubmit={handleRequestCode} className="space-y-4">
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

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
            rightIcon={<KeyRound className="h-4 w-4" />}
          >
            Send Verification Code
          </Button>
        </form>
      )}

      {/* Step 2: Enter Code & New Password */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Simulated SMS/Email Code Banner */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-indigo-500/30 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Security Code Generated:</span>
            </div>
            <p className="font-mono text-sm font-bold text-white tracking-widest pl-6">
              {generatedCode}
            </p>
          </div>

          <Input
            label="6-Digit Verification Code"
            type="text"
            placeholder="e.g. 123456"
            value={code}
            onChange={(e) => {
              setLocalError(null);
              setCode(e.target.value);
            }}
            maxLength={6}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => {
              setLocalError(null);
              setNewPassword(e.target.value);
            }}
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
            rightIcon={<RefreshCw className="h-4 w-4" />}
          >
            Update Password
          </Button>
        </form>
      )}

      {/* Step 3: Success Confirmation */}
      {step === 3 && (
        <div className="text-center space-y-4 py-2">
          <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Your password has been changed. You can now log in using your new credentials.
          </p>

          <Button variant="primary" size="lg" onClick={onNavigateToLogin} className="w-full">
            Back to Sign In
          </Button>
        </div>
      )}

      {/* Back to Login Link */}
      {step !== 3 && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Login</span>
          </button>
        </div>
      )}
    </div>
  );
};
