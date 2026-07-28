import React from 'react';
import {
  FileText,
  Edit3,
  Eye,
  Copy,
  Trash2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Calendar,
  Image as ImageIcon,
  Tag,
  Globe,
  MoreVertical,
} from 'lucide-react';
import { PostRecord, ContentPostStatus } from '../../database/types';
import { StatusBadge } from './StatusBadge';
import { formatHashtagString } from '../../services/content/content.utils';

interface PostCardProps {
  post: PostRecord;
  onEdit: (post: PostRecord) => void;
  onPreview: (post: PostRecord) => void;
  onDuplicate: (post: PostRecord) => void;
  onDelete: (post: PostRecord) => void;
  onStatusChange?: (post: PostRecord, newStatus: ContentPostStatus) => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onStatusChange,
  className = '',
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook size={14} className="text-blue-500" />;
      case 'instagram':
        return <Instagram size={14} className="text-pink-500" />;
      case 'linkedin':
        return <Linkedin size={14} className="text-blue-400" />;
      case 'twitter':
      case 'x':
        return <Twitter size={14} className="text-slate-200" />;
      default:
        return <Globe size={14} className="text-indigo-400" />;
    }
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const hashtagsText = formatHashtagString(post.hashtags || []);

  return (
    <div
      id={`post-card-${post.id}`}
      className={`bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between relative group ${className}`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={post.status} size="sm" />

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              {getPlatformIcon(post.platform)}
              <span className="capitalize">{post.platform === 'all' ? 'All Platforms' : post.platform}</span>
            </span>

            {post.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                <Tag size={10} />
                {post.category}
              </span>
            )}
          </div>

          {/* Context Action Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
              title="More actions"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-40 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-30"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(post);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Edit3 size={13} /> Edit Content
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onPreview(post);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Eye size={13} /> Live Preview
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate(post);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <Copy size={13} /> Duplicate
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(post);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 flex items-center gap-2"
                >
                  <Trash2 size={13} /> Delete Post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Title & Preview */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {post.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
            {post.caption || 'No caption text provided.'}
          </p>

          {hashtagsText && (
            <p className="text-[11px] font-medium text-indigo-400 line-clamp-1">{hashtagsText}</p>
          )}
        </div>

        {/* Image Attachment Preview if present */}
        {post.image ? (
          <div className="mt-3 rounded-lg overflow-hidden border border-slate-800 max-h-36 bg-slate-950">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : post.mediaIds && post.mediaIds.length > 0 ? (
          <div className="mt-3 py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <ImageIcon size={14} className="text-indigo-400" />
            <span>{post.mediaIds.length} media attached</span>
          </div>
        ) : null}
      </div>

      {/* Footer Meta & Quick Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {formattedDate}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPreview(post)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/50 rounded-lg transition-colors"
            title="Preview"
          >
            <Eye size={14} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(post)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
