import React, { useState } from 'react';
import { useImageAIContext, ImageAIProvider } from '../../context/ImageAIContext';
import { ImagePromptForm } from './ImagePromptForm';
import { ImagePreview } from './ImagePreview';
import { GenerationProgress } from './GenerationProgress';
import { ImageHistory } from './ImageHistory';
import {
  Wand2,
  Sparkles,
  History,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const InnerImageAIEngine: React.FC = () => {
  const {
    isGenerating,
    generationStep,
    latestOutput,
    error,
    clearError,
  } = useImageAIContext();

  const [activeTab, setActiveTab] = useState<'studio' | 'history'>('studio');
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

  const handleOpenDraftModal = (imageUrl: string) => {
    setDraftNotice('Image attached and sent to Post Studio!');
    setTimeout(() => setDraftNotice(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Navigation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Module 17 &bull; AI Image Generation Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Wand2 className="w-7 h-7 text-blue-400" />
            AI Social Image Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
            Generate high-resolution social media post graphics, banners, and illustrations tailored for LinkedIn, Facebook, Instagram, and GitHub using Google Gemini Image API adapter models.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'studio'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image Studio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            History Gallery
          </button>
        </div>
      </div>

      {/* Global Notifications */}
      {draftNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {draftNotice}
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            {error}
          </span>
          <button
            type="button"
            onClick={clearError}
            className="text-xs text-red-300 hover:underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content View */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-6 space-y-6">
            <ImagePromptForm />
          </div>

          {/* Right Column: Progress or Preview Output */}
          <div className="lg:col-span-6 space-y-6">
            {isGenerating ? (
              <GenerationProgress stepMessage={generationStep} />
            ) : latestOutput ? (
              <ImagePreview output={latestOutput} onOpenDraftModal={handleOpenDraftModal} />
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 mx-auto">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-slate-200">No Image Asset Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Fill out the prompt details on the left and click &quot;Generate Social Image&quot; to synthesize high-resolution social graphics.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && <ImageHistory />}
    </div>
  );
};

export const AIContentImageEngine: React.FC = () => {
  return (
    <ImageAIProvider>
      <InnerImageAIEngine />
    </ImageAIProvider>
  );
};
