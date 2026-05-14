import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import HocDashboard from './pages/HocDashboard.jsx';
import HocSession from './pages/HocSession.jsx';
import SignAttendance from './pages/SignAttendance.jsx';
import RegisterFace from './pages/RegisterFace.jsx';

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/hoc" replace />} />
        <Route path="/hoc" element={<HocDashboard />} />
        <Route path="/hoc/session/:session_id" element={<HocSession />} />
        <Route path="/sign/:session_id" element={<SignAttendance />} />
        <Route path="/register-face" element={<RegisterFace />} />
        <Route path="*" element={<Navigate to="/hoc" replace />} />
      </Routes>
    </>
  );
}
