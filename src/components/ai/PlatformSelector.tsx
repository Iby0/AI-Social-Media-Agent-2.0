import React from 'react';
import { SocialPlatform } from '../../database/types';
import { Facebook, Instagram, Linkedin, Github, Twitter, MessageSquare, Send, Globe } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: SocialPlatform;
  onChange: (platform: SocialPlatform) => void;
}

export const PLATFORMS: { id: SocialPlatform; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-sky-500' },
  { id: 'github', label: 'GitHub', icon: Github, color: 'text-slate-200' },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'text-slate-300' },
  { id: 'threads', label: 'Threads', icon: MessageSquare, color: 'text-purple-400' },
  { id: 'telegram', label: 'Telegram', icon: Send, color: 'text-cyan-400' },
  { id: 'wordpress', label: 'WordPress', icon: Globe, color: 'text-emerald-400' },
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedPlatform, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
        Target Platform
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PLATFORMS.map((pl) => {
          const Icon = pl.icon;
          const isSelected = selectedPlatform === pl.id;

          return (
            <button
              key={pl.id}
              type="button"
              onClick={() => onChange(pl.id)}
              className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/15 text-white ring-1 ring-indigo-500/40 font-bold'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${pl.color}`} />
              <span className="text-xs truncate">{pl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
