import React, { useState } from 'react';
import { AIFeatureType, ContentLengthOption, EmojiLevelOption } from '../../types/ai';
import { PlatformSelector } from './PlatformSelector';
import { LanguageSelector } from './LanguageSelector';
import { ToneSelector } from './ToneSelector';
import { useAIContext } from '../../context/AIContext';
import { usePrompt } from '../../hooks/usePrompt';
import {
  Sparkles,
  Wand2,
  FileText,
  Hash,
  Image as ImageIcon,
  Heading,
  Megaphone,
  RefreshCw,
  SpellCheck,
  Sliders,
  Maximize2,
  Minimize2,
  AlertCircle,
  Zap,
  Bookmark,
  Layers,
  Check,
} from 'lucide-react';

export const AI_FEATURES: { id: AIFeatureType; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
  { id: 'caption', label: 'Caption Generator', icon: FileText, desc: 'Generate complete platform post captions' },
  { id: 'hashtag', label: 'Hashtags', icon: Hash, desc: 'Targeted hashtag stacks' },
  { id: 'image_prompt', label: 'Visual Prompt', icon: ImageIcon, desc: 'Image generation concept prompts' },
  { id: 'title', label: 'Title & Headline', icon: Heading, desc: 'Catchy campaign headers' },
  { id: 'cta', label: 'Call To Action', icon: Megaphone, desc: 'Conversion-focused CTAs' },
  { id: 'improver', label: 'Content Improver', icon: Wand2, desc: 'Enhance structure and punchiness' },
  { id: 'rewriter', label: 'Content Rewriter', icon: RefreshCw, desc: 'Fresh perspective rewrite' },
  { id: 'grammar', label: 'Grammar Checker', icon: SpellCheck, desc: 'Fix typos, syntax, and clarity' },
  { id: 'tone_changer', label: 'Tone Changer', icon: Sliders, desc: 'Shift brand voice and mood' },
  { id: 'expander', label: 'Content Expander', icon: Maximize2, desc: 'Elaborate with deeper points' },
  { id: 'shortener', label: 'Content Shortener', icon: Minimize2, desc: 'Condense into brief post' },
];

