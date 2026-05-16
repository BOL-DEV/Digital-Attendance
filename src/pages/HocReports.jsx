import { useMemo, useState } from 'react';

const analyticsCards = [
  {
    label: 'Total Attendance Sessions',
    value: '128',
    detail: 'Across all tracked courses',
    tone: 'bg-blue-500/20 text-blue-300',
  },
  {
    label: 'Average Attendance',
    value: '87.6%',
    detail: 'Semester-wide performance',
    tone: 'bg-cyan-500/20 text-cyan-300',
  },
  {
    label: 'Successful Verifications',
    value: '5,842',
    detail: 'Biometric matches confirmed',
    tone: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    label: 'Failed Verifications',
    value: '114',
    detail: 'Manual review candidates',
    tone: 'bg-rose-500/20 text-rose-300',
  },
];

const trendData = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 84 },
  { day: 'Wed', value: 78 },
  { day: 'Thu', value: 92 },
  { day: 'Fri', value: 88 },
  { day: 'Sat', value: 64 },
];

const courseComparison = [
  { code: 'CSC301', value: 91 },
  { code: 'MTH204', value: 83 },
  { code: 'IFT212', value: 88 },
  { code: 'SEN310', value: 76 },
];

const verificationBreakdown = [
  { label: 'Verified', value: '96.8%', tone: 'bg-emerald-500' },
  { label: 'Pending Review', value: '2.1%', tone: 'bg-amber-500' },
  { label: 'Rejected', value: '1.1%', tone: 'bg-rose-500' },
];

const sessions = [
  {
    id: '1',
    name: 'Advanced Algorithms - Week 5',
    code: 'CSC301',
    lecturer: 'Dr. Johnson',
    totalStudents: 48,
    successful: 45,
    failed: 2,
    percentage: '93.7%',
    date: 'Jan 15, 2026',
  },
  {
    id: '2',
    name: 'Software Architecture - Week 4',
    code: 'SEN310',
    lecturer: 'Dr. Ibrahim',
    totalStudents: 42,
    successful: 35,
    failed: 4,
    percentage: '83.3%',
    date: 'Jan 14, 2026',
  },
  {
    id: '3',
    name: 'Database Systems - Week 6',
    code: 'IFT212',
    lecturer: 'Prof. Martins',
    totalStudents: 56,
    successful: 50,
    failed: 1,
    percentage: '89.3%',
    date: 'Jan 13, 2026',
  },
  {
    id: '4',
    name: 'Engineering Mathematics - Week 3',
    code: 'MTH204',
    lecturer: 'Dr. Aina',
    totalStudents: 61,
    successful: 52,
    failed: 3,
    percentage: '85.2%',
    date: 'Jan 12, 2026',
  },
];

const dateRanges = ['This Week', 'This Month', 'This Semester', 'Custom Range'];
const courseFilters = ['All Courses', 'CSC301', 'MTH204', 'IFT212', 'SEN310'];

function AnalyticsCard({ label, value, detail, tone }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#233047] p-5 shadow-[0_18px_45px_rgba(2,6,23,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className="mt-4 text-4xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${tone}`}>
          •
        </span>
      </div>
    </div>
  );
}

function ChartPanel({ eyebrow, title, description, children }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function HocReports() {
  const [dateRange, setDateRange] = useState('This Semester');
  const [courseFilter, setCourseFilter] = useState('All Courses');

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      return courseFilter === 'All Courses' ? true : session.code === courseFilter;
    });
  }, [courseFilter]);

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Attendance Intelligence</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Reports</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Review biometric attendance performance, compare course outcomes, and export secure academic attendance records from one reporting workspace.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#233047] px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/40"
          >
            {dateRanges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-[#233047] px-4 py-3 text-sm text-slate-100 outline-none focus:border-sky-400/40"
          >
            {courseFilters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
            Export PDF
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
            Export Excel
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {analyticsCards.map((item) => (
          <AnalyticsCard key={item.label} {...item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartPanel
          eyebrow="Trend"
          title="Weekly attendance graph"
          description={`Attendance trend overview for ${dateRange.toLowerCase()} with biometric validation applied across active lecture sessions.`}
        >
          <div className="rounded-[24px] border border-white/8 bg-[#233047] p-5">
            <div className="flex h-72 items-end gap-4">
              {trendData.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-56 w-full items-end rounded-2xl bg-slate-900/40 p-2">
                    <div
                      className="w-full rounded-xl bg-gradient-to-t from-sky-500 to-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.25)]"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">{item.value}%</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.day}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartPanel>

        <div className="space-y-6">
          <ChartPanel
            eyebrow="Comparison"
            title="Course attendance comparison"
            description="Measure class participation levels across major courses."
          >
            <div className="space-y-4">
              {courseComparison.map((item) => (
                <div key={item.code} className="rounded-2xl border border-white/8 bg-[#233047] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-semibold text-white">{item.code}</p>
                    <p className="text-sm font-semibold text-sky-300">{item.value}%</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700/70">
                    <div className="h-full rounded-full bg-sky-400" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </ChartPanel>

          <ChartPanel
            eyebrow="Verification"
            title="Success rate visualization"
            description="Biometric verification performance split for the current reporting window."
          >
            <div className="rounded-[24px] border border-white/8 bg-[#233047] p-5">
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full border-[18px] border-slate-700/70 border-t-emerald-400 border-r-cyan-400 border-b-amber-400">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">96.8%</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">Verified</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {verificationBreakdown.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/25 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${item.tone}`} />
                      <span className="text-sm font-medium text-slate-200">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartPanel>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl lg:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Attendance Records</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Session exports and performance logs</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10">
              Download Attendance Sheet
            </button>
            <button className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
              Generate Semester Summary
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4 py-2 font-semibold">Session Name</th>
                <th className="px-4 py-2 font-semibold">Course Code</th>
                <th className="px-4 py-2 font-semibold">Lecturer</th>
                <th className="px-4 py-2 font-semibold">Total Students</th>
                <th className="px-4 py-2 font-semibold">Successful</th>
                <th className="px-4 py-2 font-semibold">Failed</th>
                <th className="px-4 py-2 font-semibold">Attendance %</th>
                <th className="px-4 py-2 font-semibold">Session Date</th>
                <th className="px-4 py-2 font-semibold">Export</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.id} className="bg-[#233047] text-sm text-slate-200 shadow-[0_14px_35px_rgba(2,6,23,0.18)]">
                  <td className="rounded-l-2xl px-4 py-4">
                    <div>
                      <p className="font-semibold text-white">{session.name}</p>
                      <p className="mt-1 text-xs text-slate-400">Attendance session analytics</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-300">{session.code}</td>
                  <td className="px-4 py-4 text-slate-300">{session.lecturer}</td>
                  <td className="px-4 py-4 text-slate-300">{session.totalStudents}</td>
                  <td className="px-4 py-4 text-emerald-300">{session.successful}</td>
                  <td className="px-4 py-4 text-rose-300">{session.failed}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                      {session.percentage}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{session.date}</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex gap-2">
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
                        PDF
                      </button>
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
                        Excel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
