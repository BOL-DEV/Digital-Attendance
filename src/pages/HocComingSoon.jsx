export default function HocComingSoon({ title, description }) {
  return (
    <div className="flex min-h-[calc(100vh-97px)] items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-3xl rounded-[30px] border border-white/10 bg-white/6 p-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-300/80">Attendix Module</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">{description}</p>
        <div className="mt-8 inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
