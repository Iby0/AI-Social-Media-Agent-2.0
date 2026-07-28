import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { verifyRouteAccess } from './authMiddleware';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToLogin?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onRedirectToLogin }) => {
  const { user, session, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Verifying session credentials...</p>
      </div>
    );
  }

  const access = verifyRouteAccess(user, session, true);

  if (!access.isAllowed || !isAuthenticated) {
    return (
      <div className="p-8 sm:p-12 max-w-lg mx-auto text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl my-8">
        <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-flex">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Authentication Required</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            You must be logged in to access the AI Social Media Agent workspace features.
          </p>
        </div>

        {onRedirectToLogin && (
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={onRedirectToLogin}>
              Sign In / Register Account
            </Button>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
