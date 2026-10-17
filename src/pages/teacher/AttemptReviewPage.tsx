import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  MessageSquare, 
  Sparkles, 
  RefreshCw 
} from 'lucide-react';
import { examService } from '../../services/examService';
import { proctoringService } from '../../services/proctoringService';
import { RiskBadge } from '../../components/proctoring/RiskBadge';
import { EventTimeline } from '../../components/proctoring/EventTimeline';
import { formatDate, formatDuration } from '../../utils/formatters';
import type { StudentAttempt } from '../../types';

export const AttemptReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const studentQuery = searchParams.get('student') || '';

  const [attempts, setAttempts] = useState<StudentAttempt[]>(() => examService.getAttempts());
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(() => {
    const list = examService.getAttempts();
    if (studentQuery) {
      const match = list.find(a => a.studentName.toLowerCase().includes(studentQuery.toLowerCase()));
      if (match) return match.id;
    }
    return list.length > 0 ? list[0].id : null;
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [searchFilter, setSearchFilter] = useState(studentQuery);
  const [teacherNotes, setTeacherNotes] = useState(() => {
    const list = examService.getAttempts();
    const first = list.find(a => a.id === selectedAttemptId) || list[0];
    return first?.reviewNotes || '';
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const [prevSelectedId, setPrevSelectedId] = useState(selectedAttemptId);
  const selectedAttempt = attempts.find(a => a.id === selectedAttemptId) || attempts[0];

  if (selectedAttemptId !== prevSelectedId) {
    setPrevSelectedId(selectedAttemptId);
    setTeacherNotes(selectedAttempt?.reviewNotes || '');
  }

  const [prevStudentQuery, setPrevStudentQuery] = useState(studentQuery);
  if (studentQuery !== prevStudentQuery) {
    setPrevStudentQuery(studentQuery);
    setSearchFilter(studentQuery);
    const match = attempts.find(a => a.studentName.toLowerCase().includes(studentQuery.toLowerCase()));
    if (match) {
      setSelectedAttemptId(match.id);
    }
  }

  const loadData = () => {
    const list = examService.getAttempts();
    setAttempts(list);
  };

  // Filter list
  const filteredAttempts = attempts.filter(att => {
    if (filterStatus === 'pending' && att.reviewed) return false;
    if (filterStatus === 'reviewed' && !att.reviewed) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchName = att.studentName.toLowerCase().includes(q);
      const matchExam = att.examTitle.toLowerCase().includes(q);
      if (!matchName && !matchExam) return false;
    }
    return true;
  });

  const handleReviewDecision = (decision: 'valid' | 'false_alarm') => {
    if (!selectedAttempt) return;

    examService.updateAttemptReview(selectedAttempt.id, decision, teacherNotes);
    loadData();

    setFeedbackMessage(
      decision === 'valid'
        ? `Attempt by ${selectedAttempt.studentName} marked as a Valid Academic Infraction.`
        : `Attempt by ${selectedAttempt.studentName} cleared as False Alarm / Innocent Behavior.`
    );

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
            Instructor Audit & Review
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Flagged Candidate Attempt Reviews
          </h2>
          <p className="text-xs text-slate-500">
            Human invigilators make final decisions on computer-vision behavioral anomalies. AI flags are advisory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Decisions saved locally</span>
          </span>
          <button
            onClick={loadData}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh attempts"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search by student name or exam title..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider mr-1">
            Status:
          </span>
          {(['all', 'pending', 'reviewed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Review Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Submissions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">
            <span>Submissions ({filteredAttempts.length})</span>
            <span className="text-[11px] text-slate-400">Risk-ordered</span>
          </div>

          <div className="space-y-2.5">
            {filteredAttempts.map(att => {
              const isSelected = selectedAttempt?.id === att.id;

              return (
                <div
                  key={att.id}
                  onClick={() => setSelectedAttemptId(att.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">
                        {att.studentName}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{att.examTitle}</p>
                    </div>

                    <RiskBadge score={att.riskScore} level={att.riskLevel} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500 font-mono">
                      {formatDate(att.startedAt)}
                    </span>

                    {att.reviewed ? (
                      <span className={`font-semibold flex items-center gap-1 ${
                        att.reviewDecision === 'valid' ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {att.reviewDecision === 'valid' ? 'Confirmed' : 'Cleared'}
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[10px]">
                        Pending Review
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 Cols): Selected Candidate Deep Dive */}
        <div className="lg:col-span-2 space-y-4">
          {selectedAttempt ? (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedAttempt.studentName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({selectedAttempt.studentEmail})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedAttempt.examTitle} • Attempt ID: {selectedAttempt.id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge score={selectedAttempt.riskScore} level={selectedAttempt.riskLevel} size="md" />
                </div>
              </div>

              {/* Attempt Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Total Duration</span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                    {formatDuration(selectedAttempt.durationSeconds)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Raw Score</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {selectedAttempt.score !== undefined ? `${selectedAttempt.score} pts` : 'Pending'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Flagged Incidents</span>
                  <span className="font-semibold text-rose-600 mt-0.5 block font-mono">
                    {selectedAttempt.events.length} Events
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Audit Verdict</span>
                  <span className="font-semibold mt-0.5 block">
                    {selectedAttempt.reviewed ? (
                      selectedAttempt.reviewDecision === 'valid' ? (
                        <span className="text-rose-600">Valid Infraction</span>
                      ) : (
                        <span className="text-emerald-600">False Alarm Cleared</span>
                      )
                    ) : (
                      <span className="text-amber-600">Awaiting Decision</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Flagged Incidents Event Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Recorded Computer Vision Incidents ({selectedAttempt.events.length})
                </h4>

                <EventTimeline
                  events={selectedAttempt.events}
                  onReview={(eventId, decision) => {
                    proctoringService.markEventStatus(eventId, decision);
                    loadData();
                  }}
                />
              </div>

              {/* Teacher Decision Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Official Invigilator Verdict & Justification
                </h4>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Auditor Notes (optional context or explanation):
                  </label>
                  <textarea
                    value={teacherNotes}
                    onChange={e => setTeacherNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Reviewed secondary gaze pattern; was looking at scratch paper for math computation..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-500">
                    Decision immediately persists and updates risk metrics.
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReviewDecision('false_alarm')}
                      className="px-3.5 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark False Alarm (Clear)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReviewDecision('valid')}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Confirm Valid Infraction</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Select a candidate from the left panel to review their proctoring audit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttemptReviewPage;
