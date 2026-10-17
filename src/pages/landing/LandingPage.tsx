import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  Eye, 
  FileCheck2, 
  Sliders, 
  ArrowRight, 
  Sparkles, 
  GraduationCap,
  LayoutDashboard
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Privacy-Friendly AI Invigilation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Academic Integrity Without Compromising Student Privacy.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            ProctorVision runs real-time computer vision entirely in the candidate's browser via WebAssembly. Evaluate face presence, multi-person intrusions, and tab switches locally—<span className="text-teal-400 font-semibold">never streaming raw webcam video to remote servers.</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/teacher/dashboard"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Teacher Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/student/dashboard"
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Launch Student Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Architectural Pillars */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Engine Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Why ProctorVision is Different
          </h2>
          <p className="text-xs text-slate-500">
            Engineered to overcome the invasive mass-surveillance of legacy proctoring platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-xs text-slate-900">Zero Cloud Video</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Video inference runs 100% on-device inside client WebAssembly. No massive data pipelines, zero surveillance leak liability.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-xs text-slate-900">Page Visibility API</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Detects tab switches, minimized windows, and focus loss instantly using native browser standards without installing invasive system drivers.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-xs text-slate-900">Configurable Sensitivity</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Instructors tune anomaly persistence times and penalties to prevent accidental false alarms from brief natural movements.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-semibold text-xs text-slate-900">Human-in-the-Loop</h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              AI flags are strictly advisory. Final decisions always rest with human educators, who can dismiss false alarms with 1 click.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Hackathon Demo Flow Map */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Complete Hackathon Demo Workflow
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these recommended steps to evaluate the end-to-end user journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px]">
              1
            </span>
            <h4 className="font-semibold text-slate-900">Create Assessment</h4>
            <p className="text-[11px] text-slate-600">
              Go to Teacher Panel → Create Exam. Add questions and configure duration.
            </p>
            <Link to="/teacher/create-exam" className="text-indigo-600 hover:underline font-semibold text-[11px] flex items-center gap-0.5 pt-1">
              Create Exam <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="w-6 h-6 rounded-md bg-teal-600 text-white font-bold flex items-center justify-center text-[11px]">
              2
            </span>
            <h4 className="font-semibold text-slate-900">Student Consent & Session</h4>
            <p className="text-[11px] text-slate-600">
              Open Student Portal → Review privacy consent → Start live exam with webcam.
            </p>
            <Link to="/student/dashboard" className="text-teal-600 hover:underline font-semibold text-[11px] flex items-center gap-0.5 pt-1">
              Start Exam <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[11px]">
              3
            </span>
            <h4 className="font-semibold text-slate-900">Live Invigilation</h4>
            <p className="text-[11px] text-slate-600">
              Teacher monitors active students, risk ratings, and live incident telemetry.
            </p>
            <Link to="/teacher/invigilation" className="text-purple-600 hover:underline font-semibold text-[11px] flex items-center gap-0.5 pt-1">
              Live Monitor <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="w-6 h-6 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center text-[11px]">
              4
            </span>
            <h4 className="font-semibold text-slate-900">Audit & Decision Review</h4>
            <p className="text-[11px] text-slate-600">
              Review flagged attempts, confirm valid violations or dismiss false alarms.
            </p>
            <Link to="/teacher/reviews" className="text-rose-600 hover:underline font-semibold text-[11px] flex items-center gap-0.5 pt-1">
              Review Board <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
