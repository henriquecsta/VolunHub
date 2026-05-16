import Button from '../components/ui/Button';
import PageSection from '../components/ui/PageSection';
import StatCard from '../components/common/StatCard';
import { ROUTES, getDashboardPathByRole } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { isAuthenticated, profile } = useAuth();
  const primaryRoute = isAuthenticated ? getDashboardPathByRole(profile) : ROUTES.REGISTER;

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Voluntariado conectado"
        title="Frontend inicial do VolunHub pronto para crescer com o backend que voce ja validou."
        description="Esta base prioriza organizacao, navegacao e autenticacao. A proxima fase pode focar em integrar listas, filtros, inscricoes e historico sem retrabalho estrutural."
        actions={
          <>
            <Button to={primaryRoute}>
              {isAuthenticated ? 'Ir para meu dashboard' : 'Criar conta'}
            </Button>
            <Button to={ROUTES.PROJECTS} variant="outline">
              Explorar projetos
            </Button>
          </>
        }
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <StatCard label="JWT" value="Pronto" hint="Persistencia em localStorage e envio automatico por interceptor." />
          <StatCard label="Rotas" value="7 paginas" hint="Fluxo inicial montado com paginas publicas e privadas." />
          <StatCard label="Evolucao" value="Escalavel" hint="Componentes e services separados para futuras integracoes." />
        </div>
      </PageSection>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="surface-card p-8">
          <h2 className="font-display text-3xl font-semibold text-ink-900">O que ja esta resolvido nesta fase</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-sand-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Arquitetura</p>
              <p className="mt-2 text-slate-600">Separacao clara entre layout, paginas, contexto, rotas e servicos.</p>
            </div>
            <div className="rounded-3xl bg-sand-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Auth</p>
              <p className="mt-2 text-slate-600">Tela de login e cadastro conectadas aos endpoints de autenticacao existentes.</p>
            </div>
            <div className="rounded-3xl bg-sand-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Dashboards</p>
              <p className="mt-2 text-slate-600">Protecao por perfil para organizacao e voluntario desde o inicio.</p>
            </div>
            <div className="rounded-3xl bg-sand-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">Projetos</p>
              <p className="mt-2 text-slate-600">Listagem e detalhe simulados para validar navegacao antes da integracao total.</p>
            </div>
          </div>
        </article>

        <article className="surface-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-forest-700">Proxima onda de trabalho</p>
          <ol className="mt-6 space-y-4 text-slate-600">
            <li>1. Conectar a listagem real de projetos com filtros e paginação.</li>
            <li>2. Implementar inscricoes, historico e estados de carregamento.</li>
            <li>3. Refinar formularios, feedback visual e protecao de rotas baseada em expiracao.</li>
          </ol>
        </article>
      </section>
    </div>
  );
}

export default HomePage;
