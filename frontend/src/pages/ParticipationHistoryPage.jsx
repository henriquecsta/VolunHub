import StatusPanel from '../components/feedback/StatusPanel';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function ParticipationHistoryPage() {
  const { email } = useAuth();

  return (
    <div className="space-y-8">
      <PageSection
        actions={
          <>
            <Button to={ROUTES.DASHBOARD_VOLUNTEER} variant="ghost">
              Voltar ao dashboard
            </Button>
            <Button to={ROUTES.PROJECTS}>Explorar oportunidades</Button>
          </>
        }
        description={`Sessao protegida para ${email}. Consulte aqui os registros consolidados das suas participacoes.`}
        eyebrow="Historico"
        title="Seu historico de participacao."
      />

      <StatusPanel
        actions={<Button to={ROUTES.DASHBOARD_VOLUNTEER}>Ver minhas inscricoes</Button>}
        description="Os registros do historico serao exibidos aqui assim que forem carregados do backend."
        title="Historico em preparacao"
      />
    </div>
  );
}

export default ParticipationHistoryPage;
