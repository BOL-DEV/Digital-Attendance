import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const initialSessionForm = {
  courseId: '',
  courseName: '',
  courseCode: '',
  lecturerName: 'Dr. Johnson',
  classType: '2hr',
};

const initialMockAttendance = [
  { name: 'Adebayo T.', matric_number: 'CSC/2021/014', signed_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), status: 'success' },
  { name: 'Face mismatch detected', matric_number: 'Manual review required', signed_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), status: 'error' },
  { name: 'Musa K.', matric_number: 'CSC/2021/031', signed_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), status: 'success' },
];

function formatClock(dateValue) {
  return new Date(dateValue).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDurationLabel(classType) {
  if (classType === '2hr') return '90 mins';
  if (classType === '3hr') return '120 mins';
  return classType || 'Session';
}

function FeedStatusIcon({ tone }) {
  const colors = {
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/20',
    error: 'bg-rose-500/15 text-rose-300 border-rose-400/20',
    info: 'bg-sky-500/15 text-sky-300 border-sky-400/20',
  };

  return (
    <span className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-bold ${colors[tone]}`}>
      {tone === 'success' ? 'OK' : tone === 'error' ? 'NO' : 'IN'}
    </span>
  );
}

function StatPill({ label, value, tone = 'default' }) {
  const tones = {
    default: 'border-white/10 bg-white/5 text-slate-100',
    success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    blue: 'border-sky-400/20 bg-sky-500/10 text-sky-300',
    amber: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function Input({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 ${className}`}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3.5 text-sm text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
    />
  );
}

