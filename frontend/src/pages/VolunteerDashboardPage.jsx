import StatCard from '../components/common/StatCard';
import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function VolunteerDashboardPage() {
  const { email } = useAuth();

  return (
    <div className="space-y-8">
      <PageSection
        actions={<Button to={ROUTES.PROJECTS}>Explorar oportunidades</Button>}
        description={`Sessao protegida para ${email}. Acompanhe aqui suas inscricoes e o andamento de cada oportunidade.`}
        eyebrow="Dashboard voluntario"
        title="Suas inscricoes em um painel simples de acompanhar."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Inscricoes" value="00" hint="Projetos em que voce demonstrou interesse." />
          <StatCard label="Pendentes" value="00" hint="Aguardando avaliacao da organizacao." />
          <StatCard label="Aprovadas" value="00" hint="Participacoes confirmadas." />
        </div>
      </PageSection>

      <section className="surface-card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900">Minhas inscricoes</h2>
            <p className="mt-2 text-slate-600">
              A listagem conectada ao backend entra aqui na proxima etapa.
            </p>
          </div>
          <Button to={ROUTES.PROJECTS} variant="ghost">
            Buscar projetos
          </Button>
        </div>
      </section>
    </div>
  );
}

export default VolunteerDashboardPage;
