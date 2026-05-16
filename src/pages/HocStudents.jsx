import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialStudents = [
  {
    id: '1',
    name: 'Adebayo Tunde',
    matric: 'CSC/2021/014',
    status: 'Verified',
    department: 'Computer Science',
    level: '300',
    date: 'Jan 12, 2026',
    avatar: 'AT',
  },
  {
    id: '2',
    name: 'Musa Kareem',
    matric: 'CSC/2021/031',
    status: 'Pending',
    department: 'Computer Science',
    level: '300',
    date: 'Jan 13, 2026',
    avatar: 'MK',
  },
  {
    id: '3',
    name: 'Zainab Rahman',
    matric: 'IFT/2022/008',
    status: 'Verified',
    department: 'Information Technology',
    level: '200',
    date: 'Jan 14, 2026',
    avatar: 'ZR',
  },
  {
    id: '4',
    name: 'David Okonkwo',
    matric: 'SEN/2021/019',
    status: 'Failed Enrollment',
    department: 'Software Engineering',
    level: '300',
    date: 'Jan 14, 2026',
    avatar: 'DO',
  },
  {
    id: '5',
    name: 'Fatima Bello',
    matric: 'CSC/2023/104',
    status: 'Pending',
    department: 'Computer Science',
    level: '100',
    date: 'Jan 15, 2026',
    avatar: 'FB',
  },
];

const filters = ['All Students', 'Verified', 'Pending', 'Failed Enrollment'];
const enrollmentStates = [
  'Face detected',
  'Face captured successfully',
  'Biometric enrollment completed',
  'Retake capture',
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="m20 20-4.2-4.2m1.7-5.05a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4.75 8.25A2.25 2.25 0 0 1 7 6h1.4l1.1-1.5h4.99L15.6 6H17A2.25 2.25 0 0 1 19.25 8.25v8.5A2.25 2.25 0 0 1 17 19H7a2.25 2.25 0 0 1-2.25-2.25v-8.5Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12.5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Verified: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    Pending: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
    'Failed Enrollment': 'border-rose-400/20 bg-rose-500/10 text-rose-300',
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, subtext, tone }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#233047] p-5 shadow-[0_18px_45px_rgba(2,6,23,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-4 text-4xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{subtext}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${tone}`}>
          •
        </span>
      </div>
    </div>
  );
}

