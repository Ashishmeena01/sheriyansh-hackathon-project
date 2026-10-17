import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PlusCircle, 
  Video, 
  FileCheck2, 
  Sliders, 
  GraduationCap, 
  BookOpen, 
  Lock, 
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const isTeacherPath = location.pathname.startsWith('/teacher') || location.pathname === '/';
  const isStudentPath = location.pathname.startsWith('/student');

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/teacher/create-exam', label: 'Create Exam', icon: PlusCircle },
    { to: '/teacher/invigilation', label: 'Live Invigilation', icon: Video, badge: 'Live' },
    { to: '/teacher/reviews', label: 'Attempt Reviews', icon: FileCheck2 },
    { to: '/teacher/rules', label: 'Rule Tuning', icon: Sliders },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'My Exams', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-900/90">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Proctor<span className="text-teal-400">Vision</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Privacy-Friendly AI</p>
            </div>
          </NavLink>

          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {/* Mode Switcher Pill */}
          <div className="p-1.5 bg-slate-950/60 border border-slate-800/90 rounded-lg flex gap-1">
            <NavLink
              to="/teacher/dashboard"
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
                isTeacherPath
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Teacher
            </NavLink>
            <NavLink
              to="/student/dashboard"
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
                isStudentPath
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Student
            </NavLink>
          </div>

          {/* Teacher Navigation Group */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Teacher Panel
              </span>
            </div>
            <nav className="space-y-1">
              {teacherLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Student Navigation Group */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Student Panel
              </span>
            </div>
            <nav className="space-y-1">
              {studentLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-600/20 text-teal-300 border-l-2 border-teal-500 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Privacy Assurance Banner */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/90 text-xs">
            <div className="flex items-center gap-2 text-teal-400 font-medium mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Stream Privacy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Video is evaluated locally via MediaPipe WASM. No raw webcam feeds leave your browser.
            </p>
          </div>
          
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Hackathon Demo
            </span>
            <span className="text-slate-400">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
