import { Link } from 'react-router-dom';
import { getOrganizationProjectEditPath, getProjectDetailPath } from '../../constants/routes';

const projectStatusClassNames = {
  ATIVO: 'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-red-100 text-red-700',
  ENCERRADO: 'bg-slate-100 text-slate-600',
};

function OrganizationProjectCard({ project, subscriptionCount }) {
  const statusClassName = projectStatusClassNames[project.status] ?? 'bg-mist-100 text-slate-600';

  return (
    <article className="surface-card flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
          <span className={`rounded-full px-3 py-1 ${statusClassName}`}>
            {project.statusLabel}
          </span>
          <span className="text-slate-500">{project.category}</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold text-ink-900">{project.title}</h3>
          <p className="text-base text-slate-600">{project.summary}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 border-t border-mist-200 pt-4 text-sm text-slate-500">
        <p>{project.city}, {project.state}</p>
        <p>{project.dateRangeLabel}</p>
        <p>{subscriptionCount} inscricoes recebidas</p>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-mist-300 px-4 py-2 font-semibold text-ink-900 hover:border-forest-500 hover:text-forest-600"
          to={getProjectDetailPath(project.id)}
        >
          Ver projeto
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-forest-500 px-4 py-2 font-semibold text-white hover:bg-forest-600"
          to={getOrganizationProjectEditPath(project.id)}
        >
          Editar
        </Link>
      </div>
    </article>
  );
}

export default OrganizationProjectCard;
