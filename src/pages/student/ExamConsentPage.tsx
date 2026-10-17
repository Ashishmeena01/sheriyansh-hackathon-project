import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Camera, 
  Eye, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  User,
  CheckCircle2
} from 'lucide-react';
import { examService } from '../../services/examService';
import type { Exam } from '../../types';

export const ExamConsentPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [exam] = useState<Exam | null>(() => {
    if (!examId) return null;
    return examService.getExamById(examId) || null;
  });
  const [studentName, setStudentName] = useState('Jordan Lee');
  const [studentEmail, setStudentEmail] = useState('jordan.lee@university.edu');
  const [hasConsented, setHasConsented] = useState(false);
  const [acknowledgedSnapshots, setAcknowledgedSnapshots] = useState(true);

  useEffect(() => {
    if (!exam) {
      alert('Exam not found. Returning to student dashboard.');
      navigate('/student/dashboard');
    }
  }, [exam, navigate]);

  const handleProceed = () => {
    if (!hasConsented) {
      alert('You must provide explicit consent to proceed with proctored examination.');
      return;
    }

    if (!studentName.trim()) {
      alert('Please enter your legal student name.');
      return;
    }

    // Initialize in-progress attempt in localStorage
    const newAttemptId = `att-${Date.now()}`;
    examService.saveAttempt({
      id: newAttemptId,
      examId: exam!.id,
      examTitle: exam!.title,
      studentId: `std-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || 'student@university.edu',
      status: 'in-progress',
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      answers: {},
      riskScore: 0,
      riskLevel: 'LOW',
      events: [],
      consentGiven: true,
      reviewed: false,
      reviewDecision: 'pending'
    });

    // Navigate to actual exam session
    navigate(`/student/session/${exam!.id}?attemptId=${newAttemptId}`);
  };

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-slate-500 text-xs">Loading assessment details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          title="Cancel and return to dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Privacy Transparency & Biometric Consent
          </h2>
          <p className="text-xs text-slate-500">
            Please read how ProctorVision safeguards your privacy before starting {exam.title}
          </p>
        </div>
      </div>

      {/* Main Consent Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        {/* Exam Quick Specs Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400">
              Exam Details
            </span>
            <h3 className="font-semibold text-sm text-white mt-0.5">{exam.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{exam.questions.length} Questions • {exam.durationMinutes} Minutes • Total {exam.totalMarks} Marks</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-teal-300 bg-teal-950/70 border border-teal-500/30 px-3 py-1.5 rounded-lg">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Video Streaming</span>
          </div>
        </div>

        {/* Four Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">100% On-Device Analysis</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your webcam frames are processed exclusively inside your browser using Google MediaPipe WebAssembly. No continuous video feed is uploaded to any cloud server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Page Visibility Awareness</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Standard browser Page Visibility APIs record when the exam tab is backgrounded or minimized, ensuring academic focus without accessing personal browser history.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Limited Event Snapshots</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If a sustained irregularity is flagged (e.g. multiple faces present), a single thumbnail is captured for the teacher's audit and stored locally.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Human Teacher Oversight</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              AI flags are strictly advisory. A suspicious flag never implies automatic disqualification; the instructor reviews every incident contextually.
            </p>
          </div>
        </div>

        {/* Student Identity Form */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" /> Confirm Candidate Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={e => setStudentEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Mandatory Explicit Consent Checkbox */}
        <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={e => setHasConsented(e.target.checked)}
              className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <div className="text-xs text-slate-800 leading-relaxed font-medium">
              I consent to browser webcam monitoring and on-device face integrity analysis for the duration of this exam. I understand raw video will never leave my device.
            </div>
          </label>

          {exam.enableSnapshots && (
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acknowledgedSnapshots}
                onChange={e => setAcknowledgedSnapshots(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
              />
              <div className="text-[11px] text-slate-600 leading-relaxed">
                I acknowledge that suspicious incident thumbnails may be recorded for instructor audit.
              </div>
            </label>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/student/dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            Cancel & Return
          </button>

          <button
            type="button"
            onClick={handleProceed}
            disabled={!hasConsented}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm ${
              hasConsented
                ? 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer hover:scale-[1.02]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Examination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamConsentPage;
