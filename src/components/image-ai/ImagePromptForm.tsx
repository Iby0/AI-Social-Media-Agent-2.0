import React, { useState } from 'react';
import { useImageAIContext } from '../../context/ImageAIContext';
import { StyleSelector } from './StyleSelector';
import { AspectRatioSelector } from './AspectRatioSelector';
import { IMAGE_PROMPT_TEMPLATES } from '../../services/image-ai/prompt-builder';
import { imageValidationService } from '../../services/image-ai/validation';
import { LogoPosition, ImageType } from '../../types/image-ai';
import { SocialPlatform } from '../../database/types';
import {
  Wand2,
  Sparkles,
  Sliders,
  Type,
  Tag,
  Palette,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  BookmarkPlus,
  RefreshCw,
} from 'lucide-react';

export const ImagePromptForm: React.FC = () => {
  const { input, setInput, generateImage, isGenerating } = useImageAIContext();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [keywordInput, setKeywordInput] = useState<string>('');

  const validation = imageValidationService.validateInput(input);

  const handlePlatformChange = (p: SocialPlatform) => {
    setInput((prev) => ({ ...prev, platform: p }));
  };

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      const tag = keywordInput.trim();
      if (!input.keywords?.includes(tag)) {
        setInput((prev) => ({
          ...prev,
          keywords: [...(prev.keywords || []), tag],
        }));
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (tagToRemove: string) => {
    setInput((prev) => ({
      ...prev,
      keywords: (prev.keywords || []).filter((k) => k !== tagToRemove),
    }));
  };

  const handleApplyTemplate = (templateId: string) => {
    const tpl = IMAGE_PROMPT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    setInput((prev) => ({
      ...prev,
      style: tpl.style,
      imageType: tpl.imageType as ImageType,
      customPrompt: tpl.promptTemplate.replace('{{topic}}', prev.topic || 'Software Innovation'),
      negativePrompt: tpl.negativePromptTemplate,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;
    await generateImage();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-400" />
            AI Image Generator Input
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure visual style, dimensions, and brand rules for automated graphic synthesis.
          </p>
        </div>

        {/* Quick Template Selector */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets:
          </span>
          {IMAGE_PROMPT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleApplyTemplate(tpl.id)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-all"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Target Platform Selection */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Target Social Network Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {(['linkedin', 'facebook', 'instagram', 'github', 'twitter'] as SocialPlatform[]).map((p) => {
            const isSelected = input.platform === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePlatformChange(p)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/30'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic & Caption */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-400" />
            Topic / Core Theme *
          </label>
          <input
            type="text"
            value={input.topic}
            onChange={(e) => setInput((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="e.g., Cloud Native Microservices Architecture Best Practices"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Caption / Context (Optional)
          </label>
          <input
            type="text"
            value={input.caption || ''}
            onChange={(e) => setInput((prev) => ({ ...prev, caption: e.target.value }))}
            placeholder="e.g., Transforming engineering productivity with automated pipelines"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Keywords / Tags */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Tag className="w-4 h-4 text-purple-400" />
          Keywords &amp; Visual Motifs (Press Enter)
        </label>
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 min-h-[44px]">
          {(input.keywords || []).map((k) => (
            <span
              key={k}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-950/60 border border-blue-800/60 text-blue-300"
            >
              #{k}
              <button
                type="button"
                onClick={() => handleRemoveKeyword(k)}
                className="hover:text-red-400 ml-1"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleAddKeyword}
            placeholder={input.keywords?.length ? 'Add keyword...' : 'Type keyword & press enter...'}
            className="flex-1 bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none min-w-[140px]"
          />
        </div>
      </div>

      {/* Style Selector */}
      <StyleSelector
        selectedStyle={input.style}
        onSelectStyle={(s) => setInput((prev) => ({ ...prev, style: s }))}
      />

      {/* Aspect Ratio & Image Type */}
      <AspectRatioSelector
        selectedRatio={input.aspectRatio}
        selectedType={input.imageType}
        onSelectRatio={(r) => setInput((prev) => ({ ...prev, aspectRatio: r }))}
        onSelectType={(t) => setInput((prev) => ({ ...prev, imageType: t }))}
      />

      {/* Advanced Customizations Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
          {showAdvanced ? 'Hide Advanced Brand & Prompt Rules' : 'Show Advanced Brand Colors, Logo Position & Negative Prompt'}
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 animate-in fade-in duration-200">
            {/* Brand Colors & Logo Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  Brand Colors (Hex, comma separated)
                </label>
                <input
                  type="text"
                  value={(input.brandColors || []).join(', ')}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      brandColors: e.target.value.split(',').map((c) => c.trim()),
                    }))
                  }
                  placeholder="#3b82f6, #1e293b, #06b6d4"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Logo Badge Position</label>
                <select
                  value={input.logoPosition || 'top-right'}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      logoPosition: e.target.value as LogoPosition,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="none">None</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="center">Center</option>
                </select>
              </div>
            </div>

            {/* Background Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Background Preference</label>
              <input
                type="text"
                value={input.backgroundPreference || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, backgroundPreference: e.target.value }))}
                placeholder="e.g. Deep indigo glassmorphism backdrop with geometric grid"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Custom Prompt Override */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Custom Prompt Override</label>
              <textarea
                rows={2}
                value={input.customPrompt || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, customPrompt: e.target.value }))}
                placeholder="Override or inject exact image instructions for Gemini Imagen..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Negative Prompt (Exclusions)</label>
              <input
                type="text"
                value={input.negativePrompt || ''}
                onChange={(e) => setInput((prev) => ({ ...prev, negativePrompt: e.target.value }))}
                placeholder="blurry, distorted text, low resolution, extra limbs..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Warnings/Errors */}
      {!validation.isValid && (
        <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <div>{validation.errors.join(' ')}</div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          Primary Model: <strong className="text-slate-200">Google Gemini Image API</strong>
        </span>

        <button
          type="submit"
          disabled={isGenerating || !validation.isValid}
          className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center gap-2 transition-all ${
            isGenerating || !validation.isValid
              ? 'bg-slate-800 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] shadow-blue-500/20'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
              Generating Visual Image...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              Generate Social Image
            </>
          )}
        </button>
      </div>
    </form>
  );
};