export const PromptForm: React.FC = () => {
  const { currentInput, setCurrentInput, generate, isGenerating, rateLimitStatus } = useAIContext();
  const { templates } = usePrompt();

  const [keywordInput, setKeywordInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const isTextAction = [
    'improver',
    'rewriter',
    'grammar',
    'tone_changer',
    'expander',
    'shortener',
  ].includes(currentInput.feature);

  const handleFeatureSelect = (feat: AIFeatureType) => {
    setCurrentInput((prev) => ({ ...prev, feature: feat }));
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim().replace(/^#/, '');
      if (!currentInput.keywords?.includes(kw)) {
        setCurrentInput((prev) => ({
          ...prev,
          keywords: [...(prev.keywords || []), kw],
        }));
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setCurrentInput((prev) => ({
      ...prev,
      keywords: (prev.keywords || []).filter((k) => k !== kw),
    }));
  };

  const handleApplyTemplate = (tplId: string) => {
    setSelectedTemplateId(tplId);
    const found = templates.find((t) => t.id === tplId);
    if (found) {
      setCurrentInput((prev) => ({
        ...prev,
        feature: found.feature,
        customInstructions: found.template,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generate(currentInput);
    } catch (err) {
      console.error('Generation error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
      {/* Top Header & Feature Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Content Generation Studio</h2>
              <p className="text-xs text-slate-400">Select an AI feature module to begin crafting content</p>
            </div>
          </div>

          {/* Prompt Template Quick Picker */}
          {templates.length > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedTemplateId}
                onChange={(e) => handleApplyTemplate(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Apply Preset Template --</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.platform})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Feature Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {AI_FEATURES.map((feat) => {
            const Icon = feat.icon;
            const isSelected = currentInput.feature === feat.id;

            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => handleFeatureSelect(feat.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-xs truncate">{feat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Platform Picker */}
      <PlatformSelector
        selectedPlatform={currentInput.platform}
        onChange={(platform) => setCurrentInput((prev) => ({ ...prev, platform }))}
      />

      {/* Primary Input Section: Topic or Existing Content */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>{isTextAction ? 'Existing Text Content to Refine' : 'Post Topic or Campaign Outline'}</span>
          <span className="text-[10px] text-slate-500 font-normal">
            {isTextAction ? 'Paste raw text to process' : 'Be specific for better results'}
          </span>
        </label>

        {isTextAction ? (
          <textarea
            value={currentInput.existingContent || ''}
            onChange={(e) => setCurrentInput((prev) => ({ ...prev, existingContent: e.target.value }))}
            rows={5}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            placeholder="Paste your existing post draft or text here..."
          />
        ) : (
          <textarea
            value={currentInput.topic || ''}
            onChange={(e) => setCurrentInput((prev) => ({ ...prev, topic: e.target.value }))}
            rows={3}
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
            placeholder="E.g., Launching our new open-source AI agent framework with real-time multi-account social publishing features..."
          />
        )}
      </div>

      {/* Output Language & Tone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LanguageSelector
          selectedLanguage={currentInput.language}
          onChange={(language) => setCurrentInput((prev) => ({ ...prev, language }))}
        />
        <ToneSelector
          selectedTone={currentInput.tone || 'Professional'}
          onChange={(tone) => setCurrentInput((prev) => ({ ...prev, tone }))}
        />
      </div>

      {/* Toggle Advanced Controls */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>{showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Keywords, Audience, Emojis, CTAs)'}</span>
        </button>
      </div>

      {/* Advanced Settings Drawer */}
      {showAdvanced && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Target Audience</label>
              <input
                type="text"
                value={currentInput.targetAudience || ''}
                onChange={(e) => setCurrentInput((prev) => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="E.g., Software Engineers, Startup Founders, Marketers"
              />
            </div>

            {/* Content Length */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Desired Content Length</label>
              <div className="grid grid-cols-3 gap-2">
                {(['short', 'medium', 'long'] as ContentLengthOption[]).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setCurrentInput((prev) => ({ ...prev, contentLength: len }))}
                    className={`p-2 rounded-xl border text-xs capitalize transition-all cursor-pointer ${
                      currentInput.contentLength === len
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hashtag Count */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hashtag Count ({currentInput.hashtagCount || 8})
              </label>
              <input
                type="range"
                min={0}
                max={25}
                value={currentInput.hashtagCount || 8}
                onChange={(e) =>
                  setCurrentInput((prev) => ({ ...prev, hashtagCount: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Emoji Density */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Emoji Density</label>
              <div className="grid grid-cols-4 gap-1">
                {(['none', 'low', 'medium', 'high'] as EmojiLevelOption[]).map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setCurrentInput((prev) => ({ ...prev, emojiLevel: em }))}
                    className={`p-1.5 rounded-lg border text-[11px] capitalize transition-all cursor-pointer ${
                      currentInput.emojiLevel === em
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Call To Action Toggle */}
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-slate-900 border border-slate-800">
                <input
                  type="checkbox"
                  checked={currentInput.ctaRequired !== false}
                  onChange={(e) => setCurrentInput((prev) => ({ ...prev, ctaRequired: e.target.checked }))}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="text-xs font-semibold text-slate-200">Include Call-To-Action</span>
              </label>
            </div>
          </div>

          {/* Keywords Tag Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Focus Keywords (Press Enter to add)
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 min-h-[42px]">
              {(currentInput.keywords || []).map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-1 font-mono"
                >
                  <span>#{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="hover:text-white text-indigo-400 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="Add keyword..."
                className="bg-transparent text-xs text-slate-200 focus:outline-none flex-1 min-w-[120px] px-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rate Limit Notice / Warning */}
      {rateLimitStatus.quotaWarning && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Daily AI generation quota at {rateLimitStatus.dailyUsed}/{rateLimitStatus.dailyLimit} requests.
          </span>
        </div>
      )}

      {/* Submit Action Button */}
      <button
        type="submit"
        disabled={isGenerating || rateLimitStatus.isCoolingDown}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
          isGenerating || rateLimitStatus.isCoolingDown
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 shadow-indigo-600/30 border border-indigo-400/30 active:scale-[0.99]'
        }`}
      >
        {isGenerating ? (
          <>
            <Zap className="h-4 w-4 animate-spin text-indigo-300" />
            <span>AI Engine Processing...</span>
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4 text-indigo-300" />
            <span>
              Generate Content ({AI_FEATURES.find((f) => f.id === currentInput.feature)?.label})
            </span>
          </>
        )}
      </button>
    </form>
  );
};
