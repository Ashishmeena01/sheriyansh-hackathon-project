import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Video, 
  FileCheck2, 
  Sliders, 
  ShieldAlert, 
  Users, 
  FileText, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { examService } from '../../services/examService';
import { proctoringService } from '../../services/proctoringService';
import { RiskBadge } from '../../components/proctoring/RiskBadge';
import { formatTime, getEventTypeLabel } from '../../utils/formatters';
import type { Exam, StudentAttempt, ProctoringEvent } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const [exams] = useState<Exam[]>(() => examService.getExams());
  const [attempts] = useState<StudentAttempt[]>(() => examService.getAttempts());
  const [recentEvents] = useState<ProctoringEvent[]>(() => 
    proctoringService.getAllEvents().slice(0, 5)
  );

  const activeAttempts = attempts.filter(a => a.status === 'in-progress');
  const pendingReviewAttempts = attempts.filter(a => a.reviewed === false && a.events.length > 0);
  const reviewedAttempts = attempts.filter(a => a.reviewed === true);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Privacy-Preserving Proctoring Command</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Teacher Invigilation Dashboard
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Monitor live exam integrity, review flagged behavioral anomalies, and manage exam configurations with 100% on-device AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/teacher/create-exam"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Exam</span>
            </Link>
            <Link
              to="/teacher/invigilation"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <Video className="w-4 h-4 text-teal-400" />
              <span>Live Invigilation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Exams */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Exams</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{exams.length}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Shared with Student Dashboard
          </p>
        </div>

        {/* Card 2: Active Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Students</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{activeAttempts.length}</span>
            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> Live Stream
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Simulated & student sessions
          </p>
        </div>

        {/* Card 3: Pending Alerts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Reviews</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{pendingReviewAttempts.length}</span>
            <Link
              to="/teacher/reviews"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              Review all <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Requires human invigilator verdict
          </p>
        </div>

        {/* Card 4: Reviewed Decisions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Reviewed Cases</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{reviewedAttempts.length}</span>
            <span className="text-xs font-medium text-slate-500">
              {attempts.length > 0 ? Math.round((reviewedAttempts.length / attempts.length) * 100) : 0}% processed
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Decisions stored in local state
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Suspicious Activity & Active Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recent Suspicious Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                Recent Suspicious Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest anomalies detected by on-device computer vision models
              </p>
            </div>
            <Link
              to="/teacher/reviews"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
            >
              <span>View Full Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No recent proctoring incidents logged.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-600 uppercase text-[10px] tracking-wider">
                    <th className="pb-2.5 font-semibold">Student</th>
                    <th className="pb-2.5 font-semibold">Incident Type</th>
                    <th className="pb-2.5 font-semibold">Severity</th>
                    <th className="pb-2.5 font-semibold">Time</th>
                    <th className="pb-2.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEvents.map(event => (
                    <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-medium text-slate-900">
                        {event.studentName}
                      </td>
                      <td className="py-3 text-slate-600">
                        <div className="font-medium text-slate-800">
                          {getEventTypeLabel(event.type)}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">
                          {event.description}
                        </div>
                      </td>
                      <td className="py-3">
                        <RiskBadge score={0} level={event.severity} size="sm" showScore={false} />
                      </td>
                      <td className="py-3 text-slate-600 font-mono text-[11px]">
                        {formatTime(event.timestamp)}
                      </td>
                      <td className="py-3 text-right">
                        {event.status === 'flagged' && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                        {event.status === 'reviewed_valid' && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Valid
                          </span>
                        )}
                        {event.status === 'reviewed_false_alarm' && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Quick Navigation & Exam Summary */}
        <div className="space-y-4">
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Invigilator Controls
            </h3>
            <div className="space-y-2">
              <Link
                to="/teacher/create-exam"
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-indigo-600" />
                  <span>Create Assessment</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </Link>

              <Link
                to="/teacher/invigilation"
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-teal-600" />
                  <span>Real-time Invigilation</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
              </Link>

              <Link
                to="/teacher/reviews"
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  <span>Review Submissions</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
              </Link>

              <Link
                to="/teacher/rules"
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors text-xs font-medium text-slate-700 group"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  <span>Tune Sensitivity Rules</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
              </Link>
            </div>
          </div>

          {/* Published Exams Snippet */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Exams ({exams.length})
              </h3>
              <Link to="/teacher/create-exam" className="text-xs font-medium text-indigo-600 hover:underline">
                + New
              </Link>
            </div>

            <div className="space-y-2.5">
              {exams.map(exam => (
                <div key={exam.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="font-semibold text-slate-800 line-clamp-1">{exam.title}</div>
                  <div className="flex items-center justify-between mt-1 text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {exam.durationMinutes} mins
                    </span>
                    <span>{exam.questions.length} questions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
