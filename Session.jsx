import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const socket = io('/');

export default function HOCSession() {
  const { session_id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [qrImage, setQrImage] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [sessionTimeLeft, setSessionTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  // Load session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/sessions/${session_id}`);
        setSession(res.data.session);
        setAttendance(res.data.attendance);
      } catch (err) {
        toast.error('Session not found');
        navigate('/hoc');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [session_id, navigate]);

  // Refresh QR every 45 seconds
  const refreshQR = useCallback(async () => {
    try {
      const res = await api.get(`/sessions/${session_id}/qr`);
      setQrImage(res.data.qrImage);
      setTimeLeft(45);
    } catch (err) {
      if (err.response?.status === 410) {
        toast('Session has ended automatically ⏱️');
        navigate('/hoc/reports');
      }
    }
  }, [session_id, navigate]);

  // Initial QR load
  useEffect(() => {
    refreshQR();
  }, [refreshQR]);

  // QR countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          refreshQR();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [refreshQR]);

  // Session countdown timer
  useEffect(() => {
    if (!session?.closes_at) return;
    const interval = setInterval(() => {
      const remaining = new Date(session.closes_at) - new Date();
      if (remaining <= 0) {
        setSessionTimeLeft('Ended');
        clearInterval(interval);
        return;
      }
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setSessionTimeLeft(`${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Socket.io - live attendance feed
  useEffect(() => {
    socket.emit('join_session', session_id);

    socket.on('student_signed', (data) => {
      setAttendance(prev => [data, ...prev]);
      toast.success(`${data.name} signed ✅`);
    });

    socket.on('session_closed', () => {
      toast('Session closed automatically');
      navigate('/hoc/reports');
    });

    return () => {
      socket.emit('leave_session', session_id);
      socket.off('student_signed');
      socket.off('session_closed');
    };
  }, [session_id, navigate]);

  const handleClose = async () => {
    if (!window.confirm('Close this session now?')) return;
    setClosing(true);
    try {
      await api.put(`/sessions/${session_id}/close`);
      toast.success('Session closed');
      navigate('/hoc/reports');
    } catch (err) {
      toast.error('Failed to close session');
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{session?.course_name}</h1>
            <p className="text-gray-400 mt-1">{session?.course_code} · {session?.class_type} class</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Session closes in</p>
              <p className="text-2xl font-mono font-bold text-emerald-400">{sessionTimeLeft}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={closing}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {closing ? 'Closing...' : 'Close Session'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Scan QR to Sign</h2>
            <p className="text-gray-400 text-sm mb-6">Refreshes every 45 seconds</p>

            {qrImage ? (
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <img src={qrImage} alt="QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-800 rounded-2xl animate-pulse" />
            )}

            {/* QR countdown ring */}
            <div className="mt-6 flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#10b981" strokeWidth="3"
                    strokeDasharray={`${(timeLeft / 45) * 100} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {timeLeft}s
                </span>
              </div>
              <span className="text-gray-400 text-sm">New QR in {timeLeft}s</span>
            </div>
          </div>

          {/* Live attendance feed */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Live Attendance</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-sm font-bold px-3 py-1 rounded-full">
                {attendance.length} signed
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {attendance.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-3">📋</div>
                  <p>Waiting for students to sign...</p>
                </div>
              ) : (
                attendance.map((record, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3 animate-fade-in"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                        {record.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{record.name}</p>
                        <p className="text-gray-400 text-xs">{record.matric_number}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {new Date(record.signed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
