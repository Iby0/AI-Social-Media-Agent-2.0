import React from 'react';
import { PluginManifest } from '../../types/plugin';
import { PluginPermissions } from './PluginPermissions';
import {
  Bot,
  Image,
  Share2,
  Workflow,
  BarChart3,
  Download,
  Upload,
  Database,
  HardDrive,
  Palette,
  Bell,
  Webhook,
  Power,
  RotateCw,
  Info,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Cpu,
} from 'lucide-react';

interface PluginCardProps {
  plugin: PluginManifest;
  onInstall: (id: string) => void;
  onEnable: (id: string) => void;
  onDisable: (id: string) => void;
  onReload: (id: string) => void;
  onRemove: (id: string) => void;
  onViewDetails: (plugin: PluginManifest) => void;
}

export const PluginCard: React.FC<PluginCardProps> = ({
  plugin,
  onInstall,
  onEnable,
  onDisable,
  onReload,
  onRemove,
  onViewDetails,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai_provider':
        return <Bot className="w-4 h-4 text-indigo-600" />;
      case 'image_provider':
        return <Image className="w-4 h-4 text-emerald-600" />;
      case 'social_platform':
        return <Share2 className="w-4 h-4 text-sky-600" />;
      case 'workflow':
        return <Workflow className="w-4 h-4 text-amber-600" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4 text-violet-600" />;
      case 'export':
        return <Download className="w-4 h-4 text-blue-600" />;
      case 'import':
        return <Upload className="w-4 h-4 text-teal-600" />;
      case 'backup':
        return <Database className="w-4 h-4 text-purple-600" />;
      case 'storage':
        return <HardDrive className="w-4 h-4 text-slate-600" />;
      case 'theme':
        return <Palette className="w-4 h-4 text-pink-600" />;
      case 'notification':
        return <Bell className="w-4 h-4 text-rose-600" />;
      case 'webhook':
        return <Webhook className="w-4 h-4 text-orange-600" />;
      default:
        return <Cpu className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'Enabled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
          </span>
        );
      case 'Disabled':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <Power className="w-3 h-3 text-slate-400" /> Disabled
          </span>
        );
      case 'Installed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
            Installed
          </span>
        );
      case 'Updated':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            Updated
          </span>
        );
      case 'Error':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-500" /> Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Available Local
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
              {getCategoryIcon(plugin.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {plugin.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">v{plugin.version}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">{plugin.name}</h3>
            </div>
          </div>

          <div className="shrink-0">{getStateBadge(plugin.state)}</div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{plugin.description}</p>
      </div>

      {/* Permissions Summary */}
      <div className="pt-2 border-t border-slate-100">
        <PluginPermissions permissions={plugin.permissions} compact />
      </div>

      {/* Error callout if any */}
      {plugin.lastError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] leading-snug font-medium">
          {plugin.lastError}
        </div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(plugin)}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Manifest</span>
        </button>

        <div className="flex items-center gap-1.5">
          {plugin.state === 'Detected' || plugin.state === 'Removed' ? (
            <button
              type="button"
              onClick={() => onInstall(plugin.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all"
            >
              Install Local
            </button>
          ) : (
            <>
              {plugin.enabled ? (
                <>
                  <button
                    type="button"
                    onClick={() => onReload(plugin.id)}
                    title="Reload Sandbox"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDisable(plugin.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
                  >
                    Disable
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onEnable(plugin.id)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  Enable
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemove(plugin.id)}
                title="Remove Plugin"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
