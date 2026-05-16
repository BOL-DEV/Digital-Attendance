import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const stats = [
  { label: 'Total Students', value: '1,248', accent: 'bg-blue-500/20 text-blue-300', progress: '75%' },
  { label: 'Active Courses', value: '24', accent: 'bg-cyan-500/20 text-cyan-300', progress: '68%' },
  { label: 'Attendance Rate', value: '87.4%', accent: 'bg-emerald-500/20 text-emerald-300', progress: '87%' },
  { label: 'Sessions This Week', value: '32', accent: 'bg-orange-500/20 text-orange-300', progress: '76%' },
];

const topSummary = [
  { label: 'Students Present Today', value: '245', meta: 'of 280 enrolled' },
  { label: 'Pending Verification', value: '12', meta: 'requires review' },
  { label: 'Active Sessions', value: '3', meta: 'ongoing now' },
  { label: 'Avg. Verification Time', value: '2.3s', meta: 'per student' },
];

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function StatCard({ label, value, accent, progress }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#233047] p-6 shadow-[0_18px_45px_rgba(2,6,23,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-3 text-[2rem] font-bold tracking-tight text-white">{value}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${accent}`}>
          •
        </span>
      </div>
      <div className="mt-5 h-1 rounded-full bg-slate-600/50">
        <div className="h-full rounded-full bg-sky-400" style={{ width: progress }} />
      </div>
    </div>
  );
}

function Panel({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-bold text-slate-50">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {children}
    </section>
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

export default function HocDashboard() {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseId, setCourseId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentMatric, setStudentMatric] = useState('');
  const [selfRegisterUrl, setSelfRegisterUrl] = useState('');
  const [classType, setClassType] = useState('2hr');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const canCreateCourse = useMemo(() => {
    return courseName.trim().length > 0 && courseCode.trim().length > 0;
  }, [courseName, courseCode]);

  const canAddStudent = useMemo(() => {
    return courseId.trim().length > 0 && studentName.trim().length > 0 && studentMatric.trim().length > 0;
  }, [courseId, studentName, studentMatric]);

  const canStartSession = useMemo(() => {
    return courseId.trim().length > 0 && (classType === '2hr' || classType === '3hr');
  }, [courseId, classType]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!canCreateCourse) return;
    const generatedId = `COURSE-${courseCode.trim().toUpperCase() || 'CSC301'}`;
    setCourseId(generatedId);
    toast.success('Course UI preview created');
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!canAddStudent) return;
    const mockLink = `https://attendix.app/register-face?course=${encodeURIComponent(courseId)}&student=${encodeURIComponent(studentMatric.trim().toUpperCase())}`;
    setSelfRegisterUrl(mockLink);
    toast.success('Student onboarding link generated');
  };

  const handleStartSession = async (e) => {
    e.preventDefault();
    if (!canStartSession) return;
    toast.success('Opening active session preview');
    navigate('/hoc/session');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(selfRegisterUrl);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-white">Welcome back, Dr. Johnson</h1>
        <p className="mt-3 text-xl text-slate-300">
          {formatDate(now)} • {formatTime(now)}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {topSummary.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-white/10 bg-[#233047] p-5">
            <p className="text-sm font-medium text-slate-200">{item.label}</p>
            <p className="mt-4 text-5xl font-bold tracking-tight text-blue-400">{item.value}</p>
            <p className="mt-2 text-sm text-slate-300">{item.meta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Panel eyebrow="Action" title="Create Course" description="Open a new course channel for attendance tracking.">
          <form onSubmit={handleCreateCourse} className="grid gap-4">
            <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" />
            <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="Course code" className="uppercase" />
            <button
              type="submit"
              disabled={!canCreateCourse}
              className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Course
            </button>
            {courseId ? (
              <p className="text-sm text-slate-400">
                Active course ID: <span className="text-slate-100">{courseId}</span>
              </p>
            ) : null}
          </form>
        </Panel>

        <Panel eyebrow="Action" title="Add Student" description="Generate biometric self-registration access for a student.">
          <form onSubmit={handleAddStudent} className="grid gap-4">
            <Input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Course ID" />
            <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" />
            <Input value={studentMatric} onChange={(e) => setStudentMatric(e.target.value)} placeholder="Matric number" className="uppercase" />
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={!canAddStudent}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Student
              </button>
              {selfRegisterUrl ? (
                <button
                  type="button"
                  onClick={copyLink}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  Copy Registration Link
                </button>
              ) : null}
            </div>
            {selfRegisterUrl ? (
              <a className="break-all text-sm text-blue-300 underline underline-offset-4" href={selfRegisterUrl} target="_blank" rel="noreferrer">
                {selfRegisterUrl}
              </a>
            ) : null}
          </form>
        </Panel>

        <Panel eyebrow="Launch" title="Session" description="Open the session page and start a live attendance session for a selected course.">
          <form onSubmit={handleStartSession} className="grid gap-4">
            <Input value={courseId} onChange={(e) => setCourseId(e.target.value)} placeholder="Course ID" />
            <Select value={classType} onChange={(e) => setClassType(e.target.value)}>
              <option value="2hr">2hr class (90 mins)</option>
              <option value="3hr">3hr class (120 mins)</option>
            </Select>
            <button
              type="submit"
              disabled={!canStartSession}
              className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white transition hover:from-sky-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Open Session Page
            </button>
            <div className="rounded-2xl border border-white/8 bg-[#2a364b] p-4 text-sm leading-6 text-slate-300">
              Face recognition models should remain available in <span className="font-semibold text-slate-100">client/public/models</span>.
            </div>
          </form>
        </Panel>
      </section>
    </div>
  );
}
