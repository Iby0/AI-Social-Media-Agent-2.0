import React, { useState } from 'react';
import { Hash, Copy, Check, Tag } from 'lucide-react';

interface HashtagCardProps {
  hashtags: string[];
  platform?: string;
}

export const HashtagCard: React.FC<HashtagCardProps> = ({ hashtags, platform = 'Social' }) => {
  const [copied, setCopied] = useState(false);

  const hashtagString = hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');

  const handleCopy = () => {
    navigator.clipboard.writeText(hashtagString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hashtags || hashtags.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Recommended Hashtags</h4>
            <span className="text-[10px] text-slate-500 font-mono">
              {hashtags.length} tags for {platform}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
          <span>{copied ? 'Copied All' : 'Copy Hashtags'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {hashtags.map((tag, idx) => {
          const formatted = tag.startsWith('#') ? tag : `#${tag}`;
          return (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium hover:bg-indigo-500/20 transition-colors cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(formatted);
              }}
              title="Click to copy individual tag"
            >
              <Tag className="h-3 w-3 text-indigo-400 opacity-60" />
              <span>{formatted}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