function buildMockQr(courseCode, timeLeft) {
  const encoded = encodeURIComponent(`${courseCode}-${timeLeft}`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encoded}`;
}

function buildSessionFromForm(form) {
  return {
    session_id: `session-${Date.now()}`,
    course_name: form.courseName.trim() || `${form.courseCode.trim().toUpperCase()} Session`,
    course_code: form.courseCode.trim().toUpperCase() || form.courseId.trim().toUpperCase() || 'CSC301',
    class_type: form.classType,
    lecturer_name: form.lecturerName.trim() || 'Dr. Johnson',
    closes_at: new Date(Date.now() + (form.classType === '3hr' ? 120 : 90) * 60 * 1000).toISOString(),
  };
}

function SessionSetupCard({ form, onChange, onSubmit, canStartSession, endedSession }) {
  return (
    <div className="mx-auto w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300/80">Attendix Session</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Create and launch a new attendance session</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Start with session details here. Once launched, this page switches into the live ongoing session view automatically.
          </p>

          {endedSession ? (
            <div className="mt-6 rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-5 text-sm leading-6 text-amber-100">
              The previous session has ended. You can create a fresh one from this page anytime.
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatPill label="Page State" value={endedSession ? 'Ended' : 'Ready'} tone={endedSession ? 'amber' : 'blue'} />
            <StatPill label="Next Action" value="Create Session" tone="success" />
            <StatPill label="Session Window" value={formatDurationLabel(form.classType)} tone="amber" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 rounded-[28px] border border-white/10 bg-[#10192c] p-5">
          <Input
            value={form.courseId}
            onChange={(e) => onChange('courseId', e.target.value)}
            placeholder="Course ID"
          />
          <Input
            value={form.courseName}
            onChange={(e) => onChange('courseName', e.target.value)}
            placeholder="Course name"
          />
          <Input
            value={form.courseCode}
            onChange={(e) => onChange('courseCode', e.target.value)}
            placeholder="Course code"
            className="uppercase"
          />
          <Input
            value={form.lecturerName}
            onChange={(e) => onChange('lecturerName', e.target.value)}
            placeholder="Lecturer name"
          />
          <Select value={form.classType} onChange={(e) => onChange('classType', e.target.value)}>
            <option value="2hr">2hr class (90 mins)</option>
            <option value="3hr">3hr class (120 mins)</option>
          </Select>

          <button
            type="submit"
            disabled={!canStartSession}
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Session
          </button>

          <div className="rounded-2xl border border-white/8 bg-[#2a364b] p-4 text-sm leading-6 text-slate-300">
            Face recognition models should remain available in <span className="font-semibold text-slate-100">client/public/models</span>.
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HocSession() {
  const [sessionForm, setSessionForm] = useState(initialSessionForm);
  const [session, setSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [timeLeft, setTimeLeft] = useState(45);
  const [sessionTimeLeft, setSessionTimeLeft] = useState('');
  const [closing, setClosing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [endedSession, setEndedSession] = useState(null);

  const isSessionActive = Boolean(session);

  useEffect(() => {
    if (!isSessionActive || paused) return undefined;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 45 : prev - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isSessionActive, paused]);

  useEffect(() => {
    if (!session) {
      setSessionTimeLeft('');
      return undefined;
    }

    const interval = window.setInterval(() => {
      const remaining = new Date(session.closes_at) - new Date();

      if (remaining <= 0) {
        setSessionTimeLeft('Ended');
        setEndedSession(session);
        setSession(null);
        setPaused(false);
        setClosing(false);
        toast.success('Session ended');
        window.clearInterval(interval);
        return;
      }

      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      setSessionTimeLeft(`${mins}m ${secs}s`);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (!isSessionActive) return undefined;

    const interval = window.setInterval(() => {
      setAttendance((prev) => {
        if (paused || prev.length >= 6) return prev;

        const mockEntries = [
          { name: 'Okafor J.', matric_number: 'CSC/2021/044', status: 'success' },
          { name: 'Face mismatch detected', matric_number: 'Manual review required', status: 'error' },
          { name: 'Zainab R.', matric_number: 'CSC/2021/052', status: 'success' },
        ];

        const next = mockEntries[prev.length % mockEntries.length];
        return [
          {
            ...next,
            signed_at: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    }, 9000);

    return () => window.clearInterval(interval);
  }, [isSessionActive, paused]);

  const canStartSession = useMemo(() => {
    return sessionForm.courseCode.trim().length > 0 && sessionForm.courseName.trim().length > 0;
  }, [sessionForm.courseCode, sessionForm.courseName]);

  const qrImage = useMemo(() => {
    if (!session) return '';
    return buildMockQr(session.course_code, timeLeft);
  }, [session, timeLeft]);

  const successfulVerifications = attendance.filter((record) => record.status !== 'error').length;
  const failedVerifications = attendance.filter((record) => record.status === 'error').length;

  const activityFeed = useMemo(() => {
    return attendance.map((record) => ({
      id: `${record.name}-${record.signed_at}`,
      tone: record.status === 'error' ? 'error' : 'success',
      title: record.status === 'error' ? record.name : `${record.name} verified successfully`,
      subtitle: record.matric_number,
      time: record.signed_at,
    }));
  }, [attendance]);

  const courseMeta = useMemo(() => {
    if (!session) return [];

    return [
      { label: 'Course', value: session.course_code, tone: 'blue' },
      { label: 'Duration', value: formatDurationLabel(session.class_type), tone: 'amber' },
      { label: 'Session State', value: paused ? 'Paused' : 'Active', tone: paused ? 'amber' : 'success' },
    ];
  }, [paused, session]);

  const handleSessionFieldChange = (field, value) => {
    setSessionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartSession = (e) => {
    e.preventDefault();
    if (!canStartSession) return;

    const nextSession = buildSessionFromForm(sessionForm);
    setSession(nextSession);
    setAttendance(initialMockAttendance);
    setTimeLeft(45);
    setPaused(false);
    setClosing(false);
    setEndedSession(null);
    toast.success('Session started');
  };

  const handleClose = () => {
    if (!session) return;

    setClosing(true);
    setEndedSession(session);
    setSession(null);
    setPaused(false);
    setClosing(false);
    setSessionTimeLeft('Ended');
    toast.success('Session ended');
  };

  const handlePause = () => {
    setPaused((prev) => !prev);
    toast(paused ? 'Session resumed' : 'Session paused');
  };

  const handleGenerateReport = async () => {
    if (!session) return;

    setReporting(true);

    try {
      const header = ['Name', 'Status / Matric', 'Signed At'];
      const rows = attendance.map((record) => [record.name, record.matric_number, record.signed_at]);
      const csv = [header, ...rows]
        .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${session.course_code.toLowerCase()}-attendance-preview.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Preview report generated');
    } catch {
      toast.error('Could not generate report');
    } finally {
      setReporting(false);
    }
  };

  const refreshProgress = `${(timeLeft / 45) * 100} 100`;

  return (
    <div className="min-h-[calc(100vh-97px)] overflow-hidden bg-[#08111f] text-slate-100">
      <div className="relative min-h-[calc(100vh-97px)] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,_#0b1324_0%,_#08111f_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:84px_84px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-97px)] max-w-[1600px] flex-col px-4 py-6 sm:px-6 lg:px-8">
          {!isSessionActive ? (
            <SessionSetupCard
              form={sessionForm}
              onChange={handleSessionFieldChange}
              onSubmit={handleStartSession}
              canStartSession={canStartSession}
              endedSession={endedSession}
            />
          ) : (
            <>
              <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 shadow-[0_20px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:px-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300/80">Attendix Ongoing Session</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{session.course_name}</h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Lecturer: <span className="text-slate-200">{session.lecturer_name}</span>
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {courseMeta.map((item) => (
                    <StatPill key={item.label} label={item.label} value={item.value} tone={item.tone} />
                  ))}
                </div>
              </header>

              <div className="grid flex-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Live Feed</p>
                      <h2 className="mt-2 text-2xl font-bold text-white">Verification Stream</h2>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      Realtime
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <StatPill label="Successful" value={`${successfulVerifications}`} tone="success" />
                    <StatPill label="Failed" value={`${failedVerifications}`} tone="default" />
                  </div>

                  <div className="scrollbar-hidden mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-1">
                    {activityFeed.map((item) => (
                      <div key={item.id} className="rounded-3xl border border-white/8 bg-[#1c2740] p-4 shadow-[0_12px_40px_rgba(2,6,23,0.25)]">
                        <div className="flex gap-3">
                          <FeedStatusIcon tone={item.tone} />
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-sm text-slate-300">{item.subtitle}</p>
                            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{formatClock(item.time)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>

                <section className="flex flex-col rounded-[34px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:p-8">
                  <div className="mb-6 flex flex-col items-center text-center">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${paused ? 'border-amber-400/20 bg-amber-500/10 text-amber-300' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${paused ? 'bg-amber-400' : 'animate-pulse bg-emerald-400'}`} />
                      {paused ? 'Session Paused' : 'Session Active'}
                    </span>
                    <h2 className="mt-5 text-4xl font-bold tracking-tight text-white">Scan this QR code to verify attendance</h2>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
                      Students should scan the live rotating code during class attendance verification. Each code refreshes every 45 seconds for secure session validation.
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <div className={`absolute h-[360px] w-[360px] rounded-full bg-sky-500/15 blur-3xl transition ${paused ? 'opacity-30' : 'animate-pulse opacity-100'}`} />
                      <div className="absolute h-[430px] w-[430px] rounded-full border border-sky-400/10" />
                      <div className="absolute h-[480px] w-[480px] rounded-full border border-sky-400/5" />

                      <div className="relative rounded-[40px] border border-sky-400/20 bg-[#121c31]/95 p-6 shadow-[0_25px_120px_rgba(59,130,246,0.18)]">
                        <div className="absolute inset-0 rounded-[40px] border border-white/6" />
                        <div className="relative rounded-[30px] bg-white p-5 shadow-[0_18px_50px_rgba(2,6,23,0.35)]">
                          <img src={qrImage} alt="Active session QR code" className={`h-72 w-72 sm:h-80 sm:w-80 ${paused ? 'opacity-50' : ''}`} />

                          {paused ? (
                            <div className="absolute inset-5 flex items-center justify-center rounded-[22px] bg-slate-950/70 backdrop-blur-sm">
                              <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                                Paused
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-5 text-center">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16">
                          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(71,85,105,0.5)" strokeWidth="2.8" />
                            <circle
                              cx="18"
                              cy="18"
                              r="15.9"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2.8"
                              strokeDasharray={refreshProgress}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-sky-300">
                            {paused ? '--' : `${timeLeft}s`}
                          </span>
                        </div>

                        <div className="text-left">
                          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Expiration Countdown</p>
                          <p className="mt-1 text-2xl font-semibold text-white">{paused ? 'Paused' : `Refresh in ${timeLeft}s`}</p>
                        </div>
                      </div>

                      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
                        <StatPill label="Scans Recorded" value={`${attendance.length}`} tone="success" />
                        <StatPill label="Session Ends In" value={sessionTimeLeft || '--'} tone="blue" />
                        <StatPill label="Verification State" value={paused ? 'Hold' : 'Open'} tone={paused ? 'amber' : 'success'} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={closing}
                      className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      {closing ? 'Ending Session...' : 'End Session'}
                    </button>

                    <button
                      type="button"
                      onClick={handlePause}
                      className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20"
                    >
                      {paused ? 'Resume Session' : 'Pause Session'}
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateReport}
                      disabled={reporting}
                      className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/20 disabled:opacity-50"
                    >
                      {reporting ? 'Generating Report...' : 'Generate Report'}
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
