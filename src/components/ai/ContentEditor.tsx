import React, { useState, useEffect } from 'react';
import { SocialPlatform } from '../../database/types';
import { PLATFORM_LIMITS } from '../../services/ai/validation.service';
import {
  Copy,
  Check,
  Edit3,
  Wand2,
  RefreshCw,
  SpellCheck,
  Sliders,
  Maximize2,
  Minimize2,
  Bookmark,
  Clock,
  Type,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useAIContext } from '../../context/AIContext';
import { db } from '../../lib/db';

interface ContentEditorProps {
  title: string;
  caption: string;
  platform: SocialPlatform;
  language: string;
  onCaptionChange?: (updated: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  title,
  caption: initialCaption,
  platform,
  language,
  onCaptionChange,
}) => {
  const [caption, setCaption] = useState(initialCaption);
  const [copied, setCopied] = useState(false);
  const [savedToDraft, setSavedToDraft] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { generate, currentInput } = useAIContext();
  const platformLimit = PLATFORM_LIMITS[platform.toLowerCase()] || PLATFORM_LIMITS['linkedin'];

  useEffect(() => {
    setCaption(initialCaption);
  }, [initialCaption]);

  const handleTextChange = (val: string) => {
    setCaption(val);
    if (onCaptionChange) onCaptionChange(val);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = async () => {
    try {
      await db.savePost({
        id: `post_${Date.now()}`,
        title: title || 'AI Generated Post',
        topic: caption.slice(0, 50),
        tone: currentInput.tone || 'Professional',
        audience: currentInput.targetAudience || 'Community',
        captions: { [platform]: caption },
        hashtags: [],
        selectedPlatforms: [platform],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSavedToDraft(true);
      setTimeout(() => setSavedToDraft(false), 3000);
    } catch (err) {
      console.error('Failed to save to draft library:', err);
    }
  };

  // Quick Action AI Trigger
  const handleQuickAction = async (feature: 'improver' | 'rewriter' | 'grammar' | 'expander' | 'shortener') => {
    try {
      const { result } = await generate({
        ...currentInput,
        feature,
        existingContent: caption,
        platform,
        language: language as any,
      });
      if (result && result.caption) {
        setCaption(result.caption);
        if (onCaptionChange) onCaptionChange(result.caption);
      }
    } catch (e) {
      console.error('Quick action failed:', e);
    }
  };

  const charCount = caption.length;
  const isOverLimit = charCount > platformLimit.maxChars;
  const percentage = Math.min(100, (charCount / platformLimit.maxChars) * 100);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Edit3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{title || 'Generated Social Media Content'}</span>
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                {platform}
              </span>
            </h3>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Type className="h-3 w-3 text-slate-500" />
                <span>{charCount} / {platformLimit.maxChars} chars</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-500" />
                <span>{Math.ceil(charCount / 1000)} min read</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isEditing ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Manual Edit'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              savedToDraft
                ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                : 'border-indigo-500/30 bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {savedToDraft ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            <span>{savedToDraft ? 'Saved to Drafts' : 'Save to Content Library'}</span>
          </button>
        </div>
      </div>

      {/* Character Limit Gauge Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Platform Limit Gauge ({platform})</span>
          <span className={isOverLimit ? 'text-rose-400 font-bold' : 'text-slate-400'}>
            {charCount} / {platformLimit.maxChars}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all ${
              isOverLimit ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {isOverLimit && (
          <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-semibold">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Character limit exceeded for {platform}. Consider using "Content Shortener" below.</span>
          </p>
        )}
      </div>

      {/* Editable Text Area / Content View */}
      {isEditing ? (
        <textarea
          value={caption}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={8}
          className="w-full bg-slate-950 border border-indigo-500 rounded-xl p-4 text-xs sm:text-sm text-slate-100 font-sans focus:outline-none leading-relaxed"
          placeholder="Edit generated content here..."
        />
      ) : (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {caption}
        </div>
      )}

      {/* Quick AI Refinement Actions Toolbar */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
          Instant AI Quick Actions
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleQuickAction('improver')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Wand2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Improve Quality</span>
          </button>

          <button
            onClick={() => handleQuickAction('rewriter')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
            <span>Rewrite Fresh</span>
          </button>

          <button
            onClick={() => handleQuickAction('grammar')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <SpellCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Fix Grammar</span>
          </button>

          <button
            onClick={() => handleQuickAction('expander')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5 text-purple-400" />
            <span>Expand Content</span>
          </button>

          <button
            onClick={() => handleQuickAction('shortener')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Minimize2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Shorten / Condense</span>
          </button>
        </div>
      </div>
    </div>
  );
};
