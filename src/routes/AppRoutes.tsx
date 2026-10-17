import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from '../components/layout/DashboardLayout';
import LandingPage from '../pages/landing/LandingPage';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import CreateExamPage from '../pages/teacher/CreateExamPage';
import LiveInvigilationPage from '../pages/teacher/LiveInvigilationPage';
import AttemptReviewPage from '../pages/teacher/AttemptReviewPage';
import RuleTuningPage from '../pages/teacher/RuleTuningPage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import ExamConsentPage from '../pages/student/ExamConsentPage';
import ExamSessionPage from '../pages/student/ExamSessionPage';
import ExamCompletedPage from '../pages/student/ExamCompletedPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* Landing Showcase */}
          <Route path="/" element={<LandingPage />} />

          {/* Teacher Panel Routes */}
          <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/create-exam" element={<CreateExamPage />} />
          <Route path="/teacher/invigilation" element={<LiveInvigilationPage />} />
          <Route path="/teacher/reviews" element={<AttemptReviewPage />} />
          <Route path="/teacher/rules" element={<RuleTuningPage />} />

          {/* Student Panel Routes */}
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/consent/:examId" element={<ExamConsentPage />} />
          <Route path="/student/session/:examId" element={<ExamSessionPage />} />
          <Route path="/student/completed/:attemptId" element={<ExamCompletedPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
