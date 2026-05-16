import PageSection from '../components/ui/PageSection';
import StatCard from '../components/common/StatCard';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function DashboardVolunteerPage() {
  const { email } = useAuth();

  return (
    <div className="space-y-8">
      <PageSection
        eyebrow="Dashboard voluntario"
        title="Uma base clara para acompanhar inscricoes, participacoes e historico."
        description={`Sessao protegida para ${email}. Ainda sem regras completas de negocio no frontend, mas com a navegacao certa para a proxima etapa.`}
        actions={<Button to={ROUTES.PROJECTS}>Explorar oportunidades</Button>}
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Inscricoes" value="00" hint="Ligacao futura com `GET /inscricoes/me`." />
          <StatCard label="Historico" value="00" hint="Base pronta para conectar `GET /historico/me`." />
          <StatCard label="Perfil" value="100%" hint="Autenticacao com JWT e persistencia ja ativas." />
        </div>
      </PageSection>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">O que esta preparado aqui</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>Protecao por perfil `VOLUNTARIO` com reaproveitamento do contexto de autenticacao.</li>
            <li>Espaco para cards de inscricao, historico e detalhes da jornada do usuario.</li>
            <li>Layout pronto para receber filtros, estados vazios e chamadas ao backend.</li>
          </ul>
        </article>

        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Atalhos da fase atual</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button to={ROUTES.PROJECTS}>Buscar projetos</Button>
            <Button to={ROUTES.HOME} variant="ghost">Voltar para home</Button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default DashboardVolunteerPage;
