import React from 'react';
import { MediaRecord } from '../../database/types';
import { formatBytes } from '../../services/media/media.utils';
import { Badge } from '../ui/Badge';
import { Eye, Trash2, Copy, Sparkles, Image as ImageIcon, UploadCloud, Clock } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface MediaCardProps {
  media: MediaRecord;
  onPreview: (media: MediaRecord) => void;
  onDelete: (id: string) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, onPreview, onDelete }) => {
  const { addToast } = useToast();

  const handleCopyData = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(media.fileData || media.thumbnail || '');
    addToast('Media data URL copied to clipboard!', 'success');
  };

  const getCategoryBadge = () => {
    switch (media.category) {
      case 'AI Generated':
        return (
          <Badge variant="purple" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>AI Generated</span>
          </Badge>
        );
      case 'Post Image':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            <span>Post Attachment</span>
          </Badge>
        );
      case 'Temporary File':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Temporary</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <UploadCloud className="h-3 w-3" />
            <span>Uploaded</span>
          </Badge>
        );
    }
  };

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between">
      {/* Thumbnail Area */}
      <div
        onClick={() => onPreview(media)}
        className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group"
      >
        <img
          src={media.thumbnail || media.fileData}
          alt={media.fileName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(media);
            }}
            title="View Details"
            className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white transition-colors cursor-pointer shadow-lg"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopyData}
            title="Copy Data URL"
            className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-lg"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(media.id);
            }}
            title="Delete Asset"
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Top Overlay Badge */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          {getCategoryBadge()}
        </div>
      </div>

      {/* Media Details Footer */}
      <div className="p-3.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4
            onClick={() => onPreview(media)}
            className="text-xs font-bold text-white truncate hover:text-indigo-400 transition-colors cursor-pointer"
            title={media.fileName}
          >
            {media.fileName}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
          <span>{formatBytes(media.fileSize)}</span>
          <span>{new Date(media.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
