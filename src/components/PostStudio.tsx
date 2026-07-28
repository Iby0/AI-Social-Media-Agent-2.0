import React, { useState } from 'react';
import {
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Calendar,
  Send,
  Save,
  Wand2,
  Image as ImageIcon,
  Check,
  Copy,
  AlertCircle,
  Hash,
  ChevronRight,
  Sliders
} from 'lucide-react';
import { Post, SocialPlatform, ToneOfVoice, PromptTemplate } from '../types';
import { generateAIPost, generateAIImagePrompt } from '../lib/api';

interface PostStudioProps {
  onSavePost: (post: Post) => void;
  templates: PromptTemplate[];
  onLogActivity: (action: string, category: 'ai' | 'post', details: string, status?: 'success' | 'warning' | 'info' | 'error') => void;
}

export const PostStudio: React.FC<PostStudioProps> = ({ onSavePost, templates, onLogActivity }) => {
  // Input Form State
  const [topic, setTopic] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneOfVoice>('Developer / Technical');
  const [audience, setAudience] = useState('Developers & Tech Enthusiasts');
  const [callToAction, setCallToAction] = useState('Engage in comments and check out link');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'facebook',
    'instagram',
    'linkedin',
    'github',
  ]);
  const [customInstructions, setCustomInstructions] = useState('');

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Editor State
  const [title, setTitle] = useState('');
  const [captions, setCaptions] = useState<{ facebook: string; instagram: string; linkedin: string; github: string }>({
    facebook: '',
    instagram: '',
    linkedin: '',
    github: '',
  });
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGeneratingImagePrompt, setIsGeneratingImagePrompt] = useState(false);

  // Preview State
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('linkedin');
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  // Scheduling State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const TONES: ToneOfVoice[] = [
    'Professional',
    'Casual & Friendly',
    'Developer / Technical',
    'Creative & Inspirational',
    'Promotional & Energetic',
    'Humorous & Witty',
  ];

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return; // Keep at least one platform
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleApplyTemplate = (template: PromptTemplate) => {
    setTopic(template.topic);
    setSelectedTone(template.tone);
    setAudience(template.audience);
    setCallToAction(template.callToAction);
    if (template.hashtags.length > 0) {
      setHashtags(template.hashtags);
    }
  };

  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      setGenerationError('Please enter a topic or prompt for your post.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    try {
      const result = await generateAIPost({
        topic,
        tone: selectedTone,
        audience,
        callToAction,
        platforms: selectedPlatforms,
        includeHashtags: true,
        customInstructions,
      });

      setTitle(result.title || topic.slice(0, 40));
      setCaptions({
        facebook: result.captions.facebook || '',
        instagram: result.captions.instagram || '',
        linkedin: result.captions.linkedin || '',
        github: result.captions.github || '',
      });
      setHashtags(result.hashtags || []);
      setImagePrompt(result.suggestedImagePrompt || '');

      // Set fallback sample tech image based on topic
      setImageUrl(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80`);

      onLogActivity('AI Post Generated', 'ai', `Generated multi-platform captions for topic: "${topic.slice(0, 30)}..."`, 'success');
      showToast('AI Post generated successfully!');
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Failed to generate post using Gemini API.');
      onLogActivity('AI Generation Error', 'ai', err.message || 'Unknown error during AI generation', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImagePromptOnly = async () => {
    const currentCaption = captions[previewPlatform] || topic;
    if (!currentCaption) return;

    setIsGeneratingImagePrompt(true);
    try {
      const res = await generateAIImagePrompt(currentCaption, 'Futuristic Tech & Modern Graphics');
      setImagePrompt(res.imagePrompt);
      onLogActivity('AI Visual Prompt Created', 'ai', 'Generated visual prompt concept.', 'info');
      showToast('Visual prompt generated!');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingImagePrompt(false);
    }
  };

  const handleCopyCaption = (plat: SocialPlatform) => {
    const textToCopy = captions[plat] || '';
    const fullText = textToCopy + '\n\n' + hashtags.join(' ');
    navigator.clipboard.writeText(fullText);
    setCopiedPlatform(plat);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const handleSave = (status: Post['status']) => {
    if (!title.trim()) {
      showToast('Please specify a title for the post');
      return;
    }

    const newPost: Post = {
      id: 'post_' + Date.now(),
      title,
      topic,
      tone: selectedTone,
      audience,
      captions,
      hashtags,
      imagePrompt,
      imageUrl,
      selectedPlatforms,
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledDateTime).toISOString() : undefined,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: status === 'published' ? { impressions: 0, likes: 0, shares: 0, comments: 0 } : undefined,
    };

    onSavePost(newPost);
    onLogActivity(
      status === 'published' ? 'Post Published' : status === 'scheduled' ? 'Post Scheduled' : 'Draft Saved',
      'post',
      `Post "${title}" saved with status [${status.toUpperCase()}]`,
      'success'
    );
    showToast(`Post successfully ${status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved as draft'}!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-xl border border-indigo-500/50 shadow-2xl flex items-center gap-3 animate-bounce">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">AI Social Content Studio</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Gemini 3.6 Flash Powered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate, customize, and preview posts tailored for Facebook, Instagram, LinkedIn, and GitHub simultaneously.
          </p>
        </div>

        {/* Saved Templates Quick Inject */}
        {templates.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Load Template:</span>
            <select
              onChange={(e) => {
                const found = templates.find((t) => t.id === e.target.value);
                if (found) handleApplyTemplate(found);
              }}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Select prompt template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Parameters Input Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-indigo-400" />
              Content Requirements
            </h3>
            <span className="text-[11px] text-slate-400">Step 1 of 2</span>
          </div>

          {generationError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{generationError}</span>
            </div>
          )}

          {/* Topic / Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Topic or Key Announcement <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              placeholder="e.g. Announcing our new open-source AI agent framework with real-time vector search and IndexedDB support..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Tone of Voice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tone of Voice</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTone(t)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium text-left border transition-all cursor-pointer ${
                    selectedTone === t
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Audience & CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Developers, Founders"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Call to Action</label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. Leave a comment"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Target Platforms Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Platforms</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => togglePlatform('facebook')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedPlatforms.includes('facebook')
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Facebook className="h-3.5 w-3.5 text-blue-400" /> Facebook
              </button>
              <button
                type="button"
                onClick={() => togglePlatform('instagram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedPlatforms.includes('instagram')
                    ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Instagram className="h-3.5 w-3.5 text-pink-400" /> Instagram
              </button>
              <button
                type="button"
                onClick={() => togglePlatform('linkedin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedPlatforms.includes('linkedin')
                    ? 'bg-sky-600/30 border-sky-500 text-sky-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5 text-sky-400" /> LinkedIn
              </button>
              <button
                type="button"
                onClick={() => togglePlatform('github')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedPlatforms.includes('github')
                    ? 'bg-slate-700/50 border-slate-500 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Github className="h-3.5 w-3.5 text-slate-300" /> GitHub
              </button>
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Custom AI Instructions (Optional)
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Keep sentences under 15 words, use technical jargon..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-blue-600 to-indigo-700 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Wand2 className="h-4 w-4 animate-spin text-indigo-200" />
                <span>Synthesizing Multi-Channel Posts with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-indigo-200" />
                <span>Generate Social Media Posts</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Multi-Platform Post Editor & Live Preview */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                Multi-Platform Live Preview & Editor
              </h3>
              <span className="text-[11px] text-slate-400">Step 2 of 2</span>
            </div>

            {/* Campaign / Internal Title Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Internal Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title (e.g. Agentic Workflows Launch v2)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Platform Preview Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewPlatform('facebook')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewPlatform === 'facebook' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Facebook className="h-3.5 w-3.5" /> FB
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('instagram')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewPlatform === 'instagram' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Instagram className="h-3.5 w-3.5" /> IG
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('linkedin')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewPlatform === 'linkedin' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Linkedin className="h-3.5 w-3.5" /> LinkedIn
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('github')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  previewPlatform === 'github' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Github className="h-3.5 w-3.5" /> GitHub
              </button>
            </div>

            {/* Active Platform Caption Editor & Preview Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  {previewPlatform === 'facebook' && <Facebook className="h-3.5 w-3.5 text-blue-400" />}
                  {previewPlatform === 'instagram' && <Instagram className="h-3.5 w-3.5 text-pink-400" />}
                  {previewPlatform === 'linkedin' && <Linkedin className="h-3.5 w-3.5 text-sky-400" />}
                  {previewPlatform === 'github' && <Github className="h-3.5 w-3.5 text-slate-300" />}
                  {previewPlatform} Caption Text
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyCaption(previewPlatform)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedPlatform === previewPlatform ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="h-3 w-3" /> Copied!
                    </span>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Caption
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={captions[previewPlatform] || ''}
                onChange={(e) =>
                  setCaptions({
                    ...captions,
                    [previewPlatform]: e.target.value,
                  })
                }
                rows={6}
                placeholder={`Generated ${previewPlatform} post caption will appear here...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed transition-all"
              />

              {/* Hashtag Manager Bar */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span>Hashtags ({hashtags.length})</span>
                  <button
                    type="button"
                    onClick={() => setHashtags([...hashtags, '#NewTag'])}
                    className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                  >
                    + Add Tag
                  </button>
                </label>
                <div className="flex flex-wrap gap-1.5 bg-slate-950 border border-slate-800 p-2 rounded-xl min-h-[38px]">
                  {hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs flex items-center gap-1"
                    >
                      <Hash className="h-3 w-3 text-indigo-400" />
                      <input
                        type="text"
                        value={tag.replace(/^#/, '')}
                        onChange={(e) => {
                          const updated = [...hashtags];
                          updated[idx] = '#' + e.target.value.replace(/\s+/g, '');
                          setHashtags(updated);
                        }}
                        className="bg-transparent border-none outline-none text-xs text-indigo-200 w-20"
                      />
                      <button
                        type="button"
                        onClick={() => setHashtags(hashtags.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 cursor-pointer text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {hashtags.length === 0 && (
                    <span className="text-xs text-slate-600 italic">No hashtags generated yet.</span>
                  )}
                </div>
              </div>

              {/* AI Image Prompt Section */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-indigo-400" /> AI Image Prompt Concept
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateImagePromptOnly}
                    disabled={isGeneratingImagePrompt}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className={`h-3 w-3 ${isGeneratingImagePrompt ? 'animate-spin' : ''}`} />
                    Regenerate Prompt
                  </button>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {imagePrompt || 'Generate post content first to receive AI visual prompt ideas.'}
                </p>

                {imageUrl && (
                  <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-800 aspect-video bg-slate-900">
                    <img src={imageUrl} alt="AI Visual Concept" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-900/80 backdrop-blur-sm rounded text-[10px] text-slate-300">
                      Visual Preview Mockup
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save & Schedule Controls Footer */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            {/* Scheduling Date Picker Toggle */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="schedule-toggle"
                  checked={isScheduling}
                  onChange={(e) => setIsScheduling(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="schedule-toggle" className="text-xs font-medium text-slate-300 cursor-pointer flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" /> Schedule for Future Date
                </label>
              </div>

              {isScheduling && (
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-indigo-500"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSave('draft')}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> Save as Draft
              </button>

              {isScheduling ? (
                <button
                  type="button"
                  onClick={() => handleSave('scheduled')}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5" /> Schedule Post
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Publish Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
