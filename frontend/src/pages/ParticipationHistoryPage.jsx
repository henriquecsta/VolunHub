import { useEffect, useState } from 'react';
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
            getErrorMessage(error, 'Nao foi possivel carregar seu historico.'),
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

  function handleRefresh() {
    setRefreshCount((currentCount) => currentCount + 1);
  }

  return (
    <div className="space-y-8">
      <PageSection
        actions={
          <>
            <Button to={ROUTES.DASHBOARD_VOLUNTEER} variant="ghost">
              Voltar ao dashboard
            </Button>
            <Button disabled={isLoading} onClick={handleRefresh} variant="ghost">
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button to={ROUTES.PROJECTS}>Explorar oportunidades</Button>
          </>
        }
        description={`Sessao protegida para ${email}. Consulte aqui os registros consolidados das suas participacoes.`}
        eyebrow="Historico"
        title="Seu historico de participacao."
      />

      {isLoading && !hasHistoryEntries ? (
        <StatusPanel
          description="Consultando `GET /historico/me` para recuperar seus registros."
          title="Carregando historico"
        />
      ) : null}

      {!isLoading && errorMessage ? (
        <StatusPanel
          actions={<Button onClick={handleRefresh}>Tentar novamente</Button>}
          description={errorMessage}
          title="Nao foi possivel carregar o historico"
          tone="error"
        />
      ) : null}

      {!isLoading && !errorMessage && !hasHistoryEntries ? (
        <StatusPanel
          actions={<Button to={ROUTES.DASHBOARD_VOLUNTEER}>Ver minhas inscricoes</Button>}
          description="Ainda nao ha participacoes registradas para o seu usuario. Quando uma organizacao registrar sua participacao, ela aparecera aqui."
          title="Nenhum historico encontrado"
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

export default ParticipationHistoryPage;
