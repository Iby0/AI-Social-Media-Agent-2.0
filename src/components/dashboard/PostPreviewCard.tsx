import React from 'react';
import { Post } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, Calendar, ArrowRight, FileText, Sparkles } from 'lucide-react';

export interface PostPreviewCardProps {
  posts: Post[];
  onOpenScheduler: () => void;
  onOpenStudio: () => void;
  maxItems?: number;
}

export const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  posts,
  onOpenScheduler,
  onOpenStudio,
  maxItems = 3,
}) => {
  const upcomingPosts = posts
    .filter((p) => p.status === 'scheduled' || p.status === 'draft')
    .slice(0, maxItems);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>Upcoming Queue Preview</span>
          </h3>
          <p className="text-xs text-slate-400">Scheduled posts ready for publishing</p>
        </div>

        <Button variant="ghost" size="xs" onClick={onOpenScheduler} rightIcon={<ArrowRight className="h-3 w-3" />}>
          Calendar View
        </Button>
      </div>

      <div className="space-y-3">
        {upcomingPosts.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
            <p className="text-xs text-slate-400">No scheduled or draft posts in the queue.</p>
            <Button variant="primary" size="xs" onClick={onOpenStudio} leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
              Create New AI Post
            </Button>
          </div>
        ) : (
          upcomingPosts.map((post) => (
            <div
              key={post.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{post.content}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Badge
                  variant={post.status === 'scheduled' ? 'info' : 'warning'}
                  className="capitalize text-[10px]"
                >
                  {post.status}
                </Badge>

                {post.scheduledAt && (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                    <Calendar className="h-3 w-3 text-indigo-400" />
                    {new Date(post.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
