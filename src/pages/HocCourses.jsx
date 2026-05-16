import { useMemo, useState } from 'react';

const semesterOptions = ['All Semesters', 'First Semester', 'Second Semester'];
const departments = ['Computer Science', 'Information Technology', 'Software Engineering', 'Mathematics'];

const initialCourses = [
  {
    id: '1',
    code: 'CSC301',
    title: 'Advanced Algorithms',
    lecturer: 'Dr. Johnson',
    department: 'Computer Science',
    level: '300',
    semester: 'First Semester',
    schedule: 'Mon • 11:00 AM - 1:00 PM',
    attendanceRate: '91%',
    status: 'Active',
    sessions: 14,
  },
  {
    id: '2',
    code: 'IFT212',
    title: 'Database Systems',
    lecturer: 'Prof. Martins',
    department: 'Information Technology',
    level: '200',
    semester: 'First Semester',
    schedule: 'Wed • 2:00 PM - 4:00 PM',
    attendanceRate: '88%',
    status: 'Upcoming',
    sessions: 9,
  },
  {
    id: '3',
    code: 'SEN310',
    title: 'Software Architecture',
    lecturer: 'Dr. Ibrahim',
    department: 'Software Engineering',
    level: '300',
    semester: 'Second Semester',
    schedule: 'Thu • 10:00 AM - 12:00 PM',
    attendanceRate: '84%',
    status: 'Active',
    sessions: 11,
  },
  {
    id: '4',
    code: 'MTH204',
    title: 'Engineering Mathematics',
    lecturer: 'Dr. Aina',
    department: 'Mathematics',
    level: '200',
    semester: 'Second Semester',
    schedule: 'Fri • 8:00 AM - 10:00 AM',
    attendanceRate: '93%',
    status: 'Completed',
    sessions: 16,
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="m20 20-4.2-4.2m1.7-5.05a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    Upcoming: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
    Completed: 'border-sky-400/20 bg-sky-500/10 text-sky-300',
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
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

export default function HocCourses() {
  const [courses, setCourses] = useState(initialCourses);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('All Semesters');
  const [showPanel, setShowPanel] = useState(false);
  const [form, setForm] = useState({
    title: '',
    code: '',
    lecturer: '',
    department: 'Computer Science',
    level: '100',
    semester: 'First Semester',
    classDay: 'Monday',
    startTime: '10:00',
    endTime: '12:00',
    duration: '90 mins',
    timeout: '45 mins',
    threshold: '75%',
  });

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.code.toLowerCase().includes(search.toLowerCase()) ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.lecturer.toLowerCase().includes(search.toLowerCase());

      const matchesSemester = semester === 'All Semesters' ? true : course.semester === semester;
      return matchesSearch && matchesSemester;
    });
  }, [courses, search, semester]);

  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter((course) => course.status === 'Active').length;
    const completedSessions = courses.reduce((sum, course) => sum + course.sessions, 0);
    const upcoming = courses.filter((course) => course.status === 'Upcoming').length;

    return [
      { label: 'Total Courses', value: total, subtext: 'Managed academic units', tone: 'bg-blue-500/20 text-blue-300' },
      { label: 'Active Courses', value: active, subtext: 'Currently running classes', tone: 'bg-emerald-500/20 text-emerald-300' },
      { label: 'Completed Sessions', value: completedSessions, subtext: 'Logged attendance sessions', tone: 'bg-cyan-500/20 text-cyan-300' },
      { label: 'Upcoming Classes', value: upcoming, subtext: 'Scheduled to begin soon', tone: 'bg-amber-500/20 text-amber-300' },
    ];
  }, [courses]);

  const handleCreateCourse = (e) => {
    e.preventDefault();

    const newCourse = {
      id: `${Date.now()}`,
      code: form.code.toUpperCase() || 'NEW101',
      title: form.title || 'New Course',
      lecturer: form.lecturer || 'Assigned Lecturer',
      department: form.department,
      level: form.level,
      semester: form.semester,
      schedule: `${form.classDay.slice(0, 3)} • ${form.startTime} - ${form.endTime}`,
      attendanceRate: '0%',
      status: 'Upcoming',
      sessions: 0,
    };

    setCourses((prev) => [newCourse, ...prev]);
    setShowPanel(false);
    setForm({
      title: '',
      code: '',
      lecturer: '',
      department: 'Computer Science',
      level: '100',
      semester: 'First Semester',
      classDay: 'Monday',
      startTime: '10:00',
      endTime: '12:00',
      duration: '90 mins',
      timeout: '45 mins',
      threshold: '75%',
    });
  };

  return (
    <>
      <div className="space-y-8 px-4 py-8 sm:px-8">
        <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Academic Session Control</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Courses</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
              Create and coordinate course schedules, assign lecturers, and define attendance session structure across the academic calendar.
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
                placeholder="Search course code, title, lecturer..."
                className="w-full rounded-2xl border border-white/10 bg-[#233047] py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-400 focus:border-sky-400/40"
              />
            </div>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#233047] px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/40"
            >
              {semesterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowPanel(true)}
              className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Create Course
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
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Course Registry</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Attendance-enabled course management</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
              {filteredCourses.length} courses
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-2 font-semibold">Course Code</th>
                  <th className="px-4 py-2 font-semibold">Course Title</th>
                  <th className="px-4 py-2 font-semibold">Assigned Lecturer</th>
                  <th className="px-4 py-2 font-semibold">Department</th>
                  <th className="px-4 py-2 font-semibold">Class Schedule</th>
                  <th className="px-4 py-2 font-semibold">Attendance Rate</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="bg-[#233047] text-sm text-slate-200 shadow-[0_14px_35px_rgba(2,6,23,0.18)]">
                    <td className="rounded-l-2xl px-4 py-4 font-semibold text-sky-300">{course.code}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-white">{course.title}</p>
                        <p className="mt-1 text-xs text-slate-400">Level {course.level} • {course.semester}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300">{course.lecturer}</td>
                    <td className="px-4 py-4 text-slate-300">{course.department}</td>
                    <td className="px-4 py-4 text-slate-300">{course.schedule}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                        {course.attendanceRate}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="rounded-r-2xl px-4 py-4">
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
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
          <div className="absolute inset-y-0 right-0 w-full max-w-[620px] border-l border-white/10 bg-[#0f172a]/95 shadow-[0_30px_120px_rgba(2,6,23,0.55)]">
            <div className="scrollbar-hidden h-full overflow-y-auto px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Course Setup</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Create Course</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Configure a new course, assign its lecturer, define schedule details, and set attendance session rules for biometric tracking.
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

              <form onSubmit={handleCreateCourse} className="mt-8 space-y-6">
                <div className="grid gap-4">
                  <input
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Course Title"
                    className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
                  />
                  <input
                    value={form.code}
                    onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="Course Code"
                    className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm uppercase text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
                  />
                  <input
                    value={form.lecturer}
                    onChange={(e) => setForm((prev) => ({ ...prev, lecturer: e.target.value }))}
                    placeholder="Lecturer Name"
                    className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-400/40"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    value={form.department}
                    onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                  >
                    {departments.map((department) => (
                      <option key={department}>{department}</option>
                    ))}
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
                  <select
                    value={form.semester}
                    onChange={(e) => setForm((prev) => ({ ...prev, semester: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                  >
                    <option>First Semester</option>
                    <option>Second Semester</option>
                  </select>
                  <select
                    value={form.classDay}
                    onChange={(e) => setForm((prev) => ({ ...prev, classDay: e.target.value }))}
                    className="rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                  </select>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Class Schedule</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Start Time</label>
                      <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-white outline-none focus:border-sky-400/40"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">End Time</label>
                      <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-white outline-none focus:border-sky-400/40"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Session Duration</label>
                      <select
                        value={form.duration}
                        onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                      >
                        <option>60 mins</option>
                        <option>90 mins</option>
                        <option>120 mins</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Automatic Timeout</label>
                      <select
                        value={form.timeout}
                        onChange={(e) => setForm((prev) => ({ ...prev, timeout: e.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                      >
                        <option>30 mins</option>
                        <option>45 mins</option>
                        <option>60 mins</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Attendance Session Rules</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Attendance Threshold</label>
                      <select
                        value={form.threshold}
                        onChange={(e) => setForm((prev) => ({ ...prev, threshold: e.target.value }))}
                        className="w-full rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-sky-400/40"
                      >
                        <option>60%</option>
                        <option>70%</option>
                        <option>75%</option>
                        <option>80%</option>
                      </select>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#1b2439] px-4 py-3.5 text-sm text-slate-300">
                      Session rules will apply to biometric attendance closing time, scan validity, and automated reporting behavior.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Save Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPanel(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Cancel
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
