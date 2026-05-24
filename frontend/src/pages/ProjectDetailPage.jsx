import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import ProjectSubscriptionFeedback from '../components/projects/ProjectSubscriptionFeedback';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { buscarMinhaInscricaoNoProjeto, inscreverEmProjeto } from '../services/inscricaoService';
import { buscarProjetoPorId } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isOrganization, isVolunteer, token } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [isSubscriptionChecking, setIsSubscriptionChecking] = useState(false);
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
      setSubscription(null);
      setSubscriptionSuccessMessage('');
      setSubscriptionErrorMessage('');

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
          getErrorMessage(error, 'Não foi possível carregar os detalhes do projeto.'),
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

  useEffect(() => {
    let shouldIgnore = false;

    async function loadCurrentSubscription() {
      if (!project?.id || !isAuthenticated || !isVolunteer || !token) {
        setSubscription(null);
        setIsSubscriptionChecking(false);
        return;
      }

      setIsSubscriptionChecking(true);
      setSubscriptionErrorMessage('');

      try {
        const response = await buscarMinhaInscricaoNoProjeto(project.id);

        if (!shouldIgnore) {
          setSubscription(response);
        }
      } catch (error) {
        if (!shouldIgnore && error?.response?.status !== 401) {
          setSubscriptionErrorMessage(
            getErrorMessage(error, 'Não foi possível verificar sua inscrição neste projeto.'),
          );
        }
      } finally {
        if (!shouldIgnore) {
          setIsSubscriptionChecking(false);
        }
      }
    }

    loadCurrentSubscription();

    return () => {
      shouldIgnore = true;
    };
  }, [isAuthenticated, isVolunteer, project?.id, token]);

  function handleRetry() {
    setRetryCount((currentCount) => currentCount + 1);
  }

  function handleLoginRedirect() {
    navigate(ROUTES.LOGIN, {
      state: { from: location },
    });
  }

  async function handleSubscribe() {
    if (!isAuthenticated || !token) {
      handleLoginRedirect();
      return;
    }

    if (
      !project?.id ||
      !isVolunteer ||
      project.status !== 'ATIVO' ||
      isSubscriptionChecking ||
      isSubscriptionSubmitting ||
      subscription
    ) {
      return;
    }

    setIsSubscriptionSubmitting(true);
    setSubscriptionSuccessMessage('');
    setSubscriptionErrorMessage('');

    try {
      const response = await inscreverEmProjeto(project.id);

      setSubscription(response);
      setSubscriptionSuccessMessage('Inscrição enviada. Agora é só aguardar a avaliação da organização.');
    } catch (error) {
      const message = getErrorMessage(error, 'Não foi possível realizar sua inscrição neste projeto.');

      if (isDuplicateSubscriptionError(error, message)) {
        setSubscription({
          id: null,
          projectId: project.id,
          projectTitle: project.title,
          status: 'PENDENTE',
          statusLabel: 'Pendente',
        });
        return;
      }

      if (error?.response?.status === 401) {
        handleLoginRedirect();
        return;
      }

      setSubscriptionErrorMessage(message);
    } finally {
      setIsSubscriptionSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <PageLoader
        description="Buscando as informações mais recentes do projeto."
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
            <Button to={ROUTES.HOME} variant="ghost">Ir para início</Button>
          </>
        }
        description="O projeto solicitado não foi encontrado ou pode ter sido removido."
        title="Projeto não encontrado"
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
        title="Não foi possível carregar este projeto"
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
            {isOrganization ? null : isVolunteer ? (
              <Button
                disabled={
                  project.status !== 'ATIVO' ||
                  isSubscriptionChecking ||
                  isSubscriptionSubmitting ||
                  Boolean(subscription)
                }
                onClick={handleSubscribe}
                variant="secondary"
              >
                {getSubscriptionButtonLabel({
                  isSubscriptionChecking,
                  isSubscriptionSubmitting,
                  projectStatus: project.status,
                  subscription,
                })}
              </Button>
            ) : !isAuthenticated ? (
              <Button onClick={handleLoginRedirect}>Entrar para participar</Button>
            ) : null}
          </>
        }
      >
        <div className="grid gap-5 md:grid-cols-4">
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Organização</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.organization}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Formato</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.participationTypeLabel}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Período</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.dateRangeLabel}</p>
          </article>
          <article className="surface-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Vagas</p>
            <p className="mt-3 text-lg font-semibold text-ink-900">{project.vacancies}</p>
          </article>
        </div>

        <ProjectSubscriptionFeedback
          errorMessage={subscriptionErrorMessage}
          isAuthenticated={isAuthenticated}
          isChecking={isSubscriptionChecking}
          isSubmitting={isSubscriptionSubmitting}
          isVolunteer={isVolunteer}
          projectStatus={project.status}
          subscription={subscription}
          successMessage={subscriptionSuccessMessage}
        />
      </PageSection>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Descrição</h2>
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

function getSubscriptionButtonLabel({
  isSubscriptionChecking,
  isSubscriptionSubmitting,
  projectStatus,
  subscription,
}) {
  if (projectStatus !== 'ATIVO') {
    return 'Inscrições indisponíveis';
  }

  if (isSubscriptionChecking) {
    return 'Verificando...';
  }

  if (isSubscriptionSubmitting) {
    return 'Enviando...';
  }

  if (subscription) {
    return 'Já inscrito';
  }

  return 'Inscrever-se';
}

function isDuplicateSubscriptionError(error, message) {
  return (
    error?.response?.status === 400 &&
    (message.toLowerCase().includes('já está inscrito') ||
      message.toLowerCase().includes('ja esta inscrito'))
  );
}

export default ProjectDetailPage;
