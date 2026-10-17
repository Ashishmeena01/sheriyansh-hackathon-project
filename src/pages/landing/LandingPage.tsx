import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Zap,
  Lock,
  Sliders,
  Activity,
  ArrowRight,
  Play,
  Eye
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { authService } from '../../services/authService';
import { RobotCanvas } from '../../components/proctoring/RobotCanvas';
import { GhostFibers } from '../../components/common/GhostFibers';

export const LandingPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Interactive WebGL2 GhostFibers Particle Canvas */}
      <div className="absolute top-0 left-0 right-0 h-[920px] z-0 opacity-70 pointer-events-none overflow-hidden">
        <GhostFibers
          glowColor="#06b6d4"
          secondaryColor="#10b981"
          lineColor="#a5f3fc"
          speed={0.35}
          scale={1.1}
          density={0.75}
          threads={56}
          volume={0.65}
          spread={1.2}
          mouseInteraction={false}
          brightness={1.1}
          glow={0.75}
        />
      </div>

      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-[-10rem] left-1/2 -translate-x-1/2 w-[45rem] h-[30rem] bg-gradient-to-b from-cyan-500/15 via-emerald-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-[28rem] -left-32 w-96 h-96 bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[35rem] -right-32 w-96 h-96 bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Modern Floating Glassmorphism Navbar */}
      <Navbar />

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">

            {/* Live Privacy Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs sm:text-sm text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-6 hover:border-cyan-400 transition-colors">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-medium tracking-wide">Privacy-By-Design Edge Architecture</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 hidden sm:inline">Zero Full-Video Uploads</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              In-Browser AI <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Exam Proctoring.
              </span>
              <br />
              <span className="text-slate-200 text-3xl sm:text-4xl lg:text-5xl font-bold">
                Decided by Humans.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              No intrusive 24/7 video streaming to corporate servers. ProctorVision runs lightweigh
              <span className="text-cyan-400 font-medium"> MediaPipe Face Mesh</span> and
              <span className="text-teal-400 font-medium"> COCO-SSD Phone Detection</span> right on the student’s laptop.
              Teachers review <span className="text-white font-medium">short snapshot timelines</span> with full false-alarm tuning.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                to="/student"
                onClick={() => authService.setCurrentRole('student')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Student Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/teacher"
                onClick={() => authService.setCurrentRole('teacher')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-cyan-500/40 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Teacher Dashboard</span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/40 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">Runs on weak laptops</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/40 border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">Micro-snapshots only</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/40 border border-white/5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">Auto-delete TTL</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Robot in Sleek Glass Card */}
          <div id="demo" className="lg:col-span-5 relative flex items-center justify-center">
            {/* Subtle Cyan Glow behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500/25 via-teal-500/15 to-emerald-500/20 rounded-3xl blur-xl opacity-80 pointer-events-none" />

            {/* Glassmorphic Card Container */}
            <div className="relative w-full max-w-md rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-white/15 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col items-center">

              {/* Card Header Bar */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-200 font-semibold tracking-wide">AI Sentinel Bot</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-[11px] text-cyan-300 font-medium">
                  Live Cursor Gaze 👁️
                </div>
              </div>

              {/* 3D Canvas Box (compact & properly framed) */}
              <div className="w-full h-[340px] sm:h-[370px] flex items-center justify-center">
                <RobotCanvas />
              </div>

              {/* Card Footer Micro-bar */}
              <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-cyan-400">✨</span>
                  <span>Move mouse • Click to say hello 👋</span>
                </span>
                <span className="text-slate-500 font-mono">60 FPS</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ===================== CORE ADVANTAGE SECTION ===================== */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-400 mb-4">
            <Zap className="w-3.5 h-3.5" />
            ENGINEERED FOR WEAK LAPTOPS & PRIVACY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How ProctorVision Replaces Invasive Video Streaming
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Traditional proctoring services force students to upload hours of video to corporate cloud servers, risking leaks and false bans. Here is why our on-device edge approach wins:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">

          {/* Card 1 */}
          <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-6 sm:p-8 hover:border-cyan-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">On-Device Edge Vision</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Google MediaPipe & TensorFlow.js execute right inside WebAssembly and WebGL. Detects face count, head pose yaw/pitch, and smartphones without sending camera feeds to a server.
            </p>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-mono">
              <span>0 KB Stream Bandwidth</span>
              <span>⚡ 60 FPS</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-6 sm:p-8 hover:border-emerald-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Micro-Snapshots with TTL</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              When an alarm triggers, only a short timestamped event record and a small snapshot are sent via Multer. MongoDB TTL indexes guarantee automatic deletion once review closes.
            </p>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>Encrypted Storage</span>
              <span>🗑️ Auto-Expiry</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl bg-slate-950/60 border border-white/10 p-6 sm:p-8 hover:border-teal-500/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Human-in-the-Loop Review</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Software never automatically fails a student. Teachers get an event timeline with "Valid" or "False Alarm" buttons, plus a tuning screen to dampen overactive rules (e.g., looking down at keys).
            </p>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-teal-400 font-mono">
              <span>Zero Unfair Bans</span>
              <span>⚖️ Teacher Veto</span>
            </div>
          </div>

        </div>
      </section>

      {/* ===================== HOW IT WORKS SECTION ===================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-400 mb-4">
            <Activity className="w-3.5 h-3.5" />
            FOUR-STEP PROCTORING PIPELINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Simple for Students. Transparent for Teachers.
          </h2>
          <p className="mt-4 text-base text-slate-400">
            A seamless workflow engineered from the ground up to eliminate invasive surveillance while ensuring 100% academic integrity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 mb-3">STEP 01</div>
              <h3 className="text-lg font-bold text-white mb-2">Consent & Model Warmup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Student grants camera access after transparent disclosure. MediaPipe and COCO-SSD models initialize in RAM in under 2 seconds.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
              🔒 Client-side initialization
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-6 flex flex-col justify-between hover:border-teal-500/40 transition-all">
            <div>
              <div className="text-xs font-mono font-bold text-teal-400 mb-3">STEP 02</div>
              <h3 className="text-lg font-bold text-white mb-2">On-Device Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time checks detect multi-face, head pose angle, smartphone visibility, and tab switching using Page Visibility API.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
              ⚡ 60 FPS in-browser evaluation
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 mb-3">STEP 03</div>
              <h3 className="text-lg font-bold text-white mb-2">Micro-Snapshot Logging</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If a violation sustains over the threshold, a compressed micro-snapshot and timestamped log are uploaded to the teacher's queue.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
              📸 Zero full-video storage
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 mb-3">STEP 04</div>
              <h3 className="text-lg font-bold text-white mb-2">Human Veto & Tuning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The teacher reviews flagged moments on a timeline with "Valid" or "False Alarm" buttons. Rules are tuned dynamically per exam.
              </p>
            </div>
            <div className="mt-6 text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
              ⚖️ Human-in-the-loop decision
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="py-10 border-t border-white/10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Proctor<span className="text-cyan-400">Vision</span></span>
            <span>• In-Browser AI Exam Proctoring</span>
          </div>
          <p>© 2026 ProctorVision. Open-source edge proctoring built for privacy.</p>
        </div>
      </footer>

    </div>
  );
};
