import React, { useState } from 'react';
import { WorkflowState } from '../../types/workflow';
import { WorkflowCard } from './WorkflowCard';
import { useWorkflow } from '../../hooks/useWorkflow';
import {
  Layers,
  Info,
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  ListTodo,
  Send,
  CheckCheck,
  AlertOctagon,
  Archive,
  Plus,
} from 'lucide-react';

const WORKFLOW_STATES_LIST: { state: WorkflowState; label: string; icon: any; description: string }[] = [
  {
    state: 'Draft',
    label: 'Draft',
    icon: FileText,
    description: 'Initial raw post idea or user draft skeleton.',
  },
  {
    state: 'AI Generated',
    label: 'AI Generated',
    icon: Sparkles,
    description: 'AI model synthesized post captions, hashtags, and images.',
  },
  {
    state: 'Review',
    label: 'Review',
    icon: Info,
    description: 'Awaiting human feedback, quality check, and edit approval.',
  },
  {
    state: 'Approved',
    label: 'Approved',
    icon: CheckCircle2,
    description: 'Verified content approved and ready for queueing.',
  },
  {
    state: 'Ready',
    label: 'Ready',
    icon: Layers,
    description: 'All visual assets and platform formats compiled.',
  },
  {
    state: 'Scheduled',
    label: 'Scheduled',
    icon: Clock,
    description: 'Assigned to specific calendar date, time, and timezone.',
  },
  {
    state: 'Queued',
    label: 'Queued',
    icon: ListTodo,
    description: 'Enqueued in background execution queue worker.',
  },
  {
    state: 'Publishing Ready',
    label: 'Publishing Ready',
    icon: Send,
    description: 'Payload validated for platform API dispatch.',
  },
  {
    state: 'Published',
    label: 'Published',
    icon: CheckCheck,
    description: 'Placeholder state indicating workflow completed.',
  },
  {
    state: 'Failed',
    label: 'Failed',
    icon: AlertOctagon,
    description: 'Execution error caught; queued for retry backoff.',
  },
  {
    state: 'Archived',
    label: 'Archived',
    icon: Archive,
    description: 'Historical post record archived.',
  },
];

interface MockPost {
  id: string;
  title: string;
  topic: string;
  state: WorkflowState;
  updatedAt: string;
}

const SAMPLE_POSTS: MockPost[] = [
  {
    id: 'post_101',
    title: 'The Future of AI Social Agents in 2026',
    topic: 'Artificial Intelligence',
    state: 'Draft',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'post_102',
    title: 'Top 10 Microservices Architecture Best Practices',
    topic: 'Cloud Computing',
    state: 'AI Generated',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'post_103',
    title: 'React 19 & Tailwind v4 Production Patterns',
    topic: 'Web Development',
    state: 'Review',
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'post_104',
    title: 'Automating Social Media Content Schedules',
    topic: 'Automation',
    state: 'Approved',
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'post_105',
    title: 'Kubernetes Scalability Benchmark Study',
    topic: 'DevOps',
    state: 'Scheduled',
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'post_106',
    title: 'GraphQL vs REST API Performance Guide',
    topic: 'Backend Architecture',
    state: 'Queued',
    updatedAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'post_107',
    title: 'Cybersecurity Threat Intelligence Digest',
    topic: 'Security',
    state: 'Publishing Ready',
    updatedAt: new Date(Date.now() - 25200000).toISOString(),
  },
];

export const WorkflowBoard: React.FC = () => {
  const [posts, setPosts] = useState<MockPost[]>(SAMPLE_POSTS);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost: MockPost = {
      id: `post_${Date.now()}`,
      title: newPostTitle.trim(),
      topic: 'General Social Post',
      state: 'Draft',
      updatedAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
  };

  const filteredPosts = posts.filter(
    (p) => selectedStateFilter === 'all' || p.state === selectedStateFilter
  );

  return (
    <div className="space-y-6">
      {/* State Explanation Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Workflow Lifecycle Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              11 strict content states managing lifecycle from raw draft to publishing preparation.
            </p>
          </div>

          {/* Create Draft Input */}
          <form onSubmit={handleCreateDraft} className="flex items-center gap-2 self-start sm:self-auto">
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Enter new post topic or draft..."
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-52 sm:w-64"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Draft
            </button>
          </form>
        </div>

        {/* State Guide Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-3 border-t border-slate-800">
          {WORKFLOW_STATES_LIST.map((item) => {
            const Icon = item.icon;
            const count = posts.filter((p) => p.state === item.state).length;
            return (
              <div
                key={item.state}
                onClick={() => setSelectedStateFilter(selectedStateFilter === item.state ? 'all' : item.state)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedStateFilter === item.state
                    ? 'bg-blue-950/80 border-blue-500 text-white'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-200">
                    {count}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1.5 truncate">{item.label}</div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horizontal Workflow Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {WORKFLOW_STATES_LIST.map((col) => {
          const Icon = col.icon;
          const colPosts = filteredPosts.filter((p) => p.state === col.state);

          return (
            <div
              key={col.state}
              className="min-w-[280px] max-w-[280px] bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex-shrink-0 flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">{col.label}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-blue-300">
                  {colPosts.length}
                </span>
              </div>

              {/* Column Description */}
              <p className="text-[10px] text-slate-400 italic leading-snug">{col.description}</p>

              {/* Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
                {colPosts.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-slate-800/60 rounded-xl">
                    <p className="text-[11px] text-slate-500">No items in {col.label}</p>
                  </div>
                ) : (
                  colPosts.map((post) => (
                    <WorkflowCard
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      topic={post.topic}
                      currentState={post.state}
                      updatedAt={post.updatedAt}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
