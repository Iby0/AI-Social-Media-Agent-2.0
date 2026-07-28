import React, { useState, useEffect } from 'react';
import {
  Save,
  Eye,
  X,
  Plus,
  Image as ImageIcon,
  Tag,
  AlertCircle,
  CheckCircle,
  Hash,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Globe,
  Upload,
  Layers,
} from 'lucide-react';
import { PostRecord, ContentPostStatus, MediaRecord } from '../../database/types';
import {
  CONTENT_CATEGORIES,
  PLATFORM_LIMITS,
  normalizePostStatus,
  parseHashtags,
} from '../../services/content/content.utils';
import { validatePostContent } from '../../services/content/content.validation';
import { mediaService } from '../../database/services/mediaService';
import { PostPreview } from './PostPreview';

interface PostEditorProps {
  initialPost?: Partial<PostRecord> | null;
  onSave: (postData: Partial<PostRecord>, status: ContentPostStatus) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  initialPost,
  onSave,
  onCancel,
  className = '',
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [caption, setCaption] = useState(initialPost?.caption || '');
  const [description, setDescription] = useState(initialPost?.description || '');
  const [platform, setPlatform] = useState(initialPost?.platform || 'facebook');
  const [category, setCategory] = useState(initialPost?.category || 'Technology');
  const [customCategory, setCustomCategory] = useState('');
  const [status, setStatus] = useState<ContentPostStatus>(
    normalizePostStatus(initialPost?.status || 'Draft')
  );
  const [hashtags, setHashtags] = useState<string[]>(initialPost?.hashtags || []);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState(initialPost?.image || '');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>(
    initialPost?.mediaIds || []
  );

  const [availableMedia, setAvailableMedia] = useState<MediaRecord[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Fetch Media Library on mount
  useEffect(() => {
    mediaService.getAll().then(setAvailableMedia).catch(console.error);
  }, []);

  // Recalculate validation warnings / limits on text change
  useEffect(() => {
    const activeCategory = category === 'Custom Category' ? customCategory : category;
    const res = validatePostContent({
      title,
      caption,
      platform,
      hashtags,
      mediaIds: selectedMediaIds,
      category: activeCategory,
    });
    setValidationWarnings(res.warnings);
    setValidationErrors(res.errors);
  }, [title, caption, platform, hashtags, selectedMediaIds, category, customCategory]);

  const platformLimit = PLATFORM_LIMITS[platform.toLowerCase()] || PLATFORM_LIMITS.all;
  const currentCategory = category === 'Custom Category' ? customCategory : category;

  const handleAddHashtag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tagInput.trim()) return;
    const parsed = parseHashtags(tagInput);
    setHashtags((prev) => Array.from(new Set([...prev, ...parsed])));
    setTagInput('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSelectMedia = (media: MediaRecord) => {
    if (selectedMediaIds.includes(media.id)) {
      setSelectedMediaIds((prev) => prev.filter((id) => id !== media.id));
      if (imageUrl === media.fileData || imageUrl === media.thumbnail) {
        setImageUrl('');
      }
    } else {
      if (selectedMediaIds.length >= platformLimit.maxMedia) {
        alert(`Maximum ${platformLimit.maxMedia} media items allowed for ${platformLimit.name}`);
        return;
      }
      setSelectedMediaIds((prev) => [...prev, media.id]);
      if (!imageUrl) {
        setImageUrl(media.fileData || media.thumbnail || '');
      }
    }
  };

