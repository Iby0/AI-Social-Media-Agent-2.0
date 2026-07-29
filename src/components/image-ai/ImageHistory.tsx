import React, { useState } from 'react';
import { useImageAIContext } from '../../context/ImageAIContext';
import { ImageOutputModel } from '../../types/image-ai';
import {
  History,
  Trash2,
  Download,
  Search,
  Filter,
  Layers,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ImageHistoryProps {
  onSelectImage?: (item: ImageOutputModel) => void;
}

export const ImageHistory: React.FC<ImageHistoryProps> = ({ onSelectImage }) => {
  const { history, deleteHistoryItem, clearHistory, setLatestOutput } = useImageAIContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [previewModalItem, setPreviewModalItem] = useState<ImageOutputModel | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesQuery =
      !searchQuery ||
      item.promptUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.imageType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStyle = filterStyle === 'all' || item.style === filterStyle;

    return matchesQuery && matchesStyle;
  });

  const handleDownload = (e: React.MouseEvent, item: ImageOutputModel) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.imageUrl;
    link.download = `${item.platform}_${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteHistoryItem(id);
    if (previewModalItem?.id === id) {
      setPreviewModalItem(null);
    }
  };

  const handleSelect = (item: ImageOutputModel) => {
    setLatestOutput(item);
    if (onSelectImage) {
      onSelectImage(item);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-xl backdrop-blur-md">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            Generated Image History (IndexedDB Storage)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {history.length} saved visual assets stored locally in your browser.
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All History
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by keyword, platform, style..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Styles</option>
              <option value="Minimal">Minimal</option>
              <option value="Corporate">Corporate</option>
              <option value="Technology">Technology</option>
              <option value="Creative">Creative</option>
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
              <option value="Gradient">Gradient</option>
            </select>
          </div>
        </div>
      )}

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No Generated Image Assets Found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {history.length === 0
              ? 'Generate your first social media graphic above to save it to local IndexedDB storage.'
              : 'No results match your search query or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="group relative bg-slate-950 border border-slate-800 hover:border-blue-500/60 rounded-xl overflow-hidden p-3 space-y-2.5 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.promptUsed}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[10px] font-bold uppercase text-blue-300">
                  {item.platform}
                </div>

                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md border border-slate-700 text-[10px] font-medium text-slate-300">
                  {item.aspectRatio}
                </div>
              </div>

              {/* Title / Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="truncate max-w-[150px]">{item.imageType}</span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                  {item.promptUsed}
                </p>
              </div>

              {/* Card Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewModalItem(item);
                  }}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Inspect
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleDownload(e, item)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                    title="Download Image"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-red-400 border border-slate-800 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setPreviewModalItem(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {previewModalItem.imageType} ({previewModalItem.platform.toUpperCase()})
            </h3>

            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
              <img
                src={previewModalItem.imageUrl}
                alt={previewModalItem.promptUsed}
                className="max-h-[350px] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="text-xs space-y-2 text-slate-300">
              <p>
                <strong className="text-blue-400">Prompt:</strong> {previewModalItem.promptUsed}
              </p>
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>Dimensions: {previewModalItem.dimensions.width} &times; {previewModalItem.dimensions.height}</span>
                <span>Style: {previewModalItem.style}</span>
                <span>Provider: {previewModalItem.provider}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleSelect(previewModalItem);
                  setPreviewModalItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Load Output into Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
