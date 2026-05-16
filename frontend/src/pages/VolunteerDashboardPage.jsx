import { useEffect, useState } from 'react';
import StatCard from '../components/common/StatCard';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import VolunteerSubscriptionCard from '../components/subscriptions/VolunteerSubscriptionCard';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { listarMinhasInscricoesComProjetos } from '../services/inscricaoService';
import { getErrorMessage } from '../utils/http';

function VolunteerDashboardPage() {
  const { email } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadSubscriptions() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await listarMinhasInscricoesComProjetos();

        if (!shouldIgnore) {
          setSubscriptions(response);
        }
      } catch (error) {
        if (!shouldIgnore) {
          setErrorMessage(
            getErrorMessage(error, 'Nao foi possivel carregar suas inscricoes.'),
          );
          setSubscriptions([]);
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    loadSubscriptions();

    return () => {
      shouldIgnore = true;
    };
  }, [refreshCount]);

  const pendingCount = subscriptions.filter((subscription) => subscription.status === 'PENDENTE').length;
  const approvedCount = subscriptions.filter((subscription) => subscription.status === 'APROVADA').length;
  const hasSubscriptions = subscriptions.length > 0;

  function handleRefresh() {
    setRefreshCount((currentCount) => currentCount + 1);
  }

  return (
    <div className="space-y-8">
      <PageSection
        actions={
          <>
            <Button to={ROUTES.DASHBOARD_VOLUNTEER_HISTORY} variant="ghost">
              Ver historico
            </Button>
            <Button to={ROUTES.PROJECTS}>Explorar oportunidades</Button>
          </>
        }
        description={`Sessao protegida para ${email}. Acompanhe aqui suas inscricoes e o andamento de cada oportunidade.`}
        eyebrow="Dashboard voluntario"
        title="Suas inscricoes em um painel simples de acompanhar."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Inscricoes" value={subscriptions.length} hint="Projetos em que voce demonstrou interesse." />
          <StatCard label="Pendentes" value={pendingCount} hint="Aguardando avaliacao da organizacao." />
          <StatCard label="Aprovadas" value={approvedCount} hint="Participacoes confirmadas." />
        </div>
      </PageSection>

      <section className="surface-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Minhas inscricoes</h2>
            <p className="mt-2 text-slate-600">
              Acompanhe seus projetos inscritos e consulte os detalhes quando quiser.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button disabled={isLoading} onClick={handleRefresh} variant="ghost">
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button to={ROUTES.DASHBOARD_VOLUNTEER_HISTORY} variant="ghost">
              Historico
            </Button>
            <Button to={ROUTES.PROJECTS} variant="ghost">
              Buscar projetos
            </Button>
          </div>
        </div>
      </section>

      {isLoading && !hasSubscriptions ? (
        <PageLoader
          description="Consultando `GET /inscricoes/me` e preparando seus cards de acompanhamento."
          title="Carregando suas inscricoes"
        />
      ) : null}

      {isLoading && hasSubscriptions ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Atualizando suas inscricoes...
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusPanel
          actions={<Button onClick={handleRefresh}>Tentar novamente</Button>}
          description={errorMessage}
          title="Nao foi possivel carregar suas inscricoes"
          tone="error"
        />
      ) : null}

      {!isLoading && !errorMessage && !hasSubscriptions ? (
        <StatusPanel
          actions={<Button to={ROUTES.PROJECTS}>Explorar projetos</Button>}
          description="Voce ainda nao possui inscricoes. Explore oportunidades ativas e escolha um projeto para participar."
          title="Voce ainda nao possui inscricoes"
        />
      ) : null}

      {!errorMessage && hasSubscriptions ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subscriptions.map((subscription) => (
            <VolunteerSubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default VolunteerDashboardPage;
