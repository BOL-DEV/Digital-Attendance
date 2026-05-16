import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HocDashboard from './pages/HocDashboard.jsx';
import HocLayout from './pages/HocLayout.jsx';
import HocComingSoon from './pages/HocComingSoon.jsx';
import HocCourses from './pages/HocCourses.jsx';
import HocReports from './pages/HocReports.jsx';
import HocSession from './pages/HocSession.jsx';
import HocStudents from './pages/HocStudents.jsx';
import SignAttendance from './pages/SignAttendance.jsx';
import RegisterFace from './pages/RegisterFace.jsx';
import SuperAdminAuth from './pages/SuperAdminAuth.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/hoc" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<SuperAdminAuth />} />
        <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/hoc" element={<HocLayout />}>
          <Route index element={<Navigate to="/hoc/dashboard" replace />} />
          <Route path="dashboard" element={<HocDashboard />} />
          <Route path="session" element={<HocSession />} />
          <Route path="reports" element={<HocReports />} />
          <Route path="students" element={<HocStudents />} />
          <Route path="courses" element={<HocCourses />} />
          <Route
            path="settings"
            element={<HocComingSoon title="Settings" description="System preferences, session rules, and admin-level controls will be configured here." />}
          />
        </Route>
        <Route path="/hoc/session/:session_id" element={<HocSession />} />
        <Route path="/sign/:session_id" element={<SignAttendance />} />
        <Route path="/register-face" element={<RegisterFace />} />
        <Route path="*" element={<Navigate to="/hoc/dashboard" replace />} />
      </Routes>
    </>
  );
}
