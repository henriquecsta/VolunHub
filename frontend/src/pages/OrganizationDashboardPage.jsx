import { useEffect, useState } from 'react';
import StatCard from '../components/common/StatCard';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import OrganizationProjectCard from '../components/organization/OrganizationProjectCard';
import OrganizationSubscriptionCard from '../components/organization/OrganizationSubscriptionCard';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { atualizarStatusInscricao, listarInscricoesDoProjeto } from '../services/inscricaoService';
import { excluirProjeto, listarProjetosDaOrganizacao } from '../services/projetoService';
import { getErrorMessage } from '../utils/http';

function OrganizationDashboardPage() {
  const { email, idUsuario } = useAuth();
  const [projects, setProjects] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionsByProjectId, setSubscriptionsByProjectId] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [projectActionsById, setProjectActionsById] = useState({});
  const [projectActionErrorMessage, setProjectActionErrorMessage] = useState('');
  const [projectActionSuccessMessage, setProjectActionSuccessMessage] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadDashboard() {
      setIsLoading(true);
      setErrorMessage('');
      setActionErrorMessage('');
      setActionSuccessMessage('');
      setProjectActionErrorMessage('');
      setProjectActionSuccessMessage('');

      try {
        const organizationProjects = await listarProjetosDaOrganizacao(idUsuario);
        const subscriptionsEntries = await Promise.all(
          organizationProjects.map(async (project) => {
            const projectSubscriptions = await listarInscricoesDoProjeto(project.id);

            return [
              project.id,
              projectSubscriptions.map((subscription) => ({
                ...subscription,
                projectTitle: project.title,
                projectStatus: project.status,
                projectStatusLabel: project.statusLabel,
              })),
            ];
          }),
        );
        const nextSubscriptionsByProjectId = Object.fromEntries(subscriptionsEntries);
        const nextSubscriptions = subscriptionsEntries.flatMap(([, projectSubscriptions]) => projectSubscriptions);

        if (!shouldIgnore) {
          setProjects(organizationProjects);
          setSubscriptionsByProjectId(nextSubscriptionsByProjectId);
          setSubscriptions(nextSubscriptions);
        }
      } catch (error) {
        if (!shouldIgnore) {
          setErrorMessage(
            getErrorMessage(error, 'Nao foi possivel carregar o dashboard da organizacao.'),
          );
          setProjects([]);
          setSubscriptions([]);
          setSubscriptionsByProjectId({});
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      shouldIgnore = true;
    };
  }, [idUsuario, refreshCount]);

  const pendingCount = subscriptions.filter((subscription) => subscription.status === 'PENDENTE').length;
  const hasProjects = projects.length > 0;
  const hasSubscriptions = subscriptions.length > 0;

  function handleRefresh() {
    setRefreshCount((currentCount) => currentCount + 1);
  }

  async function handleDeleteProject(project) {
    if (!project?.id || projectActionsById[project.id]) {
      return;
    }

    if (!canManageProject(project, idUsuario)) {
      setProjectActionErrorMessage('Voce so pode excluir projetos criados pela sua organizacao.');
      setProjectActionSuccessMessage('');
      return;
    }

    const confirmed = window.confirm(
      `Excluir o projeto "${project.title}"? Esta acao nao pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setProjectActionsById((currentActions) => ({
      ...currentActions,
      [project.id]: { type: 'delete' },
    }));
    setProjectActionErrorMessage('');
    setProjectActionSuccessMessage('');

    try {
      await excluirProjeto(project.id);

      setProjects((currentProjects) =>
        currentProjects.filter((currentProject) => currentProject.id !== project.id),
      );
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.filter((subscription) => subscription.projectId !== project.id),
      );
      setSubscriptionsByProjectId((currentSubscriptionsByProjectId) => {
        const nextSubscriptionsByProjectId = { ...currentSubscriptionsByProjectId };
        delete nextSubscriptionsByProjectId[project.id];
        return nextSubscriptionsByProjectId;
      });
      setProjectActionSuccessMessage('Projeto excluido com sucesso.');
    } catch (error) {
      setProjectActionErrorMessage(
        getErrorMessage(error, 'Nao foi possivel excluir este projeto.'),
      );
    } finally {
      setProjectActionsById((currentActions) => {
        const nextActions = { ...currentActions };
        delete nextActions[project.id];
        return nextActions;
      });
    }
  }

  async function handleUpdateSubscriptionStatus(subscription, status) {
    if (!subscription?.id || subscription.status !== 'PENDENTE' || actionInProgress) {
      return;
    }

    setActionInProgress({ id: subscription.id, status });
    setActionErrorMessage('');
    setActionSuccessMessage('');

    try {
      const response = await atualizarStatusInscricao(subscription.id, status);
      const updatedSubscription = {
        ...subscription,
        ...response,
        projectTitle: response.projectTitle || subscription.projectTitle,
        projectStatus: response.projectStatus || subscription.projectStatus,
        projectStatusLabel: response.projectStatusLabel || subscription.projectStatusLabel,
      };

      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.map((currentSubscription) =>
          currentSubscription.id === updatedSubscription.id ? updatedSubscription : currentSubscription,
        ),
      );
      setSubscriptionsByProjectId((currentSubscriptionsByProjectId) => ({
        ...currentSubscriptionsByProjectId,
        [updatedSubscription.projectId]: (
          currentSubscriptionsByProjectId[updatedSubscription.projectId] ?? []
        ).map((currentSubscription) =>
          currentSubscription.id === updatedSubscription.id ? updatedSubscription : currentSubscription,
        ),
      }));
      setActionSuccessMessage(
        status === 'APROVADA'
          ? 'Inscricao aprovada com sucesso.'
          : 'Inscricao recusada com sucesso.',
      );
    } catch (error) {
      setActionErrorMessage(
        getErrorMessage(error, 'Nao foi possivel atualizar esta inscricao.'),
      );
    } finally {
      setActionInProgress(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageSection
        actions={
          <>
            <Button disabled={isLoading} onClick={handleRefresh} variant="ghost">
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button to={ROUTES.ORGANIZATION_PROJECT_NEW} variant="secondary">
              Novo projeto
            </Button>
            <Button to={ROUTES.PROJECTS}>Ver projetos</Button>
          </>
        }
        description={`Sessao protegida para ${email}. Gerencie aqui os projetos publicados e as inscricoes recebidas.`}
        eyebrow="Dashboard organizacao"
        title="Um painel para acompanhar projetos e voluntarios interessados."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Projetos" value={projects.length} hint="Projetos publicados pela organizacao." />
          <StatCard label="Inscricoes" value={subscriptions.length} hint="Voluntarios aguardando acompanhamento." />
          <StatCard label="Pendentes" value={pendingCount} hint="Inscricoes que ainda precisam de decisao." />
        </div>
      </PageSection>

      <section className="surface-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Gestao de inscricoes</h2>
            <p className="mt-2 text-slate-600">
              Acompanhe as inscricoes recebidas e organize a fila de avaliacao.
            </p>
          </div>
          <Button to={ROUTES.PROJECTS} variant="ghost">
            Consultar listagem publica
          </Button>
        </div>
      </section>

      {isLoading && !hasProjects && !hasSubscriptions ? (
        <PageLoader
          description="Consultando `GET /projetos` e `GET /inscricoes/projeto/{id}` para montar a visao da organizacao."
          title="Carregando dashboard da organizacao"
        />
      ) : null}

      {isLoading && (hasProjects || hasSubscriptions) ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Atualizando projetos e inscricoes...
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusPanel
          actions={<Button onClick={handleRefresh}>Tentar novamente</Button>}
          description={errorMessage}
          title="Nao foi possivel carregar o dashboard"
          tone="error"
        />
      ) : null}

      {!isLoading && !errorMessage && !hasProjects ? (
        <StatusPanel
          actions={<Button to={ROUTES.PROJECTS}>Consultar projetos</Button>}
          description="Ainda nao encontramos projetos vinculados a esta organizacao. Assim que houver projetos publicados, eles aparecem aqui."
          title="Nenhum projeto publicado"
        />
      ) : null}

      {!errorMessage && hasProjects ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Projetos publicados</h2>
          {projectActionSuccessMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {projectActionSuccessMessage}
            </div>
          ) : null}
          {projectActionErrorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {projectActionErrorMessage}
            </div>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <OrganizationProjectCard
                actionState={projectActionsById[project.id]}
                key={project.id}
                onDelete={handleDeleteProject}
                project={project}
                subscriptionCount={subscriptionsByProjectId[project.id]?.length ?? 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!isLoading && !errorMessage && hasProjects && !hasSubscriptions ? (
        <StatusPanel
          actions={<Button onClick={handleRefresh}>Atualizar</Button>}
          description="Seus projetos ainda nao receberam inscricoes de voluntarios."
          title="Nenhuma inscricao recebida"
        />
      ) : null}

      {!errorMessage && hasSubscriptions ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Inscricoes recebidas</h2>
          {actionSuccessMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {actionSuccessMessage}
            </div>
          ) : null}
          {actionErrorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionErrorMessage}
            </div>
          ) : null}
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <OrganizationSubscriptionCard
                actions={getSubscriptionActions({
                  actionInProgress,
                  onUpdateStatus: handleUpdateSubscriptionStatus,
                  subscription,
                })}
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function canManageProject(project, idUsuario) {
  return Number(project?.organizationId) === Number(idUsuario);
}

function getSubscriptionActions({ actionInProgress, onUpdateStatus, subscription }) {
  if (subscription.status !== 'PENDENTE') {
    return null;
  }

  const isActionInProgress = Boolean(actionInProgress);
  const isApproving = actionInProgress?.id === subscription.id && actionInProgress?.status === 'APROVADA';
  const isRejecting = actionInProgress?.id === subscription.id && actionInProgress?.status === 'RECUSADA';

  return (
    <>
      <Button
        disabled={isActionInProgress}
        onClick={() => onUpdateStatus(subscription, 'APROVADA')}
        size="sm"
        variant="secondary"
      >
        {isApproving ? 'Aprovando...' : 'Aprovar'}
      </Button>
      <Button
        disabled={isActionInProgress}
        onClick={() => onUpdateStatus(subscription, 'RECUSADA')}
        size="sm"
        variant="ghost"
      >
        {isRejecting ? 'Recusando...' : 'Recusar'}
      </Button>
    </>
  );
}

export default OrganizationDashboardPage;
