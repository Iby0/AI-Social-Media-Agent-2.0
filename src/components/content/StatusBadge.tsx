import React from 'react';
import {
  FileEdit,
  Eye,
  CheckCircle2,
  CalendarClock,
  Loader2,
  Send,
  AlertTriangle,
  Archive,
} from 'lucide-react';
import { ContentPostStatus } from '../../database/types';
import { STATUS_DEFINITIONS, normalizePostStatus } from '../../services/content/content.utils';

interface StatusBadgeProps {
  status: ContentPostStatus | string;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status: rawStatus,
  showDescription = false,
  size = 'md',
  className = '',
}) => {
  const status = normalizePostStatus(rawStatus);
  const meta = STATUS_DEFINITIONS[status] || STATUS_DEFINITIONS.Draft;

  const renderIcon = () => {
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
    switch (status) {
      case 'Draft':
        return <FileEdit size={iconSize} className="shrink-0" />;
      case 'Review':
        return <Eye size={iconSize} className="shrink-0 text-amber-400" />;
      case 'Ready':
        return <CheckCircle2 size={iconSize} className="shrink-0 text-emerald-400" />;
      case 'Scheduled':
        return <CalendarClock size={iconSize} className="shrink-0 text-blue-400" />;
      case 'Publishing':
        return <Loader2 size={iconSize} className="shrink-0 animate-spin text-indigo-400" />;
      case 'Published':
        return <Send size={iconSize} className="shrink-0 text-teal-300" />;
      case 'Failed':
        return <AlertTriangle size={iconSize} className="shrink-0 text-rose-400" />;
      case 'Archived':
        return <Archive size={iconSize} className="shrink-0 text-slate-400" />;
      default:
        return <FileEdit size={iconSize} className="shrink-0" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2',
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        id={`status-badge-${status.toLowerCase()}`}
        className={`inline-flex items-center rounded-full border backdrop-blur-sm transition-all ${meta.badgeClass} ${sizeClasses[size]} ${className}`}
        title={meta.description}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
        {renderIcon()}
        <span>{meta.label}</span>
      </span>
      {showDescription && (
        <p className="text-[11px] text-slate-400 leading-tight max-w-xs">{meta.description}</p>
      )}
    </div>
  );
};
