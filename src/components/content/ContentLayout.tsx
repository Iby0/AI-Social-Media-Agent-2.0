import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Layers,
  FileEdit,
  CheckCircle2,
  CalendarClock,
  Send,
  Eye,
  RefreshCw,
  Sparkles,
  Filter,
  X,
} from 'lucide-react';
import { PostRecord, ContentPostStatus } from '../../database/types';
import { contentService } from '../../services/content/content.service';
import { PostList } from './PostList';
import { PostSearch } from './PostSearch';
import { PostFilter } from './PostFilter';
import { PostEditor } from './PostEditor';
import { PostPreview } from './PostPreview';

interface ContentLayoutProps {
  initialTab?: 'library' | 'create' | 'drafts' | 'scheduled';
  className?: string;
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  initialTab = 'library',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'create' | 'drafts' | 'scheduled' | 'published'>(
    initialTab === 'create' ? 'create' : 'library'
  );

  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Modal / Drawer state for editing and previewing
  const [editingPost, setEditingPost] = useState<Partial<PostRecord> | null>(null);
  const [previewingPost, setPreviewingPost] = useState<PostRecord | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Summary Metrics State
  const [stats, setStats] = useState({
    total: 0,
    drafts: 0,
    review: 0,
    ready: 0,
    scheduled: 0,
    published: 0,
    failed: 0,
    archived: 0,
  });

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);

      // Status filter based on tab if not explicitly overridden
      let statusFilter = selectedStatus;
      if (activeTab === 'drafts') statusFilter = 'Draft';
      if (activeTab === 'scheduled') statusFilter = 'Scheduled';
      if (activeTab === 'published') statusFilter = 'Published';

      const data = await contentService.getPosts({
        status: statusFilter,
        category: selectedCategory,
        platform: selectedPlatform,
        searchQuery,
        sortBy,
      });

      setPosts(data);

      const metricStats = await contentService.getPostStats();
      setStats(metricStats);
    } catch (err) {
      console.error('Error loading content posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedStatus, selectedCategory, selectedPlatform, searchQuery, sortBy]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreateNew = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (post: PostRecord) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handlePreview = (post: PostRecord) => {
    setPreviewingPost(post);
  };

  const handleDuplicate = async (post: PostRecord) => {
    try {
      await contentService.duplicatePost(post.id);
      await loadPosts();
    } catch (err) {
      console.error('Failed to duplicate post:', err);
    }
  };

  const handleDelete = async (post: PostRecord) => {
    if (confirm(`Are you sure you want to delete post "${post.title}"?`)) {
      try {
        await contentService.deletePost(post.id);
        await loadPosts();
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleSavePost = async (
    postData: Partial<PostRecord>,
    targetStatus: ContentPostStatus
  ) => {
    if (postData.id) {
      await contentService.updatePost(postData.id, { ...postData, status: targetStatus });
    } else {
      await contentService.createPost({
        title: postData.title || 'Untitled',
        caption: postData.caption || '',
        ...postData,
        status: targetStatus,
      });
    }

    setIsEditorOpen(false);
    setEditingPost(null);
    await loadPosts();
  };

  return (
    <div className={`p-4 md:p-8 space-y-6 max-w-7xl mx-auto text-slate-100 ${className}`}>
      {/* Top Main Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Module 11
            </span>
            <span className="text-xs text-slate-400">Content Management System</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Content Foundation Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Central repository for creating, managing, tagging, and organizing social media content prior to AI generation and release scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadPosts}
            className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors"
            title="Refresh list"
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Create New Post</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Layers size={18} />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-100">{stats.total}</div>
            <div className="text-[11px] font-medium text-slate-400">Total Content</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="p-2.5 rounded-lg bg-slate-500/10 text-slate-400">
            <FileEdit size={18} />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-100">{stats.drafts}</div>
            <div className="text-[11px] font-medium text-slate-400">Draft Ideas</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-100">{stats.ready}</div>
            <div className="text-[11px] font-medium text-slate-400">Ready for Queue</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shadow-md">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <CalendarClock size={18} />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-100">{stats.scheduled}</div>
            <div className="text-[11px] font-medium text-slate-400">Scheduled</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3 shadow-md col-span-2 sm:col-span-1">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-300">
            <Send size={18} />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-100">{stats.published}</div>
            <div className="text-[11px] font-medium text-slate-400">Published</div>
          </div>
        </div>
      </div>

      {/* Editor Modal Overlay */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md overflow-y-auto p-4 md:p-8 flex items-center justify-center">
          <div className="w-full max-w-5xl my-auto">
            <PostEditor
              initialPost={editingPost}
              onSave={handleSavePost}
              onCancel={() => {
                setIsEditorOpen(false);
                setEditingPost(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Preview Modal Overlay */}
      {previewingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 md:p-8 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Eye size={16} className="text-indigo-400" />
                Live Social Network Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreviewingPost(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <PostPreview post={previewingPost} activePlatform={previewingPost.platform} />

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const postToEdit = previewingPost;
                  setPreviewingPost(null);
                  handleEdit(postToEdit);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Edit Post
              </button>
              <button
                type="button"
                onClick={() => setPreviewingPost(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab('library');
            setSelectedStatus('All');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'library'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText size={15} /> Content Library
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('drafts');
            setSelectedStatus('Draft');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'drafts'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileEdit size={15} /> Draft Ideas ({stats.drafts})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scheduled');
            setSelectedStatus('Scheduled');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'scheduled'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CalendarClock size={15} /> Scheduled ({stats.scheduled})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('published');
            setSelectedStatus('Published');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'published'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Send size={15} /> Published ({stats.published})
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <PostSearch value={searchQuery} onChange={setSearchQuery} />

        <PostFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Post List */}
      <PostList
        posts={posts}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
        isLoading={isLoading}
      />
    </div>
  );
};
