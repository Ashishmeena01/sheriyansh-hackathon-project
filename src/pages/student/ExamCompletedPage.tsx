import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { examService } from '../../services/examService';
import { RiskBadge } from '../../components/proctoring/RiskBadge';
import { formatDuration } from '../../utils/formatters';
import type { StudentAttempt, Exam } from '../../types';

export const ExamCompletedPage: React.FC = () => {
  const { attemptId, examId } = useParams<{ attemptId?: string; examId?: string }>();
  const [attempt] = useState<StudentAttempt | null>(() => {
    if (attemptId) return examService.getAttemptById(attemptId) || null;
    if (examId) {
      return examService.getAttempts().find(candidate => candidate.examId === examId && candidate.status === 'completed') || null;
    }
    return null;
  });
  const [exam] = useState<Exam | null>(() => {
    const a = attemptId
      ? examService.getAttemptById(attemptId)
      : examId
        ? examService.getAttempts().find(candidate => candidate.examId === examId && candidate.status === 'completed')
        : null;
    return a ? examService.getExamById(a.examId) || null : null;
  });

  if (!attempt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-500 text-xs">
          Loading submission summary...
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(attempt.answers || {}).length;
  const totalQuestions = exam ? exam.questions.length : 0;
  const canShowScore = exam?.showResultsImmediately && attempt.score !== undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Submission Confirmation Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 mb-2">
            Exam Successfully Submitted
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assessment Received
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {attempt.examTitle}
          </p>
        </div>

        {/* Score & Integrity Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-100 text-left">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Candidate</span>
            <span className="font-semibold text-xs text-slate-800 line-clamp-1 mt-0.5">
              {attempt.studentName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Time Spent</span>
            <span className="font-semibold text-xs text-slate-800 font-mono mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatDuration(attempt.durationSeconds)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Questions</span>
            <span className="font-semibold text-xs text-slate-800 mt-0.5">
              {answeredCount} of {totalQuestions}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block">Integrity Rating</span>
            <div className="mt-1">
              <RiskBadge score={attempt.riskScore} level={attempt.riskLevel} size="sm" />
            </div>
          </div>
        </div>

        {/* Score Banner (Only if Exam Config permits) */}
        {canShowScore ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/80 text-left flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Preliminary Score
              </span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {attempt.score} <span className="text-sm font-normal text-slate-500">/ {exam?.totalMarks} pts</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Calculated instantly based on multiple-choice responses.
              </p>
            </div>
            <Award className="w-10 h-10 text-teal-600/40" />
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800 block">Score Pending Instructor Review</span>
              Per examination policy, official scores and detailed question evaluations will be released by your teacher after final proctoring audit.
            </div>
          </div>
        )}

        {/* Privacy Discard Assurance */}
        <div className="p-3 rounded-xl bg-slate-900 text-slate-300 text-[11px] text-left flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Biometric Data Disposal Complete:</span> Your local camera stream has ended. Raw video was never transmitted over the internet or retained on any server.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/student/dashboard"
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <span>Return to Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/teacher/reviews"
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>View Attempt in Teacher Review Panel</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCompletedPage;
