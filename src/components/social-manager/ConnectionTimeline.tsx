import React, { useState } from 'react';
import { useSocialAccounts } from './SocialAccountContext';
import { ConnectionHistoryItem } from '../../database/types';
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Filter,
} from 'lucide-react';

export const ConnectionTimeline: React.FC = () => {
  const { connectionHistory } = useSocialAccounts();
  const [filterPlatform, setFilterPlatform] = useState<string>('All');

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-500" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-sky-500" />;
      case 'github':
        return <Github className="h-4 w-4 text-slate-200" />;
      default:
        return <Globe className="h-4 w-4 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: ConnectionHistoryItem['status']) => {
    switch (status) {
      case 'Success':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Success</span>
          </span>
        );
      case 'Warning':
      case 'Error':
        return (
          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'Info':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-blue-400 font-semibold text-[11px]">
            <Info className="h-3.5 w-3.5" />
            <span>Info</span>
          </span>
        );
    }
  };

  const filteredLogs = filterPlatform === 'All'
    ? connectionHistory
    : connectionHistory.filter((l) => l.platform.toLowerCase() === filterPlatform.toLowerCase());

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Connection History Timeline</h3>
        </div>

        {/* Platform filter for logs */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 text-xs text-slate-300">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
            aria-label="Filter timeline by platform"
          >
            <option value="All" className="bg-slate-900">All Platforms</option>
            <option value="facebook" className="bg-slate-900">Facebook</option>
            <option value="instagram" className="bg-slate-900">Instagram</option>
            <option value="linkedin" className="bg-slate-900">LinkedIn</option>
            <option value="github" className="bg-slate-900">GitHub</option>
          </select>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No history records logged for this filter option.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {filteredLogs.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-6 top-1 p-1 rounded-full bg-slate-950 border border-slate-700">
                {getPlatformIcon(item.platform)}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white capitalize">{item.platform}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {item.action}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.time).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{item.result}</p>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  {getStatusBadge(item.status)}
                  <span className="text-slate-500 font-mono text-[10px]">Log ID: {item.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
