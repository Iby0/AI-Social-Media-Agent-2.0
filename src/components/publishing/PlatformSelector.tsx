import React from 'react';
import { SocialPlatformType } from '../../publishers/publisher.types';
import { Facebook, Instagram, Linkedin, Github, Twitter, MessageSquare, Globe, Send } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: SocialPlatformType;
  onSelectPlatform: (platform: SocialPlatformType) => void;
  allowedPlatforms?: SocialPlatformType[];
}

export const PLATFORM_INFO: Record<
  SocialPlatformType,
  { name: string; icon: React.FC<any>; color: string; badge?: string }
> = {
  facebook: { name: 'Facebook Pages', icon: Facebook, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  instagram: { name: 'Instagram Business', icon: Instagram, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  linkedin: { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700 bg-blue-50 border-blue-300' },
  github: { name: 'GitHub', icon: Github, color: 'text-slate-800 bg-slate-100 border-slate-300' },
  twitter: { name: 'X / Twitter', icon: Twitter, color: 'text-sky-500 bg-sky-50 border-sky-200', badge: 'SOON' },
  threads: { name: 'Threads', icon: MessageSquare, color: 'text-stone-800 bg-stone-100 border-stone-200', badge: 'SOON' },
  telegram: { name: 'Telegram', icon: Send, color: 'text-blue-500 bg-blue-50 border-blue-200', badge: 'SOON' },
  wordpress: { name: 'WordPress', icon: Globe, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', badge: 'SOON' },
};

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onSelectPlatform,
  allowedPlatforms = ['facebook', 'instagram', 'linkedin', 'github'],
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(PLATFORM_INFO) as SocialPlatformType[]).map((platformKey) => {
        const info = PLATFORM_INFO[platformKey];
        const Icon = info.icon;
        const isSelected = selectedPlatform === platformKey;
        const isDisabled = !allowedPlatforms.includes(platformKey);

        return (
          <button
            key={platformKey}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectPlatform(platformKey)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSelected
                ? 'ring-2 ring-indigo-500 ring-offset-1 border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
                : isDisabled
                ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Icon className={`w-4 h-4 ${info.color.split(' ')[0]}`} />
            <span>{info.name}</span>
            {info.badge && (
              <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                {info.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
