import { getOrganizationProjectEditPath, getProjectDetailPath } from '../../constants/routes';
import Button from '../ui/Button';

const projectStatusClassNames = {
  ATIVO: 'bg-emerald-100 text-emerald-700',
  CANCELADO: 'bg-red-100 text-red-700',
  ENCERRADO: 'bg-slate-100 text-slate-600',
};

function OrganizationProjectCard({ actionState, onDelete, project, subscriptionCount }) {
  const statusClassName = projectStatusClassNames[project.status] ?? 'bg-mist-100 text-slate-600';
  const isDeleting = actionState?.type === 'delete';
  const isActionRunning = Boolean(actionState);

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
        <Button size="sm" to={getProjectDetailPath(project.id)} variant="ghost">
          Ver projeto
        </Button>
        <Button size="sm" to={getOrganizationProjectEditPath(project.id)} variant="secondary">
          Editar
        </Button>
        {onDelete ? (
          <Button
            disabled={isActionRunning}
            onClick={() => onDelete(project)}
            size="sm"
            variant="outline"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export default OrganizationProjectCard;
