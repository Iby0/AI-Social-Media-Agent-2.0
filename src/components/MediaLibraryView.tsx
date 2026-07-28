import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Image as ImageIcon, Upload, Search, Trash2, Filter, Folder, ExternalLink, Sparkles } from 'lucide-react';
import { useToast } from './ui/Toast';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'graphic';
  size: string;
  uploadedAt: string;
  tags: string[];
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med_1',
    name: 'SaaS Product Showcase Banner.png',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
    type: 'image',
    size: '1.2 MB',
    uploadedAt: '2026-02-10',
    tags: ['Marketing', 'Banner', 'SaaS'],
  },
  {
    id: 'med_2',
    name: 'AI Code Assistant Preview.jpg',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    type: 'image',
    size: '850 KB',
    uploadedAt: '2026-02-12',
    tags: ['Developer', 'Code', 'AI'],
  },
  {
    id: 'med_3',
    name: 'Modern Workstation Workspace.jpg',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
    type: 'image',
    size: '2.1 MB',
    uploadedAt: '2026-02-14',
    tags: ['Office', 'Creative'],
  },
  {
    id: 'med_4',
    name: 'Social Media Growth Chart.png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    type: 'graphic',
    size: '620 KB',
    uploadedAt: '2026-02-15',
    tags: ['Analytics', 'Infographic'],
  },
];

export const MediaLibraryView: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const { addToast } = useToast();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newItem: MediaItem = {
      id: `med_${Date.now()}`,
      name: `Asset_${Math.random().toString(36).substring(2, 7)}.jpg`,
      url: newUrl.trim(),
      type: 'image',
      size: '1.5 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      tags: ['Custom', 'Uploaded'],
    };

    setMediaList([newItem, ...mediaList]);
    setNewUrl('');
    addToast('New media asset added to workspace library!', 'success');
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
    addToast('Media asset deleted', 'info');
  };

  const filtered = mediaList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(mediaList.flatMap((m) => m.tags)));

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-400" />
            <span>Media Asset Library</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manage visual image and graphic assets for your social post campaigns
          </p>
        </div>

        <Badge variant="info">
          {mediaList.length} Assets Stored
        </Badge>
      </div>

      {/* Add Media Form & Search Bar */}
      <Card variant="default">
        <CardContent className="pt-6 space-y-4">
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                leftIcon={<Upload className="h-4 w-4" />}
                required
              />
            </div>
            <Button type="submit" variant="primary" size="md" leftIcon={<Sparkles className="h-4 w-4" />}>
              Add Image Asset
            </Button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter Tag:
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTag === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No media assets found matching search criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete media asset"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.size} • {item.uploadedAt}</p>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {item.tags.map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
