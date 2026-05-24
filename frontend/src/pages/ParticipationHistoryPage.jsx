import { useEffect, useState } from 'react';
import StatCard from '../components/common/StatCard';
import PageLoader from '../components/feedback/PageLoader';
import StatusPanel from '../components/feedback/StatusPanel';
import ParticipationHistoryCard from '../components/history/ParticipationHistoryCard';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';
import { listarMeuHistorico } from '../services/historicoService';
import { getErrorMessage } from '../utils/http';

function ParticipationHistoryPage() {
  const { email } = useAuth();
  const [historyEntries, setHistoryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let shouldIgnore = false;

    async function loadHistory() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await listarMeuHistorico();

        if (!shouldIgnore) {
          setHistoryEntries(response);
        }
      } catch (error) {
        if (!shouldIgnore) {
          setErrorMessage(
            getErrorMessage(error, 'Não foi possível carregar seu histórico.'),
          );
          setHistoryEntries([]);
        }
      } finally {
        if (!shouldIgnore) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      shouldIgnore = true;
    };
  }, [refreshCount]);

  const hasHistoryEntries = historyEntries.length > 0;
  const completedCount = historyEntries.filter(isCompletedHistoryEntry).length;
  const notesCount = historyEntries.filter((history) => history.note).length;
  const lastRecordLabel = historyEntries[0]?.registeredAtLabel ?? 'Sem registros';

  function handleRefresh() {
    setRefreshCount((currentCount) => currentCount + 1);
  }

  return (
    <div className="space-y-8">
      <PageSection
        actions={
          <>
            <Button to={ROUTES.DASHBOARD_VOLUNTEER} variant="ghost">
              Voltar ao painel
            </Button>
            <Button disabled={isLoading} onClick={handleRefresh} variant="ghost">
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button to={ROUTES.PROJECTS}>Explorar oportunidades</Button>
          </>
        }
        description={`Sessão protegida para ${email}. Consulte aqui os registros consolidados das suas participações.`}
        eyebrow="Histórico"
        title="Seu histórico de participação."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Registros" value={historyEntries.length} hint="Participações registradas por organizações." />
          <StatCard label="Concluídos" value={completedCount} hint="Registros com situação finalizada ou aprovada." />
          <StatCard label="Observações" value={notesCount} hint={`Último registro: ${lastRecordLabel}.`} />
        </div>
      </PageSection>

      {isLoading && !hasHistoryEntries ? (
        <PageLoader
          description="Buscando seus registros de participação mais recentes."
          title="Carregando histórico"
        />
      ) : null}

      {isLoading && hasHistoryEntries ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Atualizando seu histórico...
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusPanel
          actions={<Button onClick={handleRefresh}>Tentar novamente</Button>}
          description={errorMessage}
          title="Não foi possível carregar o histórico"
          tone="error"
        />
      ) : null}

      {!isLoading && !errorMessage && !hasHistoryEntries ? (
        <StatusPanel
          actions={<Button to={ROUTES.DASHBOARD_VOLUNTEER}>Ver minhas inscrições</Button>}
          description="Ainda não há participações registradas para o seu usuário. Quando uma organização registrar sua participação, ela aparecerá aqui."
          title="Nenhum histórico encontrado"
        />
      ) : null}

      {!errorMessage && hasHistoryEntries ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {historyEntries.map((history) => (
            <ParticipationHistoryCard history={history} key={history.id} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

function isCompletedHistoryEntry(history) {
  return ['APROVADA', 'CONCLUIDA', 'FINALIZADA'].includes(String(history.status ?? '').toUpperCase());
}

export default ParticipationHistoryPage;
