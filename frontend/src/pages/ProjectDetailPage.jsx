import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { inscreverEmProjeto } from '../services/inscricaoService';
import { buscarProjetoPorId } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const { isAuthenticated, isVolunteer } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isSubscriptionSubmitting, setIsSubscriptionSubmitting] = useState(false);
  const [subscriptionSuccessMessage, setSubscriptionSuccessMessage] = useState('');
  const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState('');

  useEffect(() => {
    let shouldIgnore = false;

    async function loadProjectDetail() {
      if (!projectId || Number.isNaN(Number(projectId))) {
        setNotFound(true);
        setProject(null);
        setErrorMessage('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      setNotFound(false);

      try {
        const response = await buscarProjetoPorId(projectId);

        if (shouldIgnore) {
          return;
        }

        setProject(response);
      } catch (error) {
        if (shouldIgnore) {
          return;
        }

        const statusCode = error?.response?.status;

        if (statusCode === 400 || statusCode === 404) {
          setNotFound(true);
          setProject(null);
          return;
        }

        setErrorMessage(
          getErrorMessage(error, 'Nao foi possivel carregar os detalhes do projeto.'),
        );
        setProject(null);
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    loadProjectDetail();

    return () => {
      shouldIgnore = true;
    };
  }, [projectId, retryCount]);

  function handleRetry() {
    setRetryCount((currentCount) => currentCount + 1);
  }

  async function handleSubscribe() {
    if (!project?.id || !isAuthenticated || !isVolunteer || isSubscriptionSubmitting || subscription) {
      return;
    }

    setIsSubscriptionSubmitting(true);
    setSubscriptionSuccessMessage('');
    setSubscriptionErrorMessage('');

    try {
      const response = await inscreverEmProjeto(project.id);

      setSubscription(response);
      setSubscriptionSuccessMessage('Inscricao enviada. Agora e so aguardar a avaliacao da organizacao.');
    } catch (error) {
      setSubscriptionErrorMessage(
        getErrorMessage(error, 'Nao foi possivel realizar sua inscricao neste projeto.'),
      );
    } finally {
      setIsSubscriptionSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <PageLoader
        description="Consultando o endpoint `GET /projetos/{id}` para montar os detalhes do projeto."
        title="Carregando detalhes do projeto"
      />
    );
  }

  if (notFound) {
    return (
      <StatusPanel
        actions={
          <>
            <Button to={ROUTES.PROJECTS}>Voltar para projetos</Button>
            <Button to={ROUTES.HOME} variant="ghost">Ir para home</Button>
          </>
        }
        description="O projeto solicitado nao foi encontrado ou pode ter sido removido da base."
        title="Projeto nao encontrado"
      />
    );
  }

  if (errorMessage) {
    return (
      <StatusPanel
        actions={
          <>
            <Button to={ROUTES.PROJECTS}>Voltar para projetos</Button>
            <Button onClick={handleRetry} variant="ghost">Tentar novamente</Button>
          </>
        }
        description={errorMessage}
        title="Nao foi possivel carregar este projeto"
        tone="error"
      />
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
              <Button
                disabled={isSubscriptionSubmitting || Boolean(subscription)}
                onClick={handleSubscribe}
                variant="secondary"
              >
                {isSubscriptionSubmitting ? 'Enviando...' : subscription ? 'Inscrito' : 'Inscrever-se'}
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
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.participationTypeLabel}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Periodo</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.dateRangeLabel}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Vagas</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.vacancies}</p>
          </article>
        </div>

        {subscriptionSuccessMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {subscriptionSuccessMessage}
          </div>
        ) : null}

        {subscriptionErrorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {subscriptionErrorMessage}
          </div>
        ) : null}
      </PageSection>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Descricao</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">{project.description}</p>
        </article>

        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Dados do projeto</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>
              <span className="font-semibold text-ink-900">Local:</span> {project.venue}, {project.city} - {project.state}
            </li>
            <li>
              <span className="font-semibold text-ink-900">Status:</span> {project.statusLabel}
            </li>
            <li>
              <span className="font-semibold text-ink-900">Categoria:</span> {project.category}
            </li>
            <li>
              <span className="font-semibold text-ink-900">ID do projeto:</span> {project.id}
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}

export default ProjectDetailPage;
