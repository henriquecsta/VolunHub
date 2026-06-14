import { useEffect, useRef, useState } from 'react';
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
import {
  atualizarStatusProjeto,
  excluirProjeto,
  listarProjetosDaOrganizacao,
} from '../services/projetoService';
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
  const subscriptionsSectionRef = useRef(null);

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
            getErrorMessage(error, 'Não foi possível carregar o painel da organização.'),
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

  function handleScrollToSubscriptions() {
    subscriptionsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  async function handleDeleteProject(project) {
    if (!project?.id || projectActionsById[project.id]) {
      return;
    }

    if (!canManageProject(project, idUsuario)) {
      setProjectActionErrorMessage('Você só pode excluir projetos criados pela sua organização.');
      setProjectActionSuccessMessage('');
      return;
    }

    const confirmed = window.confirm(
      `Excluir o projeto "${project.title}"? Esta ação não pode ser desfeita.`,
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
      setProjectActionSuccessMessage(`Projeto "${project.title}" excluído com sucesso.`);
    } catch (error) {
      setProjectActionErrorMessage(
        getErrorMessage(
          error,
          'Não foi possível excluir este projeto. Se houver registros vinculados, altere o status para Encerrado ou Cancelado.',
        ),
      );
    } finally {
      setProjectActionsById((currentActions) => {
        const nextActions = { ...currentActions };
        delete nextActions[project.id];
        return nextActions;
      });
    }
  }

  async function handleUpdateProjectStatus(project, status) {
    if (!project?.id || project.status === status || projectActionsById[project.id]) {
      return;
    }

    if (!canManageProject(project, idUsuario)) {
      setProjectActionErrorMessage('Você só pode alterar projetos criados pela sua organização.');
      setProjectActionSuccessMessage('');
      return;
    }

    setProjectActionsById((currentActions) => ({
      ...currentActions,
      [project.id]: { type: 'status', status },
    }));
    setProjectActionErrorMessage('');
    setProjectActionSuccessMessage('');

    try {
      const updatedProject = await atualizarStatusProjeto(project, status);

      setProjects((currentProjects) =>
        currentProjects.map((currentProject) =>
          currentProject.id === updatedProject.id ? updatedProject : currentProject,
        ),
      );
      setSubscriptions((currentSubscriptions) =>
        currentSubscriptions.map((subscription) =>
          subscription.projectId === updatedProject.id
            ? mapSubscriptionProjectStatus(subscription, updatedProject)
            : subscription,
        ),
      );
      setSubscriptionsByProjectId((currentSubscriptionsByProjectId) => ({
        ...currentSubscriptionsByProjectId,
        [updatedProject.id]: (
          currentSubscriptionsByProjectId[updatedProject.id] ?? []
        ).map((subscription) => mapSubscriptionProjectStatus(subscription, updatedProject)),
      }));
      setProjectActionSuccessMessage(
        `Status do projeto "${updatedProject.title}" atualizado para ${updatedProject.statusLabel}.`,
      );
    } catch (error) {
      setProjectActionErrorMessage(
        getErrorMessage(error, 'Não foi possível atualizar o status deste projeto.'),
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
          ? 'Inscrição aprovada com sucesso.'
          : 'Inscrição recusada com sucesso.',
      );
    } catch (error) {
      setActionErrorMessage(
        getErrorMessage(error, 'Não foi possível atualizar esta inscrição.'),
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
        description={`Sessão protegida para ${email}. Gerencie aqui os projetos publicados e as inscrições recebidas.`}
        eyebrow="Painel da organização"
        title="Um painel para acompanhar projetos e voluntários interessados."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Projetos" value={projects.length} hint="Projetos publicados pela organização." />
          <StatCard label="Inscrições" value={subscriptions.length} hint="Voluntários aguardando acompanhamento." />
          <StatCard label="Pendentes" value={pendingCount} hint="Inscrições que ainda precisam de decisão." />
        </div>
      </PageSection>

      <section className="surface-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Gestão de inscrições</h2>
            <p className="mt-2 text-slate-600">
              Acompanhe as inscrições recebidas e organize a fila de avaliação.
            </p>
          </div>
          <Button onClick={handleScrollToSubscriptions} variant="ghost">
            Ver inscrições recebidas
          </Button>
        </div>
      </section>

      {isLoading && !hasProjects && !hasSubscriptions ? (
        <PageLoader
          description="Buscando projetos publicados e inscrições recebidas."
          title="Carregando painel da organização"
        />
      ) : null}

      {isLoading && (hasProjects || hasSubscriptions) ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Atualizando projetos e inscrições...
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusPanel
          actions={<Button onClick={handleRefresh}>Tentar novamente</Button>}
          description={errorMessage}
          title="Não foi possível carregar o painel"
          tone="error"
        />
      ) : null}

      {!errorMessage ? (
        <ProjectManagementFeedback
          errorMessage={projectActionErrorMessage}
          successMessage={projectActionSuccessMessage}
        />
      ) : null}

      {!isLoading && !errorMessage && !hasProjects ? (
        <StatusPanel
          actions={<Button to={ROUTES.PROJECTS}>Consultar projetos</Button>}
          description="Ainda não encontramos projetos vinculados a esta organização. Assim que houver projetos publicados, eles aparecerão aqui."
          title="Nenhum projeto publicado"
        />
      ) : null}

      {!errorMessage && hasProjects ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Projetos publicados</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <OrganizationProjectCard
                actionState={projectActionsById[project.id]}
                key={project.id}
                onDelete={handleDeleteProject}
                onStatusChange={handleUpdateProjectStatus}
                project={project}
                subscriptionCount={subscriptionsByProjectId[project.id]?.length ?? 0}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!errorMessage && (hasProjects || hasSubscriptions) ? (
        <div ref={subscriptionsSectionRef} className="scroll-mt-24">
          {!isLoading && hasProjects && !hasSubscriptions ? (
            <StatusPanel
              actions={<Button onClick={handleRefresh}>Atualizar</Button>}
              description="Seus projetos ainda não receberam inscrições de voluntários."
              title="Nenhuma inscrição recebida"
            />
          ) : null}

          {hasSubscriptions ? (
            <section aria-labelledby="subscriptions-received-title" className="space-y-4">
              <h2
                className="font-display text-2xl font-semibold text-ink-900"
                id="subscriptions-received-title"
              >
                Inscrições recebidas
              </h2>
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
      ) : null}
    </div>
  );
}

function canManageProject(project, idUsuario) {
  return Number(project?.organizationId) === Number(idUsuario);
}

function mapSubscriptionProjectStatus(subscription, project) {
  return {
    ...subscription,
    projectStatus: project.status,
    projectStatusLabel: project.statusLabel,
  };
}

function ProjectManagementFeedback({ errorMessage, successMessage }) {
  const message = errorMessage || successMessage;

  if (!message) {
    return null;
  }

  const isError = Boolean(errorMessage);

  return (
    <div
      className={
        isError
          ? 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
          : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800'
      }
      role={isError ? 'alert' : 'status'}
    >
      {message}
    </div>
  );
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
