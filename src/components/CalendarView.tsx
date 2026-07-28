import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Grid,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Filter
} from 'lucide-react';
import { Post, SocialPlatform, PostStatus } from '../types';

interface CalendarViewProps {
  posts: Post[];
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
  onDeletePost: (postId: string) => void;
  onLogActivity: (action: string, category: 'post', details: string, status?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onUpdatePostStatus,
  onDeletePost,
  onLogActivity,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    const matchesPlatform =
      selectedPlatform === 'all' || post.selectedPlatforms.includes(selectedPlatform as SocialPlatform);
    return matchesStatus && matchesPlatform;
  });

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Clock className="h-3 w-3 animate-spin" /> Scheduled
          </span>
        );
      case 'draft':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
    }
  };

  const renderPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-3.5 w-3.5 text-blue-400" key={platform} />;
      case 'instagram':
        return <Instagram className="h-3.5 w-3.5 text-pink-400" key={platform} />;
      case 'linkedin':
        return <Linkedin className="h-3.5 w-3.5 text-sky-400" key={platform} />;
      case 'github':
        return <Github className="h-3.5 w-3.5 text-slate-300" key={platform} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-400" />
            Content Planner & Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage upcoming queues, drafts, and published content across all social accounts.
          </p>
        </div>

        {/* View Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-transparent text-xs text-white outline-none cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
            </select>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts Content */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <CalendarIcon className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No posts found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your filters or use the AI Content Studio to create and schedule new posts.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 sm:p-5 hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-2xl">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-14 w-14 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <CalendarIcon className="h-6 w-6 text-indigo-400" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white leading-tight">{post.title}</h4>
                    {getStatusBadge(post.status)}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {post.captions.linkedin || post.captions.facebook || post.captions.instagram || post.captions.github || post.topic}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      Platforms: {post.selectedPlatforms.map(renderPlatformIcon)}
                    </span>
                    <span>•</span>
                    <span>
                      {post.scheduledAt
                        ? `Scheduled for ${new Date(post.scheduledAt).toLocaleString()}`
                        : post.publishedAt
                        ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                        : `Created ${new Date(post.createdAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {post.status !== 'published' && (
                  <button
                    onClick={() => {
                      onUpdatePostStatus(post.id, 'published');
                      onLogActivity('Post Published', 'post', `Post "${post.title}" manually published.`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="h-3 w-3" /> Publish Now
                  </button>
                )}

                <button
                  onClick={() => {
                    onDeletePost(post.id);
                    onLogActivity('Post Deleted', 'post', `Post "${post.title}" deleted.`, 'info');
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all cursor-pointer"
                  title="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getStatusBadge(post.status)}
                  <div className="flex items-center gap-1">{post.selectedPlatforms.map(renderPlatformIcon)}</div>
                </div>

                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden aspect-video bg-slate-950 border border-slate-800">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <h4 className="text-sm font-bold text-white">{post.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {post.captions.linkedin || post.captions.facebook || post.captions.instagram || post.topic}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
