import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { label: 'Dashboard', path: '/hoc/dashboard' },
  { label: 'Session', path: '/hoc/session' },
  { label: 'Reports', path: '/hoc/reports' },
  { label: 'Students', path: '/hoc/students' },
  { label: 'Courses', path: '/hoc/courses' },
];

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 5.5h7v5H4zM13 5.5h7v8h-7zM4 12.5h7v6H4zM13 15.5h7v3h-7z" stroke="currentColor" strokeWidth="1.5" rx="1.2" />
    </svg>
  );
}

function SessionsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M12 3v5m0 8v5m9-9h-5M8 12H3m15.364 6.364-3.536-3.536M9.172 9.172 5.636 5.636m12.728 0-3.536 3.536M9.172 14.828l-3.536 3.536" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M7 4.75h10A2.25 2.25 0 0 1 19.25 7v10A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17V7A2.25 2.25 0 0 1 7 4.75Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 9h8M8 12h8M8 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StudentsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M15.5 19.25v-1.5a3.25 3.25 0 0 0-3.25-3.25h-4A3.25 3.25 0 0 0 5 17.75v1.5M10.25 11.25A3.25 3.25 0 1 0 10.25 4.75a3.25 3.25 0 0 0 0 6.5Zm8.25 8v-1a2.75 2.75 0 0 0-2.75-2.75h-.75m.5-7.25a2.75 2.75 0 1 1 0 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CoursesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4.75 7.75 12 4.5l7.25 3.25L12 11 4.75 7.75Zm0 0V16.5L12 19.5l7.25-3V7.75" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 11v8.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="m9.75 4.75.5 1.9a5.98 5.98 0 0 1 1.75 0l.5-1.9h1.99l.78 1.8c.53.24 1.02.55 1.45.92l1.9-.4 1 1.73-1.4 1.38c.09.57.09 1.15 0 1.72l1.4 1.39-1 1.72-1.9-.39c-.43.37-.92.68-1.45.92l-.78 1.81H12.5l-.5-1.9a5.98 5.98 0 0 1-1.75 0l-.5 1.9H7.76l-.78-1.81a6.66 6.66 0 0 1-1.45-.92l-1.9.39-1-1.72 1.4-1.39a5.84 5.84 0 0 1 0-1.72l-1.4-1.38 1-1.73 1.9.4c.43-.37.92-.68 1.45-.92l.78-1.8h1.99Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.35" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="m20 20-4.2-4.2m1.7-5.05a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M9 18h6m-7-2V11a4 4 0 1 1 8 0v5l1.5 2h-11L8 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function getNavIcon(label) {
  switch (label) {
    case 'Dashboard':
      return <DashboardIcon />;
    case 'Session':
      return <SessionsIcon />;
    case 'Reports':
      return <ReportsIcon />;
    case 'Students':
      return <StudentsIcon />;
    case 'Courses':
      return <CoursesIcon />;
    default:
      return <DashboardIcon />;
  }
}

export default function HocLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#020817] text-slate-100">
      <div className="relative h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(15,23,42,1))]" />

        <div className="relative mx-auto grid h-screen max-w-[1600px] grid-cols-1 xl:grid-cols-[258px_minmax(0,1fr)]">
          {sidebarOpen ? (
            <button
              type="button"
              aria-label="Close sidebar overlay"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm xl:hidden"
            />
          ) : null}

          <aside
            className={`absolute left-0 top-0 z-40 flex h-screen w-[285px] flex-col border-r border-white/10 bg-[#111a2d] transition-transform duration-300 xl:static xl:w-auto xl:translate-x-0 xl:border-b-0 xl:sticky xl:top-0 xl:z-auto xl:border-r-white/10 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="border-b border-white/10 px-6 py-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white">
                    A
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-white">Attendix</p>
                    <p className="text-sm text-slate-300">Attendance System</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 xl:hidden"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="flex-1 px-5 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                        isActive
                          ? 'border-blue-500/40 bg-blue-500/15 text-blue-300'
                          : 'border-transparent bg-transparent text-white hover:border-white/10 hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={isActive ? 'text-blue-300' : 'text-slate-300'}>{getNavIcon(item.label)}</span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold">{item.label}</span>
                        </span>
                        {isActive ? (
                          <span className="text-blue-300">
                            <ChevronIcon />
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 px-5 py-4">
              <button className="w-full rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 font-semibold text-white transition hover:bg-sky-500/20">
                Logout
              </button>
            </div>
          </aside>

          <main className="scrollbar-hidden h-screen overflow-y-auto bg-[#111a2d]">
            <div className="border-b border-white/10 px-4 py-4 sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-slate-100 transition hover:bg-white/10 xl:hidden"
                  >
                    <MenuIcon />
                  </button>

                  <div className="relative w-full max-w-xl">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <SearchIcon />
                    </span>
                    <input
                      type="text"
                      placeholder="Search students, courses..."
                      className="w-full rounded-2xl border border-white/5 bg-slate-600/40 py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-300 focus:border-sky-400/40"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button className="relative rounded-xl p-2 text-slate-200 transition hover:bg-white/5">
                    <BellIcon />
                    <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                  </button>
                  <button className="rounded-xl p-2 text-slate-200 transition hover:bg-white/5">
                    <SettingsIcon />
                  </button>
                  <div className="hidden h-10 w-px bg-white/10 sm:block" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 font-bold text-white">
                      BUD
                    </div>
                    <div>
                      <p className="font-semibold text-white">HOC BUD</p>
                      <p className="text-sm text-slate-400">2024/2025 SET</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
