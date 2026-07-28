import React, { useState } from 'react';
import { MediaRecord } from '../../database/types';
import { formatBytes } from '../../services/media/media.utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Trash2, Copy, Download, HardDrive, Calendar, Image as ImageIcon, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '../ui/Toast';

interface ImagePreviewProps {
  media: MediaRecord | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ media, onClose, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  if (!media) return null;

  const handleCopyDataUrl = () => {
    navigator.clipboard.writeText(media.fileData || media.thumbnail || '');
    addToast('Media Data URL copied to clipboard!', 'success');
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = media.fileData || media.thumbnail || '';
    a.download = media.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast(`Downloaded ${media.fileName}`, 'success');
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(media.id);
      addToast('Media asset permanently deleted.', 'info');
      onClose();
    } catch {
      addToast('Failed to delete media asset.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{media.fileName}</h3>
              <p className="text-[11px] text-slate-400">Media Asset Metadata & Inspector</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* High-Res Image View Stage */}
          <div className="lg:col-span-2 bg-slate-950 p-6 flex items-center justify-center min-h-[300px]">
            <img
              src={media.fileData || media.thumbnail}
              alt={media.fileName}
              referrerPolicy="no-referrer"
              className="max-h-[60vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
            />
          </div>

          {/* Details Sidebar */}
          <div className="p-6 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-6 flex flex-col justify-between bg-slate-900">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                File Details
              </h4>

              <div className="space-y-3 text-xs">
                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Category:</span>
                  <Badge variant="purple">{media.category || 'Uploaded Image'}</Badge>
                </div>

                {/* Source */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="font-semibold text-slate-200">{media.source || 'user_upload'}</span>
                </div>

                {/* File Size */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5 text-indigo-400" />
                    Size:
                  </span>
                  <span className="font-semibold text-white">{formatBytes(media.fileSize)}</span>
                </div>

                {/* Dimensions */}
                {media.dimensions && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Dimensions:</span>
                    <span className="font-semibold text-slate-200">
                      {media.dimensions.width} × {media.dimensions.height} px
                    </span>
                  </div>
                )}

                {/* Format */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">MIME Type:</span>
                  <span className="font-mono text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {media.fileType}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                    Uploaded:
                  </span>
                  <span className="font-semibold text-slate-300">
                    {new Date(media.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              {!showConfirmDelete ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyDataUrl}
                      leftIcon={<Copy className="h-3.5 w-3.5" />}
                    >
                      Copy Data
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleDownload}
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      Download
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    onClick={() => setShowConfirmDelete(true)}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  >
                    Delete Asset
                  </Button>
                </>
              ) : (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Confirm Delete?</span>
                  </div>
                  <p className="text-[11px] text-rose-200/80">
                    This will permanently remove this file from your IndexedDB media storage.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setShowConfirmDelete(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
