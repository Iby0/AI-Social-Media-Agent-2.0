import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Sparkles,
  Image,
  Bot,
  Share2,
  AlertTriangle,
} from 'lucide-react';

export const OverviewCards: React.FC = () => {
  const { overview } = useAnalytics();

  const cards = [
    {
      label: 'Total Posts',
      value: overview.totalPosts,
      icon: FileText,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      subtitle: 'Created across channels',
    },
    {
      label: 'Published Posts',
      value: overview.publishedPosts,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      subtitle: 'Dispatched via Official APIs',
    },
    {
      label: 'Draft Posts',
      value: overview.draftPosts,
      icon: FileEdit,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      subtitle: 'In Content Studio queue',
    },
    {
      label: 'AI Requests',
      value: overview.aiRequests,
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      subtitle: 'Gemini 2.5 Flash invocations',
    },
    {
      label: 'Images Generated',
      value: overview.imagesGenerated,
      icon: Image,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      subtitle: 'Visual prompts processed',
    },
    {
      label: 'Automation Runs',
      value: overview.automationRuns,
      icon: Bot,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
      subtitle: 'Autonomous cycles executed',
    },
    {
      label: 'Connected Accounts',
      value: overview.connectedAccounts,
      icon: Share2,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      subtitle: 'Active social channels',
    },
    {
      label: 'Errors Today',
      value: overview.errorsToday,
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      subtitle: 'Logged system exceptions',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{c.label}</span>
              <div className={`p-2 rounded-xl border ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{c.value}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{c.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
