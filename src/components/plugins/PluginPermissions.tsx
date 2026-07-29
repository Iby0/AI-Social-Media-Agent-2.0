import React from 'react';
import { PluginPermission } from '../../types/plugin';
import { PermissionService } from '../../services/plugins/permission.service';
import { Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PluginPermissionsProps {
  permissions: PluginPermission[];
  compact?: boolean;
}

export const PluginPermissions: React.FC<PluginPermissionsProps> = ({
  permissions,
  compact = false,
}) => {
  if (!permissions || permissions.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 italic">
        <Shield className="w-3.5 h-3.5 text-slate-400" />
        <span>No specific system permissions requested.</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {permissions.map((perm) => {
          const meta = PermissionService.getPermissionMeta(perm);
          return (
            <span
              key={perm}
              className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
            >
              <Shield className="w-2.5 h-2.5 text-indigo-500" />
              <span>{meta.label}</span>
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-indigo-600" />
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Requested Security Permissions ({permissions.length})
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {permissions.map((perm) => {
          const meta = PermissionService.getPermissionMeta(perm);
          const isHighRisk = perm === 'write_storage' || perm === 'manage_settings' || perm === 'access_publishing';

          return (
            <div
              key={perm}
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                isHighRisk
                  ? 'bg-amber-50/50 border-amber-200/80 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {isHighRisk ? (
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between font-bold">
                  <span>{meta.label}</span>
                  {isHighRisk && (
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      Sensitive
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{meta.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
