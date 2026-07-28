import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Accordion } from './ui/Accordion';
import { Badge } from './ui/Badge';
import { HelpCircle, BookOpen, ShieldCheck, Sparkles, Key, Share2, Layers, CheckCircle2 } from 'lucide-react';

export const HelpView: React.FC = () => {
  const faqItems = [
    {
      id: 'faq-1',
      title: 'How does the AI Social Media Agent generate multi-platform posts?',
      content:
        'The Content Studio utilizes Gemini AI models to transform core ideas into platform-specific posts tailored for Facebook, Instagram, LinkedIn, X (Twitter), and GitHub, complete with automated hashtags and tone adjustments.',
    },
    {
      id: 'faq-2',
      title: 'Where is my workspace data saved?',
      content:
        'All posts, channel connections, custom prompt templates, activity logs, and settings are securely persisted in your browser via IndexedDB storage. You can perform full JSON backups in Settings.',
    },
    {
      id: 'faq-3',
      title: 'How does the background auto-scheduler engine work?',
      content:
        'The background scheduler automatically monitors your scheduled posts every 15 seconds. Once a post reaches its target date and time, the auto-publisher updates its status to "published" and logs the activity in system history.',
    },
    {
      id: 'faq-4',
      title: 'How do OAuth social channel connections work?',
      content:
        'Social channels (Facebook, Instagram, LinkedIn, GitHub) can be connected using real OAuth authorization popups. API access tokens and handles are stored securely in browser state.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-400" />
            <span>Help & Documentation Center</span>
          </h2>
          <p className="text-xs text-slate-400">
            User guides, platform architecture overview, and operational documentation
          </p>
        </div>

        <Badge variant="success" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
          Module 06 Verified
        </Badge>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="gradient">
          <CardHeader>
            <Sparkles className="h-5 w-5 text-indigo-400 mb-1" />
            <CardTitle className="text-sm">1. Content Generator</CardTitle>
            <CardDescription className="text-xs">
              Use custom prompt templates, AI tone selector, and media preview to compose posts.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card variant="gradient">
          <CardHeader>
            <Share2 className="h-5 w-5 text-cyan-400 mb-1" />
            <CardTitle className="text-sm">2. Social Channels</CardTitle>
            <CardDescription className="text-xs">
              Link OAuth accounts or manage API tokens across social networks.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card variant="gradient">
          <CardHeader>
            <Layers className="h-5 w-5 text-emerald-400 mb-1" />
            <CardTitle className="text-sm">3. Calendar Scheduler</CardTitle>
            <CardDescription className="text-xs">
              Drag-and-drop or set schedule timestamps for automatic background publishing.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
          <CardDescription>
            Common operational questions regarding AI Studio features
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion items={faqItems} />
        </CardContent>
      </Card>
    </div>
  );
};
