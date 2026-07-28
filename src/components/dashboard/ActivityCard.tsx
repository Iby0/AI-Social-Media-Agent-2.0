import React from 'react';
import { ActivityLog } from '../../types';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { History, CheckCircle2, AlertCircle, Info, ArrowRight } from 'lucide-react';

export interface ActivityCardProps {
  logs: ActivityLog[];
  onViewAllLogs?: () => void;
  maxItems?: number;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  logs,
  onViewAllLogs,
  maxItems = 5,
}) => {
  const displayedLogs = logs.slice(0, maxItems);

  const getStatusIcon = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <Card id="dashboard-recent-activity-card" variant="default" className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-400" />
          <span>Recent Activity</span>
        </CardTitle>
        {onViewAllLogs && (
          <button
            onClick={onViewAllLogs}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </CardHeader>

      <CardContent className="space-y-3 flex-1 overflow-y-auto">
        {displayedLogs.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No recent activity recorded yet.
          </div>
        ) : (
          displayedLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{log.action}</p>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">{log.details}</p>
                  <p className="text-[10px] font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <Badge variant="neutral" className="capitalize text-[10px] shrink-0">
                {log.category}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
