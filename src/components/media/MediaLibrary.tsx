import React, { useState, useEffect } from 'react';
import { MediaRecord, MediaCategory, StorageInfo } from '../../database/types';
import { mediaAppService, MediaSortOption } from '../../services/media/media.service';
import { StorageIndicator } from './StorageIndicator';
import { UploadBox } from './UploadBox';
import { MediaSearch } from './MediaSearch';
import { MediaFilter, CategoryFilterType } from './MediaFilter';
import { MediaCard } from './MediaCard';
import { ImagePreview } from './ImagePreview';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Image as ImageIcon, UploadCloud, Plus, RefreshCw, FolderOpen } from 'lucide-react';
import { useToast } from '../ui/Toast';

export const MediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaRecord[]>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>('All');
  const [sortBy, setSortBy] = useState<MediaSortOption>('newest');

  // UI Modals
  const [showUploadBox, setShowUploadBox] = useState<boolean>(false);
  const [selectedPreviewMedia, setSelectedPreviewMedia] = useState<MediaRecord | null>(null);

  const { addToast } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await mediaAppService.seedInitialMediaIfEmpty();
      setMediaItems(items);
      const stats = await mediaAppService.getStorageStats();
      setStorageInfo(stats);
    } catch (err: any) {
      addToast('Failed to load IndexedDB media library.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadSuccess = async (file: File, category: MediaCategory) => {
    const { record, validation } = await mediaAppService.uploadFile(file, category, 'user_upload');
    if (record) {
      addToast(`Successfully uploaded "${file.name}" to Media Library`, 'success');
      setShowUploadBox(false);
      await loadData();
    } else if (validation.error) {
      addToast(validation.error, 'error');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await mediaAppService.delete(id);
      addToast('Media item deleted.', 'info');
      await loadData();
    } catch {
      addToast('Error deleting media item.', 'error');
    }
  };

  // Filter & Sort
  const filteredMedia = mediaAppService.filterAndSort(mediaItems, searchQuery, categoryFilter, sortBy);

  // Tab count calculations
  const filterCounts: Record<CategoryFilterType, number> = {
    All: mediaItems.length,
    Uploaded: mediaItems.filter((i) => i.category === 'Uploaded Image').length,
    Generated: mediaItems.filter((i) => i.category === 'AI Generated').length,
    'Post Images': mediaItems.filter((i) => i.category === 'Post Image').length,
    Temporary: mediaItems.filter((i) => i.category === 'Temporary File').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Section / Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ImageIcon className="h-6 w-6" />
            </div>
            <span>Media Library & Assets</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Offline IndexedDB file management for image uploads, AI generated graphics, and campaign attachments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="info" className="px-3 py-1.5 text-xs">
            {mediaItems.length} Total Files
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUploadBox(!showUploadBox)}
            leftIcon={showUploadBox ? <UploadCloud className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          >
            {showUploadBox ? 'Hide Upload Zone' : 'Upload New Media'}
          </Button>
        </div>
      </div>

      {/* Storage Metrics Panel */}
      <StorageIndicator
        storageInfo={storageInfo}
        totalMediaCount={mediaItems.length}
        onRefresh={loadData}
      />

      {/* Upload Zone Component */}
      {showUploadBox && (
        <div className="animate-fadeIn">
          <UploadBox
            onUploadSuccess={handleUploadSuccess}
            onCancel={() => setShowUploadBox(false)}
          />
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
        <MediaSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <MediaFilter
          activeFilter={categoryFilter}
          onFilterChange={setCategoryFilter}
          counts={filterCounts}
        />
      </div>

      {/* Media Grid Display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-400" />
          <p className="text-xs font-semibold">Opening IndexedDB storage & reading assets...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 space-y-3">
          <div className="p-3 w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <FolderOpen className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No Media Assets Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || categoryFilter !== 'All'
              ? 'No media assets match your selected filter or search query. Try clearing filters.'
              : 'Your media library is empty. Upload your first campaign image above.'}
          </p>
          {(searchQuery || categoryFilter !== 'All') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onPreview={setSelectedPreviewMedia}
              onDelete={handleDeleteMedia}
            />
          ))}
        </div>
      )}

      {/* Detailed Image Inspector Modal */}
      {selectedPreviewMedia && (
        <ImagePreview
          media={selectedPreviewMedia}
          onClose={() => setSelectedPreviewMedia(null)}
          onDelete={handleDeleteMedia}
        />
      )}
    </div>
  );
};
