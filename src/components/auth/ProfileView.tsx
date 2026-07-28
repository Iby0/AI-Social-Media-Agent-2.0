import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
  Lock,
  Smartphone,
  Sparkles,
  Sliders,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Switch } from '../ui/Switch';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { useToast } from '../ui/Toast';

export const ProfileView: React.FC = () => {
  const { user, session, updateProfile, logout } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [defaultTone, setDefaultTone] = useState(user?.preferences?.defaultTone || 'Professional');
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(user?.preferences?.autoSaveDrafts ?? true);
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.preferences?.twoFactorEnabled ?? false);
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        email,
        avatarUrl,
        preferences: {
          ...user.preferences,
          defaultTone,
          autoSaveDrafts,
          emailNotifications,
          twoFactorEnabled,
        },
      });
      addToast('Profile & workspace preferences updated successfully!', 'success');
    } catch {
      addToast('Failed to update profile settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <Card variant="default" className="relative overflow-hidden border-slate-800">
        <div className="h-28 bg-gradient-to-r from-indigo-900/60 via-blue-900/40 to-slate-900 p-6 flex items-end justify-between">
          <Badge variant="success" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
            Verified {user.provider.toUpperCase()} Session
          </Badge>
        </div>

        <CardContent className="pt-0 -mt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar src={user.avatarUrl} fallback={user.name} size="lg" className="ring-4 ring-slate-900 shadow-xl" />
            <div className="space-y-0.5 pb-1">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut className="h-3.5 w-3.5" />}
          >
            Log Out
          </Button>
        </CardContent>
      </Card>

      {/* Main Settings Form Grid */}
      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="md:col-span-2 space-y-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-indigo-400" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your account details and profile picture
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon className="h-4 w-4" />}
                required
              />

              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Avatar Image URL"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                helperText="Provide a custom photo URL to personalize your workspace header"
              />
            </CardContent>
          </Card>

          {/* AI & Content Preferences */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <span>AI Workspace Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize default settings for post generation and draft management
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Select
                label="Default Generation Tone"
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value)}
                options={[
                  { value: 'Professional', label: 'Professional & Authoritative' },
                  { value: 'Casual & Friendly', label: 'Casual & Friendly' },
                  { value: 'Developer / Technical', label: 'Developer / Technical' },
                  { value: 'Creative & Inspirational', label: 'Creative & Inspirational' },
                  { value: 'Promotional & Energetic', label: 'Promotional & Energetic' },
                  { value: 'Humorous & Witty', label: 'Humorous & Witty' },
                ]}
              />

              <div className="pt-2 space-y-3">
                <Switch
                  label="Auto-Save AI Drafts"
                  description="Automatically persist newly generated social posts into IndexedDB"
                  checked={autoSaveDrafts}
                  onChange={setAutoSaveDrafts}
                />

                <Switch
                  label="Email Digest Notifications"
                  description="Receive scheduled publishing summaries and analytics reports"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />

                <Switch
                  label="Two-Factor Authentication (2FA)"
                  description="Require security verification code on new device sign-ins"
                  checked={twoFactorEnabled}
                  onChange={setTwoFactorEnabled}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Profile Changes
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Account Metadata & Session Info */}
        <div className="space-y-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span>Account Metadata</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">User ID</span>
                <span className="font-mono font-bold text-white text-[10px]">{user.id}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Auth Method</span>
                <Badge variant="info">{user.provider.toUpperCase()}</Badge>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Account Created</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-indigo-400" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">Last Sign-In</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-400" />
                  {new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Active Session Info */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-indigo-400" />
                <span>Active Browser Session</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Current Device
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {session?.isRemembered ? '30-Day Session' : '1-Day Session'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {session?.userAgent || 'Standard Web Browser'}
                </p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
                  <span>Expires:</span>
                  <span className="font-mono text-slate-300">
                    {session?.expiresAt ? new Date(session.expiresAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};
