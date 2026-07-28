import React, { useState } from 'react';
import { LayoutGrid, List, Plus, FileText, CheckSquare, Square, Trash2, Tag, Globe } from 'lucide-react';
import { PostRecord, ContentPostStatus } from '../../database/types';
import { PostCard } from './PostCard';
import { StatusBadge } from './StatusBadge';

interface PostListProps {
  posts: PostRecord[];
  onEdit: (post: PostRecord) => void;
  onPreview: (post: PostRecord) => void;
  onDuplicate: (post: PostRecord) => void;
  onDelete: (post: PostRecord) => void;
  onCreateNew: () => void;
  onStatusChange?: (post: PostRecord, newStatus: ContentPostStatus) => void;
  isLoading?: boolean;
  className?: string;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  onEdit,
  onPreview,
  onDuplicate,
  onDelete,
  onCreateNew,
  onStatusChange,
  isLoading = false,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected post(s)?`)) {
      selectedIds.forEach((id) => {
        const found = posts.find((p) => p.id === id);
        if (found) onDelete(found);
      });
      setSelectedIds([]);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading Content Library...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 my-6">
        <div className="w-14 h-14 rounded-full bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
          <FileText size={28} />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="font-semibold text-slate-200 text-base">No content found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No posts match your current search query or filter settings. Create a new post to get started!
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
        >
          <Plus size={16} /> Create New Post
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* View Switcher & Selection Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">
            Showing <strong className="text-slate-200">{posts.length}</strong> post(s)
          </span>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <span className="text-xs font-semibold text-indigo-400">
                {selectedIds.length} selected
              </span>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-950/50 hover:bg-rose-900/60 rounded-lg border border-rose-800/40 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Delete Selected
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              viewMode === 'table'
                ? 'bg-slate-800 text-indigo-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List Table View"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={onEdit}
              onPreview={onPreview}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3 w-8 text-center">
                    <button type="button" onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-200">
                      {selectedIds.length === posts.length && posts.length > 0 ? (
                        <CheckSquare size={14} className="text-indigo-400" />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>
                  </th>
                  <th className="p-3">Title & Caption</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {posts.map((post) => {
                  const isSelected = selectedIds.includes(post.id);
                  return (
                    <tr
                      key={post.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelect(post.id)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare size={14} className="text-indigo-400" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-100 text-xs line-clamp-1">
                          {post.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {post.caption}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          <Tag size={10} />
                          {post.category || 'Technology'}
                        </span>
                      </td>
                      <td className="p-3 capitalize font-medium text-slate-300">
                        {post.platform}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={post.status} size="sm" />
                      </td>
                      <td className="p-3 text-[11px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onPreview(post)}
                            className="p-1 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800"
                            title="Preview"
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(post)}
                            className="p-1 text-indigo-400 font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(post)}
                            className="p-1 text-rose-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
