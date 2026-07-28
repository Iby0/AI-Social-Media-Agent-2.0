import React, { useState } from 'react';
import { Bookmark, Plus, Trash2, Sparkles, Hash, Layers } from 'lucide-react';
import { PromptTemplate, ToneOfVoice } from '../types';

interface TemplateManagerProps {
  templates: PromptTemplate[];
  onSaveTemplate: (template: PromptTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onUseTemplate: (template: PromptTemplate) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onSaveTemplate,
  onDeleteTemplate,
  onUseTemplate,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ToneOfVoice>('Professional');
  const [audience, setAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !topic) return;

    const newTemplate: PromptTemplate = {
      id: 'tmpl_' + Date.now(),
      name,
      description,
      topic,
      tone,
      audience: audience || 'General Community',
      callToAction: callToAction || 'Engage in comments',
      hashtags: hashtagsStr
        ? hashtagsStr.split(',').map((h) => '#' + h.trim().replace(/^#/, ''))
        : ['#AI', '#SocialMedia'],
      createdAt: new Date().toISOString(),
    };

    onSaveTemplate(newTemplate);
    setShowAddForm(false);
    setName('');
    setDescription('');
    setTopic('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-indigo-400" />
            Prompt Templates & Brand Voices
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Save reusable AI prompt structures, campaign blueprints, and tone guidelines.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Prompt Template</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-indigo-500/40 p-6 rounded-2xl space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-indigo-300">Create New Prompt Template</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Template Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekly Tech Radar"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Format for weekly developer insights..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Topic Blueprint</label>
            <textarea
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              placeholder="Topic structure..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
            >
              Save Template
            </button>
          </div>
        </form>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {tmpl.tone}
                </span>
                <button
                  onClick={() => onDeleteTemplate(tmpl.id)}
                  className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  title="Delete Template"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-white">{tmpl.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{tmpl.description || tmpl.topic}</p>

              <div className="flex flex-wrap gap-1 pt-2">
                {tmpl.hashtags.map((h, i) => (
                  <span key={i} className="text-[10px] text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onUseTemplate(tmpl)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Use in AI Studio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