  const handleSubmit = async (targetStatus: ContentPostStatus) => {
    const finalCategory = category === 'Custom Category' ? customCategory.trim() : category;

    const validation = validatePostContent({
      title,
      caption,
      platform,
      hashtags,
      mediaIds: selectedMediaIds,
      category: finalCategory,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const postPayload: Partial<PostRecord> = {
        id: initialPost?.id,
        title: title.trim(),
        caption: caption.trim(),
        description: description.trim() || caption.trim(),
        content: caption.trim(),
        platform,
        category: finalCategory || 'Technology',
        hashtags,
        image: imageUrl,
        mediaIds: selectedMediaIds,
        status: targetStatus,
      };

      await onSave(postPayload, targetStatus);
    } catch (err: any) {
      console.error('Failed to save post:', err);
      alert('Failed to save post. Please check input values.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 ${className}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            {initialPost?.id ? 'Edit Content Post' : 'Create New Content Post'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Prepare, validate and manage your post before scheduling and AI auto-publishing.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Grid: Form Inputs Left, Live Preview / Options Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post Editor Fields (8 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Post Title */}
          <div className="space-y-1.5">
            <label id="label-post-title" htmlFor="post-title" className="block text-xs font-semibold text-slate-300">
              Post Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Product Launch Announcement"
              className={`w-full bg-slate-950 border text-slate-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                validationErrors.title ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
            {validationErrors.title && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle size={12} /> {validationErrors.title}
              </p>
            )}
          </div>

          {/* Platform Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Target Social Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
                { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
                { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: 'text-slate-200' },
                { id: 'all', name: 'All Platforms', icon: Globe, color: 'text-indigo-400' },
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-inner'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon size={18} className={p.color} />
                    <span className="text-[11px] font-semibold">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption Editor & Character Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label id="label-post-caption" htmlFor="post-caption" className="block text-xs font-semibold text-slate-300">
                Caption Content <span className="text-rose-400">*</span>
              </label>

              <span
                className={`text-[11px] font-mono ${
                  caption.length > platformLimit.maxChars ? 'text-rose-400 font-bold' : 'text-slate-400'
                }`}
              >
                {caption.length.toLocaleString()} / {platformLimit.maxChars.toLocaleString()} chars
              </span>
            </div>

            <textarea
              id="post-caption"
              rows={5}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your main caption here..."
              className={`w-full bg-slate-950 border text-slate-100 text-sm rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                validationErrors.caption ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
              }`}
            />

            {/* Validation Feedback */}
            {validationErrors.caption && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle size={12} /> {validationErrors.caption}
              </p>
            )}

            {validationWarnings.map((warn, i) => (
              <p key={i} className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle size={12} /> {warn}
              </p>
            ))}
          </div>

          {/* Hashtag Manager */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Hashtags</label>
            <form onSubmit={handleAddHashtag} className="flex gap-2">
              <div className="relative flex-1">
                <Hash size={14} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Type tag and press Enter (e.g. AI, Tech)"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </form>

            {/* Tags Pills */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="text-indigo-400 hover:text-indigo-100 ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Category & Custom Category Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label id="label-post-category" htmlFor="post-category" className="block text-xs font-semibold text-slate-300">
                Content Category
              </label>
              <select
                id="post-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CONTENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {category === 'Custom Category' && (
              <div className="space-y-1.5">
                <label id="label-custom-category" htmlFor="custom-category" className="block text-xs font-semibold text-slate-300">
                  Custom Category Name
                </label>
                <input
                  type="text"
                  id="custom-category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Workflow Status Picker */}
            <div className="space-y-1.5">
              <label id="label-post-status-select" htmlFor="post-status-select" className="block text-xs font-semibold text-slate-300">
                Post Workflow Status
              </label>
              <select
                id="post-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentPostStatus)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Draft">Draft (Scratchpad / Idea)</option>
                <option value="Review">Review (Pending Peer Check)</option>
                <option value="Ready">Ready (Approved for Dispatch)</option>
                <option value="Scheduled">Scheduled (Assigned Calendar Slot)</option>
                <option value="Published">Published (Live on Platform)</option>
                <option value="Archived">Archived (Hidden Item)</option>
              </select>
            </div>
          </div>

          {/* Media Attachments Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-indigo-400" />
                Attached Media ({selectedMediaIds.length}/{platformLimit.maxMedia})
              </label>

              <button
                type="button"
                onClick={() => setShowMediaPicker(!showMediaPicker)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                {showMediaPicker ? 'Close Library' : 'Pick from Media Library'}
              </button>
            </div>

            {/* Custom Image URL direct input */}
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste Image URL or select from library below"
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            />

            {/* Media Picker Drawer */}
            {showMediaPicker && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 max-h-48 overflow-y-auto">
                <p className="text-[11px] text-slate-400">Select items stored in Module 08 Media Library:</p>
                {availableMedia.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">
                    No images found in Media Library. Upload images in the Media Library module first.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableMedia.map((m) => {
                      const isSelected = selectedMediaIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSelectMedia(m)}
                          className={`relative rounded-lg overflow-hidden border cursor-pointer aspect-square ${
                            isSelected
                              ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={m.fileData || m.thumbnail}
                            alt={m.fileName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-indigo-600 rounded-full text-white p-0.5">
                              <CheckCircle size={12} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Platform Preview Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-4">
            <PostPreview
              post={{
                title,
                caption,
                hashtags,
                image: imageUrl,
                category: currentCategory,
              }}
              activePlatform={platform}
              onPlatformChange={(p) => setPlatform(p)}
            />

            {/* Bottom Form Actions */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('Ready')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={16} /> Save & Mark Ready
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('Draft')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Save size={14} /> Save Draft
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs text-center font-medium"
              >
                Cancel / Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
