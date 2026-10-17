import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  Cpu,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { authService } from '../../services/authService';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Derive current title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path.includes('/teacher/dashboard')) return 'Teacher Overview';
    if (path.includes('/teacher/create-exam')) return 'Create New Exam';
    if (path.includes('/teacher/invigilation')) return 'Live Invigilation Monitor';
    if (path.includes('/teacher/reviews')) return 'Flagged Attempt Reviews';
    if (path.includes('/teacher/rules')) return 'Rule Tuning & Sensitivity';
    if (path.includes('/student/dashboard')) return 'Student Examination Portal';
    if (path.includes('/student/consent')) return 'Exam Security & Consent';
    if (path.includes('/student/session')) return 'Secure Exam Session';
    if (path.includes('/student/completed')) return 'Exam Submission Report';
    return 'ProctorVision';
  };

  const handleSwitchRole = (newRole: 'teacher' | 'student') => {
    const updated = authService.setCurrentRole(newRole);
    setUser(updated);
    setShowRoleModal(false);
    if (newRole === 'teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-xs">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-600 hidden sm:block">
            {location.pathname.startsWith('/student')
              ? 'Student Mode â€¢ On-Device Biometric Integrity'
              : 'Teacher Management â€¢ Real-time Monitoring & Decision Review'}
          </p>
        </div>
      </div>

      {/* Right: Status Pills & Role Badge */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* On-device AI Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium">
          <Cpu className="w-3.5 h-3.5 text-teal-600" />
          <span>Local Engine Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
        </div>

        {/* Zero Cloud Streaming Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Zero-Stream Mode</span>
        </div>

        {/* Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowRoleModal(!showRoleModal)}
            className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
            aria-expanded={showRoleModal}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-semibold ${
              user.role === 'teacher' ? 'bg-indigo-600' : 'bg-teal-600'
            }`}>
              {user.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block font-semibold text-slate-800 leading-tight">{user.name}</span>
              <span className="text-[10px] text-slate-600 capitalize">{user.role} View</span>
            </div>
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600 ml-1" />
          </button>

          {/* Quick role modal dropdown */}
          {showRoleModal && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs">
              <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                <p className="font-semibold text-slate-800">Switch Demo Role</p>
                <p className="text-[11px] text-slate-600">Simulate different user perspectives</p>
              </div>

              <button
                onClick={() => handleSwitchRole('teacher')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  user.role === 'teacher'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    T
                  </div>
                  <div>
                    <p className="font-medium">Teacher Panel</p>
                    <p className="text-[10px] text-slate-600">Invigilate & review</p>
                  </div>
                </div>
                {user.role === 'teacher' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>

              <button
                onClick={() => handleSwitchRole('student')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors mt-1 ${
                  user.role === 'student'
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                    S
                  </div>
                  <div>
                    <p className="font-medium">Student Panel</p>
                    <p className="text-[10px] text-slate-600">Take exams with AI</p>
                  </div>
                </div>
                {user.role === 'student' && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
              </button>

              <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-1 text-[11px] text-slate-600">
                <Link to="/" className="text-indigo-600 hover:underline flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Landing Page
                </Link>
                <span>Hackathon Demo</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

