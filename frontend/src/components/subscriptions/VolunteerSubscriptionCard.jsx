import { Link } from 'react-router-dom';
import { getProjectDetailPath } from '../../constants/routes';

const statusClassNames = {
  APROVADA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-slate-100 text-slate-600',
  PENDENTE: 'bg-amber-100 text-amber-700',
  RECUSADA: 'bg-red-100 text-red-700',
};

function VolunteerSubscriptionCard({ subscription }) {
  const statusClassName = statusClassNames[subscription.status] ?? 'bg-mist-100 text-slate-600';

  return (
    <article className="surface-card flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          <span className={`rounded-full px-3 py-1 ${statusClassName}`}>
            {subscription.statusLabel}
          </span>
          <span className="text-slate-500">{subscription.subscribedAtLabel}</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold text-ink-900">
            {subscription.projectTitle}
          </h3>
          <p className="text-base text-slate-600">{subscription.projectSummary}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-mist-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Projeto {subscription.projectStatusLabel}</p>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-mist-300 px-4 py-2 text-sm font-semibold text-ink-900 hover:border-forest-500 hover:text-forest-600"
          to={getProjectDetailPath(subscription.projectId)}
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}

export default VolunteerSubscriptionCard;
