import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Global ErrorBoundary caught error]:', error, errorInfo);
    (this as any).setState?.({ errorInfo });
  }

  private handleReset = () => {
    (this as any).setState?.({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    const state = ((this as any).state as State) || { hasError: false, error: null };
    const props = (this as any).props as Props;

    if (state.hasError) {
      if (props?.fallback) {
        return props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Something unexpected happened
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An isolated runtime error occurred. Your IndexedDB local storage and post drafts remain secure.
              </p>
            </div>

            {state.error && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-left font-mono text-[11px] text-rose-300 break-words max-h-32 overflow-y-auto">
                {state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-900 bg-white hover:bg-slate-100 shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return props?.children || null;
  }
}
