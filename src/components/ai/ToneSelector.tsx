import React from 'react';
import { BrandVoiceTone } from '../../types/ai';
import { Sparkles, Check } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: BrandVoiceTone;
  onChange: (tone: BrandVoiceTone) => void;
}

export const BRAND_TONES: { id: BrandVoiceTone; label: string; description: string }[] = [
  { id: 'Professional', label: 'Professional', description: 'Authoritative, polished, industry-standard' },
  { id: 'Friendly', label: 'Friendly', description: 'Warm, approachable, conversational' },
  { id: 'Corporate', label: 'Corporate', description: 'Formal, strategic, B2B focused' },
  { id: 'Technical', label: 'Technical', description: 'In-depth, developer-focused, precise' },
  { id: 'Minimal', label: 'Minimal', description: 'Concise, direct, punchy' },
  { id: 'Inspirational', label: 'Inspirational', description: 'Motivating, visionary, story-driven' },
  { id: 'Casual', label: 'Casual', description: 'Relaxed, trendy, emoji-friendly' },
  { id: 'Educational', label: 'Educational', description: 'Informative, structured, step-by-step' },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span>Brand Voice / Tone</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BRAND_TONES.map((t) => {
          const isSelected = selectedTone === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500/40 font-bold'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{t.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{t.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
