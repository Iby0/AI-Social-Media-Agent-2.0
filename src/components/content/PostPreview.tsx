import React, { useState } from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Heart,
  MessageCircle,
  Share2,
  Repeat2,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Globe,
  Sparkles,
  Send,
} from 'lucide-react';
import { PostRecord } from '../../database/types';
import { formatHashtagString } from '../../services/content/content.utils';

interface PostPreviewProps {
  post: Partial<PostRecord>;
  activePlatform?: string;
  onPlatformChange?: (platform: string) => void;
  className?: string;
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  post,
  activePlatform: externalPlatform,
  onPlatformChange,
  className = '',
}) => {
  const [internalPlatform, setInternalPlatform] = useState<string>('facebook');
  const platform = (externalPlatform || internalPlatform).toLowerCase();

  const handleSelectPlatform = (p: string) => {
    if (onPlatformChange) {
      onPlatformChange(p);
    } else {
      setInternalPlatform(p);
    }
  };

  const title = post.title || 'Untitled Post';
  const caption = post.caption || 'Write your caption to see preview here...';
  const hashtags = formatHashtagString(post.hashtags || []);
  const imageUrl = post.image;
  const category = post.category || 'Technology';

  return (
    <div
      id="post-preview-container"
      className={`bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col ${className}`}
    >
      {/* Platform Switcher Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Live Platform Preview
          </span>
        </div>

        <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => handleSelectPlatform('facebook')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              platform === 'facebook'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Facebook size={14} />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPlatform('instagram')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              platform === 'instagram'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Instagram size={14} />
            <span>Instagram</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPlatform('linkedin')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              platform === 'linkedin'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Linkedin size={14} />
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPlatform('twitter')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              platform === 'twitter' || platform === 'x'
                ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Twitter size={14} />
            <span>Twitter / X</span>
          </button>
        </div>
      </div>

      {/* Preview Card Canvas */}
      <div className="p-4 md:p-6 bg-slate-950/60 flex items-center justify-center min-h-[360px]">
        {/* FACEBOOK PREVIEW */}
        {platform === 'facebook' && (
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-100 shadow-lg space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow">
                  AI
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-1">
                    AI Social Brand
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded">
                      Page
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    Just now · <Globe size={11} />
                  </p>
                </div>
              </div>
              <MoreHorizontal size={18} className="text-slate-400" />
            </div>

            {/* Post Title & Text */}
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-slate-200">{title}</p>
              <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{caption}</p>
              {hashtags && <p className="text-blue-400 font-medium text-xs pt-1">{hashtags}</p>}
            </div>

            {/* Media Image */}
            {imageUrl ? (
              <div className="rounded-md overflow-hidden bg-slate-950 border border-slate-800 max-h-80 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto object-cover max-h-80"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="h-24 rounded-md bg-slate-800/40 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-xs">
                <span>No media attached</span>
                <span className="text-[10px] text-slate-600">Category: {category}</span>
              </div>
            )}

            {/* Mock Engagements */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1 text-blue-400">
                <ThumbsUp size={13} />
                <span>124 Likes</span>
              </div>
              <div className="flex items-center gap-3">
                <span>18 Comments</span>
                <span>5 Shares</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800 text-xs font-medium text-slate-400">
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1.5 hover:bg-slate-800"
              >
                <ThumbsUp size={14} /> Like
              </button>
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1.5 hover:bg-slate-800"
              >
                <MessageCircle size={14} /> Comment
              </button>
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1.5 hover:bg-slate-800"
              >
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        )}

        {/* INSTAGRAM PREVIEW */}
        {platform === 'instagram' && (
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100 shadow-xl">
            {/* Header */}
            <div className="px-3 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
                    IG
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-100 leading-tight">
                    aisocial.brand
                  </h4>
                  <span className="text-[10px] text-slate-400">{category}</span>
                </div>
              </div>
              <MoreHorizontal size={16} className="text-slate-400" />
            </div>

            {/* Square Media Image */}
            <div className="aspect-square bg-slate-950 flex items-center justify-center border-b border-slate-800">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                  <Instagram size={36} className="text-slate-700 mb-2" />
                  <span className="text-xs font-medium">Instagram visual feed</span>
                  <span className="text-[10px] text-slate-600 mt-1">
                    Image attachment recommended
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-300">
                  <Heart size={20} className="hover:text-rose-500 transition-colors" />
                  <MessageCircle size={20} className="hover:text-blue-400 transition-colors" />
                  <Send size={18} className="hover:text-emerald-400 transition-colors" />
                </div>
                <Bookmark size={20} className="text-slate-400 hover:text-white" />
              </div>

              <div className="text-xs font-semibold text-slate-200">289 likes</div>

              {/* Caption */}
              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <span className="font-bold text-slate-100 mr-1.5">aisocial.brand</span>
                  {title}
                </p>
                <p className="text-slate-300 whitespace-pre-wrap">{caption}</p>
                {hashtags && <p className="text-purple-400 font-medium pt-1">{hashtags}</p>}
              </div>

              <div className="text-[10px] text-slate-500 uppercase tracking-wide pt-1">
                2 hours ago
              </div>
            </div>
          </div>
        )}

        {/* LINKEDIN PREVIEW */}
        {platform === 'linkedin' && (
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-100 shadow-lg space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-blue-700 flex items-center justify-center font-bold text-white">
                  in
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-100">
                    AI Agent Enterprise Solutions
                  </h4>
                  <p className="text-xs text-slate-400">12,400 followers · 1h · Edited</p>
                </div>
              </div>
              <MoreHorizontal size={18} className="text-slate-400" />
            </div>

            {/* Post Content */}
            <div className="space-y-2 text-sm leading-relaxed text-slate-200">
              <h5 className="font-semibold text-slate-100">{title}</h5>
              <p className="whitespace-pre-wrap text-slate-300">{caption}</p>
              {hashtags && <p className="text-blue-400 font-medium text-xs">{hashtags}</p>}
            </div>

            {/* Media Image */}
            {imageUrl && (
              <div className="rounded border border-slate-800 overflow-hidden max-h-72">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto object-cover max-h-72"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Engagements */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>💡👏 84 reactions</span>
              <span>14 comments · 3 reposts</span>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-800 text-xs font-semibold text-slate-400">
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <ThumbsUp size={14} /> Like
              </button>
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <MessageCircle size={14} /> Comment
              </button>
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <Repeat2 size={14} /> Repost
              </button>
              <button
                type="button"
                className="py-1.5 rounded flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        )}

        {/* TWITTER / X PREVIEW */}
        {(platform === 'twitter' || platform === 'x') && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-lg space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0">
                X
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-hidden text-xs">
                    <span className="font-bold text-slate-100 truncate">AI Agent</span>
                    <span className="text-slate-400 truncate">@ai_agent_app</span>
                    <span className="text-slate-500">· 12m</span>
                  </div>
                  <MoreHorizontal size={16} className="text-slate-400 shrink-0" />
                </div>

                <p className="font-medium text-xs text-slate-200">{title}</p>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {caption}
                </p>
                {hashtags && <p className="text-sky-400 font-medium text-xs">{hashtags}</p>}

                {imageUrl && (
                  <div className="mt-2 rounded-2xl overflow-hidden border border-slate-800 max-h-64">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-auto object-cover max-h-64"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Tweet Action Icons */}
                <div className="flex items-center justify-between text-slate-400 text-xs pt-3 max-w-sm">
                  <span className="flex items-center gap-1 hover:text-sky-400 transition-colors cursor-pointer">
                    <MessageCircle size={14} /> 12
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer">
                    <Repeat2 size={14} /> 5
                  </span>
                  <span className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer">
                    <Heart size={14} /> 48
                  </span>
                  <span className="flex items-center gap-1 hover:text-sky-400 transition-colors cursor-pointer">
                    <Share2 size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
