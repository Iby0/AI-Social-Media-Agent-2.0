import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  ThumbsUp,
  Share2,
  MousePointer,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';
import { AnalyticsMetric, Post, SocialPlatform } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsMetric[];
  posts: Post[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, posts }) => {
  const publishedPosts = posts.filter((p) => p.status === 'published');

  // Compute total aggregates
  const totalImpressions = analytics.reduce((acc, cur) => acc + cur.impressions, 0);
  const totalLikes = analytics.reduce((acc, cur) => acc + cur.likes, 0);
  const totalShares = analytics.reduce((acc, cur) => acc + cur.shares, 0);
  const totalComments = analytics.reduce((acc, cur) => acc + cur.comments, 0);
  const totalEngagement = totalLikes + totalShares + totalComments;
  const engagementRate = totalImpressions > 0 ? ((totalEngagement / totalImpressions) * 100).toFixed(1) : '0.0';

  // Platform performance breakdown
  const platformStats: Record<SocialPlatform, { impressions: number; engagement: number }> = {
    facebook: { impressions: 0, engagement: 0 },
    instagram: { impressions: 0, engagement: 0 },
    linkedin: { impressions: 0, engagement: 0 },
    github: { impressions: 0, engagement: 0 },
  };

  analytics.forEach((item) => {
    if (platformStats[item.platform]) {
      platformStats[item.platform].impressions += item.impressions;
      platformStats[item.platform].engagement += item.engagement;
    }
  });

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-400" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-sky-400" />;
      case 'github':
        return <Github className="h-4 w-4 text-slate-200" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Social Analytics & Audience Insights
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross-platform metrics, engagement rates, and channel performance breakdown.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span>+24.8% Audience Growth This Month</span>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Impressions</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{totalImpressions.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ 18.2% vs previous period</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Engagement Rate</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{engagementRate}%</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ 3.4% industry benchmark</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Likes & Reactions</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <ThumbsUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{totalLikes.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ 12.5% increase</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Reshares & Reposts</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Share2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white">{totalShares.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 font-medium">↑ 22.1% viral coefficient</span>
        </div>
      </div>

      {/* Platform Comparison & Best Times */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platform Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Channel Impression Distribution</span>
            <span className="text-xs text-slate-400 font-normal">Last 30 Days</span>
          </h3>

          <div className="space-y-4 pt-2">
            {(['instagram', 'linkedin', 'facebook', 'github'] as SocialPlatform[]).map((plat) => {
              const impressions = platformStats[plat].impressions;
              const pct = totalImpressions > 0 ? ((impressions / totalImpressions) * 100).toFixed(0) : 0;

              return (
                <div key={plat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-slate-200 capitalize">
                      {getPlatformIcon(plat)} {plat}
                    </span>
                    <span className="text-slate-400">
                      {impressions.toLocaleString()} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        plat === 'facebook'
                          ? 'bg-blue-500'
                          : plat === 'instagram'
                          ? 'bg-gradient-to-r from-pink-500 to-amber-500'
                          : plat === 'linkedin'
                          ? 'bg-sky-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Time to Post Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              AI Best Posting Times
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Optimized for maximum audience activity based on historical engagement patterns.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Linkedin className="h-3.5 w-3.5 text-sky-400" /> LinkedIn
                </span>
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Tue & Thu @ 09:30 AM
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Instagram className="h-3.5 w-3.5 text-pink-400" /> Instagram
                </span>
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Wed & Sun @ 06:00 PM
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Facebook className="h-3.5 w-3.5 text-blue-400" /> Facebook
                </span>
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Mon & Fri @ 01:15 PM
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Github className="h-3.5 w-3.5 text-slate-200" /> GitHub
                </span>
                <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Mon - Wed @ 10:00 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
