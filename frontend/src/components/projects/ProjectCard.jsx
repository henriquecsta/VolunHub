import { Link } from 'react-router-dom';
import { getProjectDetailPath } from '../../constants/routes';

function ProjectCard({ project }) {
  return (
    <article className="surface-card flex h-full flex-col justify-between p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="rounded-full bg-forest-100 px-3 py-1 text-forest-700">{project.category}</span>
          <span>{project.city}, {project.state}</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-semibold text-ink-900">{project.title}</h3>
          <p className="text-sm font-semibold text-clay-700">{project.organization}</p>
          <p className="text-base text-slate-600">{project.summary}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          <p>{project.participationTypeLabel ?? project.participationType}</p>
          <p>{project.vacancies} vagas</p>
        </div>
        <Link
          className="rounded-full border border-mist-300 px-4 py-2 text-sm font-semibold text-ink-900 hover:border-forest-500 hover:text-forest-600"
          to={getProjectDetailPath(project.id)}
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
