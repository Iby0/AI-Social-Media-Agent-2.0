import React from 'react';
import { PublishRequest } from '../../publishers/publisher.types';
import { PLATFORM_INFO } from './PlatformSelector';
import { Globe, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';

interface PublishPreviewProps {
  request: PublishRequest;
}

export const PublishPreview: React.FC<PublishPreviewProps> = ({ request }) => {
  const platformInfo = PLATFORM_INFO[request.platform];
  const Icon = platformInfo?.icon || Globe;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${platformInfo?.color || 'bg-slate-100'}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{platformInfo?.name || request.platform}</h4>
            <p className="text-[10px] text-slate-500">Official API Payload Preview</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
          {request.visibility || 'public'}
        </span>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3">
        <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">{request.caption}</p>

        {/* Media Preview */}
        {request.media && request.media.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-900 flex items-center justify-center">
            <img
              src={request.media[0].url}
              alt={request.media[0].altText || 'Post media'}
              className="object-cover max-h-56 w-full"
            />
          </div>
        )}

        {/* Hashtags & CTA */}
        <div className="space-y-1 pt-1">
          {request.hashtags && request.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {request.hashtags.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-semibold text-indigo-600">
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}

          {request.ctaUrl && (
            <a
              href={request.ctaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline pt-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{request.ctaUrl}</span>
            </a>
          )}
        </div>
      </div>

      {/* Footer / Mock Interaction bar */}
      <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
            <Heart className="w-3.5 h-3.5" /> Like
          </span>
          <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
            <MessageCircle className="w-3.5 h-3.5" /> Comment
          </span>
          <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
            <Share2 className="w-3.5 h-3.5" /> Share
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">REST / Graph v19.0</span>
      </div>
    </div>
  );
};
