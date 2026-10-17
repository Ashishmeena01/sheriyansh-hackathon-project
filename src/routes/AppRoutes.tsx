import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { ExamConsentPage } from '../pages/student/ExamConsentPage';
import { ExamSessionPage } from '../pages/student/ExamSessionPage';
import { ExamCompletedPage } from '../pages/student/ExamCompletedPage';
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { CreateExamPage } from '../pages/teacher/CreateExamPage';
import { LiveInvigilationPage } from '../pages/teacher/LiveInvigilationPage';
import { AttemptReviewPage } from '../pages/teacher/AttemptReviewPage';
import { RuleTuningPage } from '../pages/teacher/RuleTuningPage';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<DashboardLayout />}>
      <Route element={<ProtectedRoute allowedRole="teacher" />}>
        <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/create-exam" element={<CreateExamPage />} />
        <Route path="/teacher/invigilation" element={<LiveInvigilationPage />} />
        <Route path="/teacher/live/:examId" element={<LiveInvigilationPage />} />
        <Route path="/teacher/reviews" element={<AttemptReviewPage />} />
        <Route path="/teacher/review/:attemptId" element={<AttemptReviewPage />} />
        <Route path="/teacher/rules" element={<RuleTuningPage />} />
        <Route path="/teacher/tuning" element={<RuleTuningPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/exam/:examId/setup" element={<ExamConsentPage />} />
        <Route path="/student/consent/:examId" element={<ExamConsentPage />} />
        <Route path="/student/exam/:examId/take" element={<ExamSessionPage />} />
        <Route path="/student/session/:examId" element={<ExamSessionPage />} />
        <Route path="/student/exam/:examId/completed" element={<ExamCompletedPage />} />
        <Route path="/student/completed/:attemptId" element={<ExamCompletedPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;

