import { useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { mockProjects } from '../mocks/projects';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const { isAuthenticated, isVolunteer } = useAuth();
  const project = mockProjects.find((item) => String(item.id) === projectId);

  if (!project) {
    return (
      <section className="surface-card space-y-4 p-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900">Projeto nao encontrado</h1>
        <p className="text-slate-600">O detalhe ainda esta usando dados simulados. Escolha um item da listagem para validar a navegacao.</p>
        <div className="flex flex-wrap gap-3">
          <Button to={ROUTES.PROJECTS}>Voltar para projetos</Button>
          <Button to={ROUTES.HOME} variant="ghost">Ir para home</Button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <PageSection
        eyebrow={project.category}
        title={project.title}
        description={project.summary}
        actions={
          <>
            <Button to={ROUTES.PROJECTS} variant="ghost">
              Voltar para lista
            </Button>
            {isVolunteer ? (
              <Button disabled variant="secondary">
                Inscricao em breve
              </Button>
            ) : !isAuthenticated ? (
              <Button to={ROUTES.LOGIN}>Entrar para participar</Button>
            ) : null}
          </>
        }
      >
        <div className="grid gap-5 md:grid-cols-4">
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Organizacao</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.organization}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Formato</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.participationType}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Periodo</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.startDate} ate {project.endDate}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Vagas</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.vacancies}</p>
          </article>
        </div>
      </PageSection>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Descricao</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">{project.description}</p>
        </article>

        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Preparado para evoluir</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>Endpoint real de detalhe pode substituir o mock sem alterar a estrutura da pagina.</li>
            <li>Espaco reservado para botao de inscricao, historico e gerenciamento da organizacao.</li>
            <li>Componente pronto para receber estados de loading, erro e permissao por perfil.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

export default ProjectDetailPage;
