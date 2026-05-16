const subscriptionStatusClassNames = {
  APROVADA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-slate-100 text-slate-600',
  PENDENTE: 'bg-amber-100 text-amber-700',
  RECUSADA: 'bg-red-100 text-red-700',
};

function OrganizationSubscriptionCard({ actions, subscription }) {
  const statusClassName = subscriptionStatusClassNames[subscription.status] ?? 'bg-mist-100 text-slate-600';

  return (
    <article className="surface-card p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
            <span className={`rounded-full px-3 py-1 ${statusClassName}`}>
              {subscription.statusLabel}
            </span>
            <span className="text-slate-500">{subscription.subscribedAtLabel}</span>
          </div>

          <div>
            <h3 className="font-display text-2xl font-semibold text-ink-900">
              {subscription.volunteerName}
            </h3>
            <p className="mt-1 text-sm font-semibold text-clay-700">
              {subscription.projectTitle}
            </p>
          </div>
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </article>
  );
}

export default OrganizationSubscriptionCard;
