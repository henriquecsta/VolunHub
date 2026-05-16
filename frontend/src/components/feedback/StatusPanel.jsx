function StatusPanel({ title, description, actions, tone = 'default' }) {
  const toneClassName =
    tone === 'error'
      ? 'border-red-200 bg-red-50/70'
      : 'border-white/70 bg-white/85';

  return (
    <section className={`surface-card border p-8 text-center ${toneClassName}`}>
      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
        <p className="text-slate-600">{description}</p>
        {actions ? <div className="flex flex-wrap justify-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export default StatusPanel;
