import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  ArrowUpRight, 
  Sliders 
} from 'lucide-react';
import { examService } from '../../services/examService';
import { proctoringService } from '../../services/proctoringService';
import { RiskBadge } from '../../components/proctoring/RiskBadge';
import { EventTimeline } from '../../components/proctoring/EventTimeline';
import { formatDuration, getEventTypeLabel } from '../../utils/formatters';
import type { StudentAttempt, Exam } from '../../types';

export const LiveInvigilationPage: React.FC = () => {
  const [attempts, setAttempts] = useState<StudentAttempt[]>(() => examService.getAttempts());
  const [exams, setExams] = useState<Exam[]>(() => examService.getExams());
  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(() => {
    const list = examService.getAttempts();
    return list.length > 0 ? list[0].id : null;
  });
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const refreshData = React.useCallback(() => {
    setAttempts(examService.getAttempts());
    setExams(examService.getExams());
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshData, 4000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Filter attempts
  const filteredAttempts = attempts.filter(att => {
    if (selectedExamId !== 'all' && att.examId !== selectedExamId) return false;
    if (filterRisk === 'high' && att.riskLevel !== 'HIGH' && att.riskLevel !== 'CRITICAL') return false;
    if (filterRisk === 'medium' && att.riskLevel !== 'MEDIUM') return false;
    if (filterRisk === 'low' && att.riskLevel !== 'LOW') return false;
    return true;
  });

  const activeAttempt = attempts.find(a => a.id === selectedAttemptId) || filteredAttempts[0];

  // Quick live event injection to demonstrate real-time invigilation update
  const handleSimulateLiveIncident = () => {
    const list = examService.getAttempts();
    const current = list.find(a => a.id === selectedAttemptId) || list[0];
    if (!current) return;
    const sampleTypes = ['NO_FACE', 'MULTIPLE_FACES', 'TAB_SWITCH', 'HEAD_TURNED'] as const;
    const now = Date.now();
    const index = Math.floor((now % 1000) / 250);
    const chosenType = sampleTypes[index];

    examService.recordAttemptEvent(current.id, {
      attemptId: current.id,
      studentName: current.studentName,
      examId: current.examId,
      type: chosenType,
      severity: chosenType === 'MULTIPLE_FACES' ? 'HIGH' : 'MEDIUM',
      timestamp: new Date().toISOString(),
      durationSeconds: 4,
      description: `Live Alert: On-device event detected during active invigilation (${getEventTypeLabel(chosenType)})`
    });
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Live Invigilation Monitor
            </span>
            <span className="text-xs text-slate-400 font-mono">
              • Simulated / Active Network Feed
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Real-Time Integrity Supervision
          </h2>
          <p className="text-xs text-slate-500">
            Monitoring active exam sessions with client-side telemetry events and zero raw video cloud upload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulateLiveIncident}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Simulate an incoming live violation for the selected candidate"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Simulate Live Incident</span>
          </button>

          <Link
            to="/teacher/rules"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Rules</span>
          </Link>

          <button
            onClick={refreshData}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 font-semibold uppercase text-[10px] tracking-wider">
            <Filter className="w-3 h-3" /> Filter Exam:
          </span>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Examinations ({exams.length})</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider mr-1">
            Risk Filter:
          </span>
          {['all', 'high', 'medium', 'low'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors text-xs font-medium ${
                filterRisk === r
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Invigilation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Candidate Cards List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider px-1">
            <span>Enrolled Candidates ({filteredAttempts.length})</span>
            <span className="text-[11px] text-teal-600 font-mono">Live Grid</span>
          </div>

          <div className="space-y-2.5">
            {filteredAttempts.map(att => {
              const isSelected = activeAttempt?.id === att.id;
              const hasEvents = att.events.length > 0;

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
                      <h4 className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                        {att.studentName}
                        {att.status === 'in-progress' && (
                          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{att.examTitle}</p>
                    </div>

                    <RiskBadge score={att.riskScore} level={att.riskLevel} size="sm" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDuration(att.durationSeconds)} elapsed
                    </span>
                    <span className={`font-semibold ${hasEvents ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {att.events.length} {att.events.length === 1 ? 'flag' : 'flags'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 Cols): Selected Candidate Live Feed & Event Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {activeAttempt ? (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 space-y-5">
              {/* Candidate Info Header */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {activeAttempt.studentName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {activeAttempt.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeAttempt.examTitle} • Session: {activeAttempt.status.toUpperCase()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge score={activeAttempt.riskScore} level={activeAttempt.riskLevel} size="md" />
                  <Link
                    to={`/teacher/reviews?student=${encodeURIComponent(activeAttempt.studentName)}`}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Full Audit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Live Status Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Elapsed Time</span>
                  <span className="font-semibold text-slate-800 font-mono mt-0.5 block">
                    {formatDuration(activeAttempt.durationSeconds)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Questions Answered</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {Object.keys(activeAttempt.answers || {}).length} Submitted
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Flagged Incidents</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {activeAttempt.events.length} Logged
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block">Invigilation Status</span>
                  <span className="font-semibold text-teal-600 mt-0.5 block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Real-time active
                  </span>
                </div>
              </div>

              {/* Event Stream Timeline */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Incident Timeline for {activeAttempt.studentName}</span>
                  <span className="text-[11px] text-slate-400">Chronological</span>
                </h4>

                <EventTimeline
                  events={activeAttempt.events}
                  onReview={(eventId, decision) => {
                    proctoringService.markEventStatus(eventId, decision);
                    refreshData();
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              No active candidates match your filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveInvigilationPage;
