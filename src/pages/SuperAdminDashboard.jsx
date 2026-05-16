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

const stats = [
  { label: 'Total HOC Accounts', value: '48', subtext: 'Across active faculties', tone: 'bg-blue-500/20 text-blue-300' },
  { label: 'Pending Approvals', value: '6', subtext: 'Awaiting verification', tone: 'bg-amber-500/20 text-amber-300' },
  { label: 'Active Institutions', value: '12', subtext: 'Currently onboarded', tone: 'bg-cyan-500/20 text-cyan-300' },
  { label: 'Secure Sessions', value: '124', subtext: 'Running today', tone: 'bg-emerald-500/20 text-emerald-300' },
];

const hocAccounts = [
  { name: 'Dr. Johnson', faculty: 'Engineering', email: 'johnson@attendix.edu', status: 'Active' },
  { name: 'Prof. Martins', faculty: 'Computing', email: 'martins@attendix.edu', status: 'Pending' },
  { name: 'Dr. Aina', faculty: 'Sciences', email: 'aina@attendix.edu', status: 'Active' },
];

function StatusBadge({ status }) {
  const styles = {
    Active: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
    Pending: 'border-amber-400/20 bg-amber-500/10 text-amber-300',
  };

  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-slate-100">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_#0b1324_0%,_#08111f_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:88px_88px]" />
        <div className="relative mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <header className="rounded-[30px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Super Admin Console</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Attendix Administrative Control</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
              This is the build-phase landing page for super admins. HOC account creation, approval workflows, and institutional controls will be expanded from here.
            </p>
          </header>

          <section className="mt-8 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
            {stats.map((item) => (
              <StatCard key={item.label} {...item} />
            ))}
          </section>

          <section className="mt-8 rounded-[30px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">Build Preview</p>
                <h2 className="mt-2 text-2xl font-bold text-white">HOC account management</h2>
              </div>
              <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400">
                Create HOC Account
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Faculty</th>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hocAccounts.map((account) => (
                    <tr key={account.email} className="bg-[#233047] text-sm text-slate-200 shadow-[0_14px_35px_rgba(2,6,23,0.18)]">
                      <td className="rounded-l-2xl px-4 py-4 font-semibold text-white">{account.name}</td>
                      <td className="px-4 py-4 text-slate-300">{account.faculty}</td>
                      <td className="px-4 py-4 text-slate-300">{account.email}</td>
                      <td className="px-4 py-4"><StatusBadge status={account.status} /></td>
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
      </div>
    </div>
  );
}