export default function HocStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Students');
  const [showPanel, setShowPanel] = useState(false);
  const [captureMode, setCaptureMode] = useState('Live Camera');
  const [stateIndex, setStateIndex] = useState(1);
  const [form, setForm] = useState({
    name: '',
    matric: '',
    department: 'Computer Science',
    level: '100',
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.matric.toLowerCase().includes(search.toLowerCase()) ||
        student.department.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === 'All Students' ? true : student.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, students]);

  const stats = useMemo(() => {
    const total = students.length;
    const verified = students.filter((student) => student.status === 'Verified').length;
    const pending = students.filter((student) => student.status === 'Pending').length;
    const recent = students.filter((student) => student.date === 'Jan 15, 2026').length;

    return [
      { label: 'Total Students', value: total, subtext: 'Managed identity records', tone: 'bg-blue-500/20 text-blue-300' },
      { label: 'Registered Biometrics', value: verified, subtext: 'Enrollment completed', tone: 'bg-emerald-500/20 text-emerald-300' },
      { label: 'Pending Registrations', value: pending, subtext: 'Awaiting capture', tone: 'bg-amber-500/20 text-amber-300' },
      { label: 'Recently Added', value: recent, subtext: 'New student profiles', tone: 'bg-cyan-500/20 text-cyan-300' },
    ];
  }, [students]);

  const handleCreateStudent = (e) => {
    e.preventDefault();

    const newStudent = {
      id: `${Date.now()}`,
      name: form.name || 'New Student',
      matric: form.matric || 'NEW/2026/001',
      status: 'Pending',
      department: form.department,
      level: form.level,
      date: 'Jan 15, 2026',
      avatar: (form.name || 'NS')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    };

    setStudents((prev) => [newStudent, ...prev]);
    setShowPanel(false);
    setStateIndex(2);
    setForm({
      name: '',
      matric: '',
      department: 'Computer Science',
      level: '100',
    });
  };

  return (
    <>
      <div className="space-y-8 px-4 py-8 sm:px-8">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Biometric Registry</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Students</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
              Manage student records, monitor biometric enrollment, and organize identity-linked attendance profiles across the department.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative min-w-[260px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, matric number..."
                className="w-full rounded-2xl border border-white/10 bg-[#233047] py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-400/40"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#233047] px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/40"
            >
              {filters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowPanel(true)}
              className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Add Student
            </button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl lg:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Student Directory</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Biometric student records</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              {filteredStudents.length} records
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-2 font-semibold">Student</th>
                  <th className="px-4 py-2 font-semibold">Matric Number</th>
                  <th className="px-4 py-2 font-semibold">Biometric Status</th>
                  <th className="px-4 py-2 font-semibold">Department</th>
                  <th className="px-4 py-2 font-semibold">Registration Date</th>
                  <th className="px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="rounded-2xl bg-[#233047] text-sm text-slate-200 shadow-[0_14px_35px_rgba(2,6,23,0.18)]">
                    <td className="rounded-l-2xl px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 font-semibold text-sky-300">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.name}</p>
                          <p className="text-xs text-slate-400">Level {student.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-300">{student.matric}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-300">{student.department}</td>
                    <td className="px-4 py-4 text-slate-300">{student.date}</td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <button
                        type="button"
                        onClick={() => navigate('/register-face', { state: { student } })}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showPanel ? (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm">
          <div className="absolute inset-y-0 right-0 w-full max-w-[560px] border-l border-white/10 bg-[#0f172a]/95 shadow-[0_30px_120px_rgba(2,6,23,0.55)]">
            <div className="scrollbar-hidden h-full overflow-y-auto px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Enrollment Console</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Add Student</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Create a student record and prepare a biometric face enrollment profile using the secure capture interface.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPanel(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="mt-8 space-y-6">
                <div className="grid gap-4">
                  <input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Full Name"
                    className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
                  />
                  <input
                    value={form.matric}
                    onChange={(e) => setForm((prev) => ({ ...prev, matric: e.target.value }))}
                    placeholder="Matric Number"
                    className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={form.department}
                      onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                      className="rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                    >
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Software Engineering</option>
                    </select>
                    <select
                      value={form.level}
                      onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                      className="rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                    >
                      <option>100</option>
                      <option>200</option>
                      <option>300</option>
                      <option>400</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Face Enrollment</p>
                      <h3 className="mt-2 text-xl font-bold text-white">Biometric capture</h3>
                    </div>
                    <div className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                      {captureMode}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCaptureMode('Live Camera')}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${captureMode === 'Live Camera' ? 'bg-sky-500 text-white' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}
                    >
                      Live Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => setCaptureMode('Upload Capture')}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${captureMode === 'Upload Capture' ? 'bg-sky-500 text-white' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}
                    >
                      Upload Capture
                    </button>
                  </div>

                  <div className="mt-6 rounded-[30px] border border-sky-400/15 bg-[#121c31] p-6 text-center shadow-[0_20px_60px_rgba(59,130,246,0.12)]">
                    <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-full border border-dashed border-sky-400/40 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_65%)]">
                      <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-sky-400/35">
                        <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-sky-400/40" />
                        <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-sky-400/25" />
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-500/10 text-sky-300">
                          <CameraIcon />
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 text-base font-semibold text-white">Realtime face alignment guidance</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Position the student within the circular frame. Maintain neutral lighting and keep the face centered before capture.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {enrollmentStates.map((state, index) => (
                      <button
                        key={state}
                        type="button"
                        onClick={() => setStateIndex(index)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                          stateIndex === index
                            ? 'border-sky-400/30 bg-sky-500/10 text-sky-300'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span>{state}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${stateIndex === index ? 'bg-sky-400' : 'bg-slate-500'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Save Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setStateIndex(3)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Retake Capture
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
