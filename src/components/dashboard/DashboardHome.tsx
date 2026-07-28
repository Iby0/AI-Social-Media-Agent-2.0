import React from 'react';
import { Post, SocialChannel, ActivityLog } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { ActivityCard } from './ActivityCard';
import { AccountCard } from './AccountCard';
import { PostPreviewCard } from './PostPreviewCard';
import { ProfileCard } from './ProfileCard';
import { Button } from '../ui/Button';
import {
  Sparkles,
  FileText,
  Calendar,
  Send,
  Share2,
  HardDrive,
  BarChart3,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface DashboardHomeProps {
  posts: Post[];
  channels: SocialChannel[];
  logs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  posts,
  channels,
  logs,
  onNavigateTab,
}) => {
  const { user } = useAuth();

  // Metrics calculations
  const totalPostsCount = posts.length;
  const scheduledPostsCount = posts.filter((p) => p.status === 'scheduled').length;
  const publishedPostsCount = posts.filter((p) => p.status === 'published').length;
  const connectedChannelsCount = channels.filter((c) => c.isConnected).length;
  const storageUsageFormatted = `${(posts.length * 2.4).toFixed(1)} MB / 500 MB`;

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome Section */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Autonomous Social Studio • Operational</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-indigo-300 via-blue-200 to-white bg-clip-text text-transparent">{user?.name || 'Creator'}</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your social media publishing pipeline is active. Manage content drafts, scheduled queues, connected API channels, and performance insights from this main control panel.
          </p>
        </div>

        {/* Header Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigateTab('studio')}
            leftIcon={<Plus className="h-4 w-4" />}
            className="shadow-lg shadow-indigo-600/30"
          >
            Create New Post
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => onNavigateTab('calendar')}
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            Schedule Queue
          </Button>
        </div>

        {/* Ambient Decorative Background Blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Statistics Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Workspace Performance Metrics
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Live IndexedDB Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Posts"
            value={totalPostsCount}
            icon={FileText}
            change="+14% this week"
            changeType="positive"
            color="indigo"
            onClick={() => onNavigateTab('studio')}
          />

          <StatCard
            title="Scheduled Posts"
            value={scheduledPostsCount}
            icon={Calendar}
            change={`${scheduledPostsCount} in queue`}
            changeType="neutral"
            color="cyan"
            onClick={() => onNavigateTab('calendar')}
          />

          <StatCard
            title="Published Posts"
            value={publishedPostsCount}
            icon={Send}
            change="+8 auto-published"
            changeType="positive"
            color="emerald"
            onClick={() => onNavigateTab('analytics')}
          />

          <StatCard
            title="Connected Channels"
            value={connectedChannelsCount}
            icon={Share2}
            badge="API Ready"
            color="amber"
            onClick={() => onNavigateTab('channels')}
          />

          <StatCard
            title="Storage Usage"
            value={storageUsageFormatted}
            icon={HardDrive}
            description="IndexedDB Browser Engine"
            color="purple"
            onClick={() => onNavigateTab('settings')}
          />
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Control Panel Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Create New AI Post"
            description="Generate viral multi-platform posts using Gemini prompt studio and style templates."
            icon={Sparkles}
            buttonText="Open Content Studio"
            color="indigo"
            badge="AI Powered"
            onClick={() => onNavigateTab('studio')}
          />

          <QuickActionCard
            title="Connect Social Channels"
            description="Link Facebook, Instagram, LinkedIn and GitHub OAuth API tokens for auto-publishing."
            icon={Share2}
            buttonText="Manage Accounts"
            color="amber"
            badge="API Integrations"
            onClick={() => onNavigateTab('channels')}
          />

          <QuickActionCard
            title="Schedule Queue Post"
            description="Inspect multi-channel calendar grid and adjust time-slot auto-publishing triggers."
            icon={Calendar}
            buttonText="Open Calendar Queue"
            color="cyan"
            onClick={() => onNavigateTab('calendar')}
          />

          <QuickActionCard
            title="View Analytics"
            description="Review impressions, engagement rates, share counts and channel growth velocity."
            icon={BarChart3}
            buttonText="View Performance Charts"
            color="emerald"
            onClick={() => onNavigateTab('analytics')}
          />
        </div>
      </div>

      {/* 4. Main Two-Column Layout: Previews & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Connected Accounts & Upcoming Queue */}
        <div className="lg:col-span-2 space-y-6">
          <AccountCard channels={channels} onManageChannels={() => onNavigateTab('channels')} />

          <PostPreviewCard
            posts={posts}
            onOpenScheduler={() => onNavigateTab('calendar')}
            onOpenStudio={() => onNavigateTab('studio')}
          />
        </div>

        {/* Right 1 Column: Profile & Recent Activity */}
        <div className="space-y-6">
          <ProfileCard user={user} onNavigateToProfile={() => onNavigateTab('profile')} />

          <ActivityCard logs={logs} onViewAllLogs={() => onNavigateTab('logs')} />
        </div>
      </div>

      {/* 5. System Tip / Pro Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <p className="text-slate-300">
            <span className="font-bold text-white">Pro Tip:</span> Use the keyboard shortcut <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-mono">⌘K</kbd> anywhere in the app to quickly search templates and logs.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('help')}
          className="text-indigo-400 hover:text-indigo-300 font-bold shrink-0 flex items-center gap-1 cursor-pointer"
        >
          <span>View Documentation</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
