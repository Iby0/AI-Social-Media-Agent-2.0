import React from 'react';
import { Facebook, Instagram, Linkedin, Github, Globe } from 'lucide-react';
import { SocialPlatform } from '../../social/types';

interface PlatformIconProps {
  platform: SocialPlatform | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBg?: boolean;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 'md',
  className = '',
  showBg = true,
}) => {
  const p = platform.toLowerCase();

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
    xl: 32,
  };

  const containerSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  };

  const currentSize = iconSizes[size];

  if (p === 'facebook') {
    return (
      <div
        className={`${showBg ? `${containerSizes[size]} bg-blue-600/10 text-blue-500 border border-blue-500/20` : 'text-blue-500'} flex items-center justify-center shrink-0 ${className}`}
        title="Facebook Page"
      >
        <Facebook size={currentSize} className="fill-current" />
      </div>
    );
  }

  if (p === 'instagram') {
    return (
      <div
        className={`${showBg ? `${containerSizes[size]} bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 text-pink-500 border border-pink-500/20` : 'text-pink-500'} flex items-center justify-center shrink-0 ${className}`}
        title="Instagram Business"
      >
        <Instagram size={currentSize} />
      </div>
    );
  }

  if (p === 'linkedin') {
    return (
      <div
        className={`${showBg ? `${containerSizes[size]} bg-sky-600/10 text-sky-400 border border-sky-500/20` : 'text-sky-400'} flex items-center justify-center shrink-0 ${className}`}
        title="LinkedIn"
      >
        <Linkedin size={currentSize} className="fill-current" />
      </div>
    );
  }

  if (p === 'github') {
    return (
      <div
        className={`${showBg ? `${containerSizes[size]} bg-slate-800 text-slate-200 border border-slate-700` : 'text-slate-300'} flex items-center justify-center shrink-0 ${className}`}
        title="GitHub"
      >
        <Github size={currentSize} />
      </div>
    );
  }

  return (
    <div
      className={`${showBg ? `${containerSizes[size]} bg-indigo-500/10 text-indigo-400 border border-indigo-500/20` : 'text-indigo-400'} flex items-center justify-center shrink-0 ${className}`}
      title={platform}
    >
      <Globe size={currentSize} />
    </div>
  );
};
