import React from 'react';
import type { ProctoringEvent } from '../../types';
import { 
  UserMinus, 
  Users, 
  ExternalLink, 
  Eye, 
  VideoOff, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { formatTime, getEventTypeLabel } from '../../utils/formatters';

interface EventTimelineProps {
  events: ProctoringEvent[];
  onReview?: (eventId: string, status: 'reviewed_valid' | 'reviewed_false_alarm') => void;
  maxItems?: number;
  compact?: boolean;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  onReview,
  maxItems,
  compact = false
}) => {
  const displayedEvents = maxItems ? events.slice(0, maxItems) : events;

  const getEventIcon = (type: ProctoringEvent['type']) => {
    switch (type) {
      case 'NO_FACE':
        return <UserMinus className="w-4 h-4 text-amber-500" />;
      case 'MULTIPLE_FACES':
        return <Users className="w-4 h-4 text-rose-500" />;
      case 'TAB_SWITCH':
        return <ExternalLink className="w-4 h-4 text-indigo-500" />;
      case 'HEAD_TURNED':
        return <Eye className="w-4 h-4 text-orange-500" />;
      case 'CAMERA_DISCONNECTED':
        return <VideoOff className="w-4 h-4 text-slate-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getSeverityBadge = (severity: ProctoringEvent['severity']) => {
    switch (severity) {
      case 'LOW':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400">
        <CheckCircle className="w-8 h-8 text-emerald-500/70 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600">No suspicious events detected</p>
        <p className="text-xs text-slate-400 mt-0.5">High integrity maintained throughout the session.</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {displayedEvents.map((event, idx) => {
          const isLast = idx === displayedEvents.length - 1;

          return (
            <li key={event.id} className="relative pb-6">
              {!isLast && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-start space-x-3">
                {/* Icon wrapper */}
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    {getEventIcon(event.type)}
                  </div>
                </div>

                {/* Event Content */}
                <div className="min-w-0 flex-1 bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">
                        {getEventTypeLabel(event.type)}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border ${getSeverityBadge(
                          event.severity
                        )}`}
                      >
                        {event.severity}
                      </span>
                    </div>

                    <div className="flex items-center text-[11px] text-slate-400 gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(event.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {event.description}
                    {event.durationSeconds && (
                      <span className="font-semibold text-slate-700 ml-1">
                        ({event.durationSeconds}s sustained)
                      </span>
                    )}
                  </p>

                  {/* Snapshot thumbnail if present */}
                  {event.snapshotUrl && !compact && (
                    <div className="mb-2">
                      <div className="relative inline-block group">
                        <img
                          src={event.snapshotUrl}
                          alt="Proctoring event thumbnail"
                          className="h-16 w-24 object-cover rounded border border-slate-200 shadow-2xs"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white text-[10px]">
                          <ImageIcon className="w-3.5 h-3.5 mr-1" /> View
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status & Review Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      {event.status === 'flagged' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Pending Review
                        </span>
                      )}
                      {event.status === 'reviewed_valid' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
                          <CheckCircle className="w-3 h-3 text-rose-600" /> Valid Violation
                        </span>
                      )}
                      {event.status === 'reviewed_false_alarm' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Marked False Alarm
                        </span>
                      )}
                    </div>

                    {onReview && event.status === 'flagged' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onReview(event.id, 'reviewed_false_alarm')}
                          className="px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-300 hover:border-emerald-400 transition-colors flex items-center gap-1"
                          title="Dismiss as innocent behavior or technical noise"
                        >
                          <CheckCircle className="w-3 h-3" /> False Alarm
                        </button>
                        <button
                          onClick={() => onReview(event.id, 'reviewed_valid')}
                          className="px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50 rounded border border-rose-300 hover:border-rose-400 transition-colors flex items-center gap-1"
                          title="Confirm suspicious infraction"
                        >
                          <XCircle className="w-3 h-3" /> Confirm Valid
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EventTimeline;
