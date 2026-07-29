import React, { useState } from 'react';
import { usePublishingContext } from '../../context/PublishingContext';
import { PLATFORM_INFO, PlatformSelector } from './PlatformSelector';
import { PublishStatusBadge } from './PublishStatus';
import { PublishPreview } from './PublishPreview';
import { SocialPlatformType, PublishVisibility } from '../../publishers/publisher.types';
import { Send, Plus, Trash2, Calendar, Eye, Sparkles, Layers } from 'lucide-react';

export const PublishQueue: React.FC = () => {
  const { pendingQueue, publishingQueue, publishNow, cancelRequest, isPublishing, addToQueue } =
    usePublishingContext();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewRequest, setPreviewRequest] = useState<any | null>(null);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [platform, setPlatform] = useState<SocialPlatformType>('facebook');
  const [caption, setCaption] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [visibility, setVisibility] = useState<PublishVisibility>('public');

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !caption) return;

    const hashtags = hashtagsStr
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    addToQueue({
      postId: `post_${Date.now()}`,
      postTitle,
      platform,
      caption,
      hashtags,
      ctaUrl: ctaUrl || undefined,
      media: mediaUrl ? [{ url: mediaUrl, type: 'image' }] : undefined,
      visibility,
    });

    // Reset Form
    setPostTitle('');
    setCaption('');
    setHashtagsStr('');
    setCtaUrl('');
    setMediaUrl('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900">Official API Publishing Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Content approved and queued for direct REST/Graph API execution with zero automation proxies.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Queue Approved Post</span>
        </button>
      </div>

      {/* Currently Publishing Queue */}
      {publishingQueue.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Active API Dispatches ({publishingQueue.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishingQueue.map((item) => (
              <div
                key={item.id}
                className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900">{item.postTitle}</span>
                    <PublishStatusBadge status="publishing" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Dispatch Queue ({pendingQueue.length})
          </h3>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Publishing Queue Empty</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              All approved posts have been dispatched or no posts are currently staged for publication.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingQueue.map((item) => {
              const platformInfo = PLATFORM_INFO[item.platform];
              const PlatformIcon = platformInfo?.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-indigo-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${platformInfo?.color || 'bg-slate-100'}`}>
                        {PlatformIcon && <PlatformIcon className="w-4 h-4" />}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.postTitle}</h4>
                      <PublishStatusBadge status="pending" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">{item.caption}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      {item.scheduledAt && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(item.scheduledAt).toLocaleString()}
                        </span>
                      )}
                      {item.hashtags && item.hashtags.length > 0 && (
                        <span className="font-semibold text-indigo-600">
                          {item.hashtags.map((h) => `#${h}`).join(' ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => setPreviewRequest(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={() => publishNow(item.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish API Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cancelRequest(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Platform Payload Preview</h3>
              <button
                type="button"
                onClick={() => setPreviewRequest(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>

            <PublishPreview request={previewRequest} />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  publishNow(previewRequest.id);
                  setPreviewRequest(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Dispatch Immediately
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Queue Approved Content
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Internal Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Launch Post"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Platform</label>
                <PlatformSelector selectedPlatform={platform} onSelectPlatform={setPlatform} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Post Caption / Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write approved caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hashtags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="AI, Tech, Launch"
                    value={hashtagsStr}
                    onChange={(e) => setHashtagsStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Link URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Media Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  Save to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
