import React, { useState } from 'react';
import { AIOutputModel } from '../../types/ai';
import { SocialPlatform } from '../../database/types';
import { ContentEditor } from './ContentEditor';
import { HashtagCard } from './HashtagCard';
import { ImagePromptCard } from './ImagePromptCard';
import { Sparkles, Megaphone, Search, Copy, Check } from 'lucide-react';

interface GeneratedContentCardProps {
  output: AIOutputModel;
  platform: SocialPlatform;
  language: string;
}

export const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({ output, platform, language }) => {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = () => {
    const fullBundle = `
=== ${output.title} ===
${output.caption}

CTA: ${output.cta}

HASHTAGS:
${(output.hashtags || []).join(' ')}

IMAGE PROMPT:
${output.imagePrompt}
`.trim();

    navigator.clipboard.writeText(fullBundle);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner Control */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI Content Generation Result</h2>
            <p className="text-xs text-slate-400">
              Tailored for <span className="font-semibold text-indigo-300 uppercase">{platform}</span> in{' '}
              <span className="font-semibold text-slate-200">{language}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyAll}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copiedAll ? 'Copied Full Output Bundle' : 'Copy Complete Bundle'}</span>
        </button>
      </div>

      {/* Main Content Editor */}
      <ContentEditor title={output.title} caption={output.caption} platform={platform} language={language} />

      {/* Grid of Supporting Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hashtags Card */}
        <HashtagCard hashtags={output.hashtags} platform={platform} />

        {/* Image Prompt Card */}
        <ImagePromptCard imagePrompt={output.imagePrompt} />
      </div>

      {/* Call To Action & SEO Keywords Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Call To Action Callout */}
        {output.cta && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Megaphone className="h-4 w-4" />
              <h4 className="text-xs font-bold text-white">Recommended Call To Action (CTA)</h4>
            </div>
            <p className="text-xs text-slate-300 font-medium bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              "{output.cta}"
            </p>
          </div>
        )}

        {/* SEO & Discovery Keywords */}
        {output.seoKeywords && output.seoKeywords.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400">
              <Search className="h-4 w-4" />
              <h4 className="text-xs font-bold text-white">SEO & Discovery Keywords</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {output.seoKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
