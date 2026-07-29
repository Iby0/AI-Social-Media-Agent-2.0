import React from 'react';
import { ImageStyle } from '../../types/image-ai';
import { VALID_STYLES } from '../../services/image-ai/validation';
import { Palette, Check } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: ImageStyle;
  onSelectStyle: (style: ImageStyle) => void;
}

const STYLE_BADGES: Record<ImageStyle, { gradient: string; text: string; description: string }> = {
  Minimal: {
    gradient: 'from-slate-100 to-slate-200 text-slate-800 border-slate-300',
    text: 'Minimal',
    description: 'Clean line art, generous negative space',
  },
  Corporate: {
    gradient: 'from-indigo-600 to-blue-700 text-white border-indigo-400',
    text: 'Corporate',
    description: 'Polished B2B indigo glassmorphism',
  },
  Modern: {
    gradient: 'from-blue-500 to-cyan-500 text-white border-cyan-300',
    text: 'Modern',
    description: 'Contemporary balanced vector UI',
  },
  Technology: {
    gradient: 'from-slate-900 via-indigo-950 to-blue-900 text-cyan-300 border-cyan-500',
    text: 'Technology',
    description: 'Glowing circuit nodes & cyber aesthetics',
  },
  Professional: {
    gradient: 'from-slate-800 to-slate-900 text-white border-slate-600',
    text: 'Professional',
    description: 'Clean executive presentation style',
  },
  Creative: {
    gradient: 'from-fuchsia-600 to-pink-500 text-white border-pink-400',
    text: 'Creative',
    description: 'Vibrant fluid waves & artistic mesh',
  },
  Dark: {
    gradient: 'from-black via-zinc-900 to-neutral-900 text-zinc-100 border-zinc-700',
    text: 'Dark',
    description: 'Obsidian luxury dark mode canvas',
  },
  Light: {
    gradient: 'from-white to-sky-50 text-slate-800 border-sky-200',
    text: 'Light',
    description: 'Fresh light background with soft accents',
  },
  Gradient: {
    gradient: 'from-violet-600 via-purple-500 to-amber-400 text-white border-purple-300',
    text: 'Gradient',
    description: 'Smooth multi-color mesh background',
  },
  'Flat Design': {
    gradient: 'from-blue-600 to-emerald-500 text-white border-emerald-300',
    text: 'Flat Design',
    description: 'Bold 2D vector graphic blocks',
  },
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelectStyle }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          Style Preset
        </label>
        <span className="text-xs text-slate-400">10 Presets Available</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {VALID_STYLES.map((style) => {
          const isSelected = selectedStyle === style;
          const badge = STYLE_BADGES[style as ImageStyle] || {
            gradient: 'from-slate-700 to-slate-800 text-white border-slate-600',
            text: style,
            description: 'Custom aesthetic',
          };

          return (
            <button
              key={style}
              type="button"
              onClick={() => onSelectStyle(style as ImageStyle)}
              className={`relative p-3 rounded-xl border text-left transition-all duration-200 group overflow-hidden ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-500/30 bg-slate-800/90 shadow-lg shadow-blue-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Background gradient pill indicator */}
              <div
                className={`h-1.5 w-full rounded-full bg-gradient-to-r ${badge.gradient} mb-2 transition-transform duration-200 group-hover:scale-105`}
              />

              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-slate-100 truncate">{badge.text}</span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-1 mt-1 leading-tight">
                {badge.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
