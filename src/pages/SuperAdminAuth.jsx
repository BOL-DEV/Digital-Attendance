import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 4 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.7 6.18A9.88 9.88 0 0 1 12 6c5.5 0 9 6 9 6a17.6 17.6 0 0 1-3.06 3.62M6.52 8.53C4.18 10.5 3 12 3 12s3.5 6 9 6c1.5 0 2.85-.45 4.03-1.1M9.88 9.88A3 3 0 0 0 12 15a2.99 2.99 0 0 0 2.12-.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />;
}

function SecurityBadge({ text }) {
  return (
    <div className="rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
      {text}
    </div>
  );
}

export default function SuperAdminAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    if (!email.trim() || !password.trim()) {
      setError('Invalid credentials. Enter your authorized admin email and password.');
      setSubmitting(false);
      return;
    }

    if (!email.toLowerCase().includes('admin')) {
      setError('Unauthorized access warning. This portal is restricted to approved super administrators.');
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    toast.success('Successful authentication');
    window.setTimeout(() => {
      setSubmitting(false);
      navigate('/admin/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#08111f] text-slate-100">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_85%_20%,_rgba(56,189,248,0.10),_transparent_24%),linear-gradient(180deg,_#0b1324_0%,_#08111f_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] [background-size:88px_88px]" />

        <div className="relative mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-white/6 shadow-[0_30px_120px_rgba(2,6,23,0.5)] backdrop-blur-xl lg:grid-cols-[1fr_520px]">
            <section className="hidden border-r border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.72))] p-10 lg:flex lg:flex-col lg:justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-500/10 text-xl font-bold text-sky-300">
                    A
                  </div>
                  <div>
                    <p className="text-2xl font-bold tracking-tight text-white">Attendix</p>
                    <p className="text-sm text-slate-400">Biometric Attendance Platform</p>
                  </div>
                </div>

                <div className="mt-16 max-w-lg">
                  <SecurityBadge text="Authorized Personnel Only" />
                  <h1 className="mt-6 text-5xl font-bold tracking-tight text-white">Super Admin Access</h1>
                  <p className="mt-5 text-base leading-8 text-slate-300">
                    Securely authenticate into the Attendix control layer to manage HOC accounts, oversee biometric attendance infrastructure, and maintain institutional verification integrity.
                  </p>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#152034]/75 p-6">
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-[26px] border border-sky-400/10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_64%)]">
                  <div className="absolute h-56 w-56 rounded-full border border-sky-400/20" />
                  <div className="absolute h-72 w-72 rounded-full border border-sky-400/10" />
                  <div className="absolute h-40 w-40 rounded-[36px] border border-sky-400/25 bg-sky-500/10 backdrop-blur-sm" />
                  <div className="absolute h-28 w-28 rounded-full border border-sky-300/40" />
                  <div className="absolute inset-x-16 top-1/2 h-px -translate-y-1/2 bg-sky-400/25" />
                  <div className="absolute inset-y-16 left-1/2 w-px -translate-x-1/2 bg-sky-400/15" />
                  <div className="absolute left-1/2 top-8 h-5 w-5 -translate-x-1/2 rounded-full bg-sky-400 shadow-[0_0_35px_rgba(56,189,248,0.65)]" />
                </div>
                <p className="mt-5 text-sm font-semibold text-white">Secure biometric attendance infrastructure</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  University-grade identity verification with trusted session controls and protected administrative governance.
                </p>
              </div>
            </section>

            <section className="p-6 sm:p-8 lg:p-10">
              <div className="mx-auto max-w-md">
                <div className="lg:hidden">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-sky-400/20 bg-sky-500/10 text-lg font-bold text-sky-300">
                      A
                    </div>
                    <div>
                      <p className="text-xl font-bold tracking-tight text-white">Attendix</p>
                      <p className="text-sm text-slate-400">Super Admin Portal</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 lg:mt-0">
                  <SecurityBadge text="Institutional Verification" />
                  <h2 className="mt-6 text-4xl font-bold tracking-tight text-white">Secure Access</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Log in to manage HOC accounts and oversee the Attendix management platform.
                  </p>
                </div>

                <div className="mt-8 rounded-[30px] border border-white/10 bg-[#111b2f]/85 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)]">
                  {success ? (
                    <div className="text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-2xl text-emerald-300">
                          ✓
                        </div>
                      </div>
                      <h3 className="mt-6 text-2xl font-bold text-white">Authentication Successful</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        Redirecting to secure administrative controls for HOC account provisioning and platform oversight.
                      </p>
                      <div className="mt-6 flex items-center justify-center gap-3 text-sm font-medium text-sky-300">
                        <Spinner />
                        Redirect loading transition
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Admin Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@attendix.edu"
                          className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-sky-400/40 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter secure password"
                            className="w-full rounded-2xl border border-white/10 bg-[#182338] px-4 py-4 pr-12 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-sky-400/40 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                          >
                            <EyeIcon open={showPassword} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 text-sm">
                        <label className="flex items-center gap-3 text-slate-300">
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="h-4 w-4 rounded border-white/10 bg-[#182338] text-sky-500 focus:ring-sky-400/40"
                          />
                          Remember session
                        </label>
                        <button type="button" className="font-medium text-sky-300 transition hover:text-sky-200">
                          Forgot password?
                        </button>
                      </div>

                      {error ? (
                        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-300">
                          {error}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-400">
                          Secure access to HOC account creation, institutional session controls, and protected attendance infrastructure.
                        </div>
                      )}

                      <div className="grid gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <Spinner />
                              Authenticating...
                            </>
                          ) : (
                            'Login'
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={submitting}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:opacity-50"
                        >
                          Secure Access
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <SecurityBadge text="Authorized Personnel Only" />
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 uppercase tracking-[0.18em]">
                    Enterprise Security
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
