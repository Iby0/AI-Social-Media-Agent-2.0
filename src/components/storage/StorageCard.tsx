import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StorageBreakdown } from '../../storage/types';
import { HardDrive, Database, Image as ImageIcon, Layers, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface StorageCardProps {
  breakdown: StorageBreakdown | null;
  onRefresh?: () => void;
}

export const StorageCard: React.FC<StorageCardProps> = ({ breakdown, onRefresh }) => {
  if (!breakdown) {
    return (
      <Card variant="default" className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 text-xs text-slate-400">
          Calculating storage breakdown metrics...
        </CardContent>
      </Card>
    );
  }

  const { formatted, isWarning, isCritical, usagePercentage } = breakdown;

  const storageCategories = [
    {
      title: 'Media Assets',
      size: formatted.mediaSize,
      icon: <ImageIcon className="h-4 w-4 text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      description: 'Uploaded, generated, and post image attachments',
    },
    {
      title: 'IndexedDB Data',
      size: formatted.databaseSize,
      icon: <Database className="h-4 w-4 text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      description: 'Posts, accounts, schedules, settings & activity logs',
    },
    {
      title: 'Cache & Local Storage',
      size: formatted.cacheSize,
      icon: <Layers className="h-4 w-4 text-amber-400" />,
      color: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      description: 'Browser session cache & transient draft states',
    },
    {
      title: 'Temporary Files',
      size: formatted.tempSize,
      icon: <Clock className="h-4 w-4 text-rose-400" />,
      color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      description: 'Expired temporary previews and draft buffers',
    },
  ];

  return (
    <Card variant="default" className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white">Storage Overview</CardTitle>
            <p className="text-xs text-slate-400">Local quota allocation and storage breakdown</p>
          </div>
        </div>

        <Badge variant={isCritical ? 'danger' : isWarning ? 'warning' : 'success'}>
          {isCritical ? 'Storage Critical' : isWarning ? 'Warning (>80%)' : 'Healthy'}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Main Quota Usage Stat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Storage Used</span>
            <span className="text-xl font-bold text-white mt-1 block">{formatted.totalUsed}</span>
            <span className="text-[11px] text-slate-500">{usagePercentage}% of total limit</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Available Space</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">{formatted.available}</span>
            <span className="text-[11px] text-slate-500">Free space available</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Max Allocated Quota</span>
            <span className="text-xl font-bold text-indigo-400 mt-1 block">{formatted.quota}</span>
            <span className="text-[11px] text-slate-500">IndexedDB & Storage limit</span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {storageCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
            >
              <div className={`p-2.5 rounded-xl border ${cat.color} shrink-0`}>
                {cat.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{cat.title}</h4>
                  <span className="text-xs font-extrabold text-slate-200">{cat.size}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
