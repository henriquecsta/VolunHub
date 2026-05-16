function StatCard({ label, value, hint }) {
  return (
    <article className="surface-card p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-4 font-display text-4xl font-semibold text-ink-900">{value}</p>
      {hint ? <p className="mt-3 text-sm text-slate-600">{hint}</p> : null}
    </article>
  );
}

export default StatCard;
