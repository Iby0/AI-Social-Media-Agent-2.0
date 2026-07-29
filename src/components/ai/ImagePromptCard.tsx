import React, { useState } from 'react';
import { Image as ImageIcon, Copy, Check, Sparkles } from 'lucide-react';

interface ImagePromptCardProps {
  imagePrompt: string;
}

export const ImagePromptCard: React.FC<ImagePromptCardProps> = ({ imagePrompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(imagePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!imagePrompt) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>AI Visual Asset Concept Prompt</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-[9px] text-pink-300 font-mono">
                Prompt Concept
              </span>
            </h4>
            <span className="text-[10px] text-slate-500">Ready for Imagen, DALL-E 3, or Midjourney</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
          <span>{copied ? 'Copied' : 'Copy Visual Prompt'}</span>
        </button>
      </div>

      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed relative">
        <Sparkles className="h-3.5 w-3.5 text-pink-400 absolute top-2.5 right-2.5 opacity-40" />
        <p className="pr-6">{imagePrompt}</p>
      </div>
    </div>
  );
};
