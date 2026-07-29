import React, { useState } from 'react';
import { ImageOutputModel } from '../../types/image-ai';
import { db } from '../../lib/db';
import {
  Download,
  Copy,
  Check,
  HardDrive,
  Share2,
  Maximize2,
  Clock,
  Sparkles,
  Layers,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ImagePreviewProps {
  output: ImageOutputModel;
  onOpenDraftModal?: (imageUrl: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ output, onOpenDraftModal }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToMedia, setSavedToMedia] = useState<boolean>(!!output.mediaLibraryId);
  const [showPromptDetails, setShowPromptDetails] = useState<boolean>(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = output.imageUrl;
    link.download = `${output.platform}_${output.style}_${output.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output.imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToMediaLibrary = async () => {
    try {
      await db.savePost({
        id: `post_${Date.now()}`,
        title: `AI Graphic - ${output.imageType}`,
        topic: output.promptUsed.slice(0, 100),
        tone: 'Professional',
        audience: 'General',
        captions: { [output.platform]: output.promptUsed },
        hashtags: ['#AI', '#Design', '#SocialMedia'],
        imageUrl: output.imageUrl,
        selectedPlatforms: [output.platform],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSavedToMedia(true);
    } catch (e) {
      console.error('Failed to save to Media Library:', e);
    }
  };

  const formattedSize = (output.imageSize / 1024).toFixed(1) + ' KB';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-2xl backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-950 border border-blue-800 text-blue-300">
              {output.platform}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
              {output.imageType}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950 border border-purple-800 text-purple-300">
              {output.style}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Generated Social Graphic Asset
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Data URL' : 'Copy URL'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download High-Res
          </button>

          {onOpenDraftModal && (
            <button
              type="button"
              onClick={() => onOpenDraftModal(output.imageUrl)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              Use in Post Studio
            </button>
          )}
        </div>
      </div>

      {/* Main Graphic Visual Showcase */}
      <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2 min-h-[300px]">
        <img
          src={output.imageUrl}
          alt={output.promptUsed}
          className="max-h-[550px] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
        />

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1.5 shadow-lg">
          <Maximize2 className="w-3 h-3 text-cyan-400" />
          {output.dimensions.width} &times; {output.dimensions.height} ({output.aspectRatio})
        </div>
      </div>

      {/* Metadata Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-blue-400" />
            File Size
          </div>
          <div className="text-xs font-bold text-slate-200 mt-1">{formattedSize}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            Render Time
          </div>
          <div className="text-xs font-bold text-slate-200 mt-1">{(output.generationTimeMs / 1000).toFixed(2)}s</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-purple-400" />
            Provider
          </div>
          <div className="text-xs font-bold text-slate-200 mt-1 truncate">{output.provider}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Info className="w-3 h-3 text-cyan-400" />
            Media Library
          </div>
          <button
            type="button"
            onClick={handleSaveToMediaLibrary}
            disabled={savedToMedia}
            className={`text-xs font-bold mt-1 text-left ${
              savedToMedia ? 'text-emerald-400' : 'text-blue-400 hover:underline'
            }`}
          >
            {savedToMedia ? 'Auto-Saved' : 'Save to Media'}
          </button>
        </div>
      </div>

      {/* Accordion: Detailed Prompt & Negative Prompt */}
      <div className="border-t border-slate-800 pt-3">
        <button
          type="button"
          onClick={() => setShowPromptDetails(!showPromptDetails)}
          className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            View Generated Prompt &amp; Exclusions (Negative Prompt)
          </span>
          {showPromptDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showPromptDetails && (
          <div className="mt-3 space-y-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <div>
              <span className="font-bold text-blue-400 block mb-1">Prompt Used:</span>
              <p className="font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-200">
                {output.promptUsed}
              </p>
            </div>

            <div>
              <span className="font-bold text-red-400 block mb-1">Negative Prompt (Exclusions):</span>
              <p className="font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-400">
                {output.negativePrompt}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
