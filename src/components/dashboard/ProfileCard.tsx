import React from 'react';
import { User } from '../../types/auth';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ShieldCheck, Calendar, Mail, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

export interface ProfileCardProps {
  user: User | null;
  onNavigateToProfile: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onNavigateToProfile }) => {
  if (!user) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <Avatar fallback="Guest" size="md" />
          <div>
            <h3 className="text-sm font-bold text-white">Guest Workspace User</h3>
            <p className="text-xs text-slate-400">Sign in to access persistent features</p>
          </div>
        </div>
        <Button variant="primary" size="xs" onClick={onNavigateToProfile} className="w-full">
          Sign In Account
        </Button>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-indigo-400" />
          <span>User Profile</span>
        </h3>
        <Badge variant="success" icon={<ShieldCheck className="h-3 w-3" />}>
          Verified Session
        </Badge>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Avatar src={user.avatarUrl} fallback={user.name} size="lg" className="ring-2 ring-indigo-500/40" />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
            <Mail className="h-3 w-3 text-indigo-400 shrink-0" />
            <span>{user.email}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Account Status</span>
          <p className="text-xs font-bold text-emerald-400">Active Pro</p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Member Since</span>
          <p className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-indigo-400" />
            {new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <Button
        variant="secondary"
        size="xs"
        onClick={onNavigateToProfile}
        className="w-full justify-between mt-2"
        rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
      >
        <span>Manage Profile & Security</span>
      </Button>
    </div>
  );
};
