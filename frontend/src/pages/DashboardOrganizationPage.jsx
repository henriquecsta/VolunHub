import PageSection from '../components/ui/PageSection';
import StatCard from '../components/common/StatCard';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function DashboardOrganizationPage() {
  const { email } = useAuth();

  return (
    <div className="space-y-8">
      <PageSection
        eyebrow="Dashboard organizacao"
        title="Um painel inicial para quem publica e gerencia projetos."
        description={`Sessao protegida para ${email}. Nesta fase, a prioridade e validar layout, navegacao e divisao de responsabilidades.`}
        actions={<Button disabled variant="secondary">Criar projeto em breve</Button>}
      >
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Projetos" value="00" hint="Aqui entram os cards e listagens do endpoint da organizacao." />
          <StatCard label="Inscricoes" value="00" hint="Espaco reservado para aprovacoes, recusas e acompanhamento." />
          <StatCard label="Historico" value="00" hint="A base de layout ja acomoda modulos adicionais sem refactor grande." />
        </div>
      </PageSection>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">O que esta preparado aqui</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>Protecao por perfil `ORGANIZACAO` com redirecionamento automatico.</li>
            <li>Espaco para CRUD de projetos, inscricoes do projeto e historico relacionado.</li>
            <li>Estrutura pronta para conectar estados de carregamento, erro e paginação.</li>
          </ul>
        </article>

        <article className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Atalhos da fase atual</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button to={ROUTES.PROJECTS}>Ver projetos</Button>
            <Button to={ROUTES.HOME} variant="ghost">Voltar para home</Button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default DashboardOrganizationPage;
