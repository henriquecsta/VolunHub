import StatCard from '../components/common/StatCard';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function OrganizationDashboardPage() {
  const { email } = useAuth();

  return (
    <div className="space-y-8">
      <PageSection
        actions={<Button to={ROUTES.PROJECTS}>Ver projetos</Button>}
        description={`Sessao protegida para ${email}. Gerencie aqui os projetos publicados e as inscricoes recebidas.`}
        eyebrow="Dashboard organizacao"
        title="Um painel para acompanhar projetos e voluntarios interessados."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Projetos" value="00" hint="Projetos publicados pela organizacao." />
          <StatCard label="Inscricoes" value="00" hint="Voluntarios aguardando acompanhamento." />
          <StatCard label="Pendentes" value="00" hint="Inscricoes que ainda precisam de decisao." />
        </div>
      </PageSection>

      <section className="surface-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Gestao de inscricoes</h2>
            <p className="mt-2 text-slate-600">
              A listagem de projetos e inscricoes recebidas sera conectada ao backend nesta etapa.
            </p>
          </div>
          <Button to={ROUTES.PROJECTS} variant="ghost">
            Consultar listagem publica
          </Button>
        </div>
      </section>
    </div>
  );
}

export default OrganizationDashboardPage;
