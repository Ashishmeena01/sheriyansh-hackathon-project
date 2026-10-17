import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Award,
  Calendar
} from 'lucide-react';
import { examService } from '../../services/examService';
import { RiskBadge } from '../../components/proctoring/RiskBadge';
import { formatDate } from '../../utils/formatters';
import type { Exam, StudentAttempt } from '../../types';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [exams] = useState<Exam[]>(() => examService.getExams());
  const [attempts] = useState<StudentAttempt[]>(() => examService.getAttempts());

  const handleStartExam = (examId: string) => {
    // Navigate to explicit consent page first as required by privacy rules
    navigate(`/student/consent/${examId}`);
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
            <span>Zero-Knowledge Privacy Guaranteed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Student Assessment Portal
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            Take scheduled academic examinations with transparent, on-device AI invigilation. Your biometric camera data is analyzed entirely within your browser and is never uploaded to the cloud.
          </p>
        </div>
      </div>

      {/* Available Exams Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              Available Examinations ({exams.length})
            </h3>
            <p className="text-xs text-slate-500">
              Teacher-created demo exams automatically synchronized with your portal
            </p>
          </div>

          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Real-time Sync
          </span>
        </div>

        {exams.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No Exams Available Right Now</p>
            <p className="text-xs text-slate-400 mt-1">
              Switch to the Teacher Panel to create and publish a new exam.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map(exam => {
              const existingAttempt = attempts.find(a => a.examId === exam.id && a.status === 'completed');

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">
                        {exam.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        {exam.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {exam.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] mb-4">
                      <div>
                        <span className="block text-slate-400">Duration</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" /> {exam.durationMinutes}m
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Questions</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                          <HelpCircle className="w-3 h-3 text-slate-400" /> {exam.questions.length} Qs
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Total Marks</span>
                        <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                          <Award className="w-3 h-3 text-slate-400" /> {exam.totalMarks} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> By {exam.createdBy}
                    </span>

                    {existingAttempt ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam.id)}
                        className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02]"
                      >
                        <span>Start Exam</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Attempts History */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          My Assessment History & Integrity Scores
        </h3>

        {attempts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No completed exams recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-600 uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5 font-semibold">Exam Title</th>
                  <th className="pb-2.5 font-semibold">Student Name</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Integrity Level</th>
                  <th className="pb-2.5 font-semibold">Date</th>
                  <th className="pb-2.5 font-semibold text-right">Review Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map(att => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">
                      {att.examTitle}
                    </td>
                    <td className="py-3 text-slate-600 font-medium">
                      {att.studentName}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        att.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : att.status === 'in-progress'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {att.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      <RiskBadge score={att.riskScore} level={att.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {formatDate(att.startedAt)}
                    </td>
                    <td className="py-3 text-right">
                      {att.reviewed ? (
                        <span className={`inline-flex items-center gap-1 font-semibold ${
                          att.reviewDecision === 'valid' ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {att.reviewDecision === 'valid' ? 'Teacher Flagged' : 'Cleared by Teacher'}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending Review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
