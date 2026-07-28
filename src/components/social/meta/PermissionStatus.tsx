import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { MetaPermissionService } from '../../../services/social/meta/permission.service';

interface PermissionStatusProps {
  grantedScopes: string[];
  requiredScopes: string[];
  platformName?: string;
}

export const PermissionStatus: React.FC<PermissionStatusProps> = ({
  grantedScopes,
  requiredScopes,
  platformName = 'Meta Platform',
}) => {
  const result = MetaPermissionService.evaluatePermissions(grantedScopes, requiredScopes);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          {result.hasAllRequired ? (
            <ShieldCheck size={16} className="text-emerald-400" />
          ) : (
            <ShieldAlert size={16} className="text-amber-400" />
          )}
          <span className="font-bold text-slate-200">
            {platformName} OAuth Permissions Evaluation
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            result.hasAllRequired
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
          }`}
        >
          {result.hasAllRequired ? 'All Required Scopes Granted' : 'Missing Scopes'}
        </span>
      </div>

      {/* Granted Scopes */}
      <div>
        <span className="text-slate-400 font-semibold block mb-1.5 text-[11px]">
          Granted Permissions ({result.grantedPermissions.length})
        </span>
        <div className="space-y-1.5">
          {result.grantedPermissions.map((perm) => (
            <div
              key={perm.scope}
              className="p-2 bg-slate-900 border border-slate-800/80 rounded-lg flex items-start gap-2 text-slate-300"
            >
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <span>{perm.name}</span>
                  <code className="text-[10px] font-mono text-indigo-300">({perm.scope})</code>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{perm.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Scopes if any */}
      {result.missingPermissions.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-amber-400 font-semibold block mb-1.5 text-[11px]">
            Missing Permissions ({result.missingPermissions.length})
          </span>
          <div className="space-y-1.5">
            {result.missingPermissions.map((perm) => (
              <div
                key={perm.scope}
                className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-amber-200"
              >
                <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <span>{perm.name}</span>
                    <code className="text-[10px] font-mono text-amber-300">({perm.scope})</code>
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-0.5">{perm.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
