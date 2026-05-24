import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

const highlightCards = [
  {
    title: 'Projetos disponíveis',
    text: 'Explore oportunidades de voluntariado em diferentes áreas e encontre causas alinhadas ao seu perfil.',
  },
  {
    title: 'Organizações parceiras',
    text: 'Conecte-se com instituições sociais que buscam voluntários para ampliar seu impacto.',
  },
  {
    title: 'Impacto social',
    text: 'Participe de ações que geram transformação real para pessoas e comunidades.',
  },
];

const steps = [
  {
    title: 'Explore projetos',
    text: 'Descubra iniciativas sociais disponíveis na plataforma.',
  },
  {
    title: 'Escolha uma causa',
    text: 'Encontre projetos alinhados aos seus interesses e habilidades.',
  },
  {
    title: 'Participe',
    text: 'Inscreva-se e acompanhe sua participação nas ações voluntárias.',
  },
];

function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 overflow-hidden rounded-lg border border-white/80 bg-white/75 px-6 py-8 shadow-soft backdrop-blur lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest-700">
            VOLUNTARIADO CONECTADO
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
            Conecte pessoas a causas que realmente importam.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Encontre projetos voluntários, participe de iniciativas sociais e contribua para transformar comunidades
            através da colaboração.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button className="px-6 shadow-soft" to={ROUTES.PROJECTS} variant="secondary">
              Explorar projetos
            </Button>
            <Button className="border-clay-500 bg-white/85 px-6 shadow-sm" to={ROUTES.REGISTER} variant="outline">
              Criar conta
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-forest-100 via-white to-clay-100 p-4 shadow-soft sm:p-6">
          <div className="flex justify-end">
            <div className="w-fit rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-forest-700 shadow-soft">
              128 voluntários ativos
            </div>
          </div>

          <article className="mt-6 max-w-[25rem] rounded-lg border border-white/80 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-forest-100 text-lg font-semibold text-forest-700">
                A
              </span>
              <div>
                <p className="font-semibold text-ink-900">Apoio alimentar</p>
                <p className="text-sm text-slate-500">Entrega de cestas para famílias</p>
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-mist-200">
              <div className="h-2 w-3/4 rounded-full bg-forest-500" />
            </div>
            <p className="mt-3 text-sm font-semibold text-forest-700">24 vagas preenchidas</p>
          </article>

          <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
            <div className="w-fit rounded-lg bg-clay-500 px-4 py-3 text-white shadow-soft">
              <p className="text-2xl font-semibold">+40</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/85">causas sociais</p>
            </div>
            <article className="rounded-lg border border-white/80 bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-clay-700">Projeto em destaque</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-ink-900">Mutirão comunitário</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Voluntários reunidos para revitalizar espaços públicos e fortalecer vínculos no bairro.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {highlightCards.map((card) => (
          <article
            className="rounded-lg border border-white/80 bg-white/90 p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            key={card.title}
          >
            <div className="mb-5 h-1.5 w-16 rounded-full bg-clay-500" />
            <h2 className="font-display text-xl font-semibold text-ink-900">{card.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur lg:p-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-ink-900">Como funciona</h2>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article className="rounded-lg bg-mist-100 p-5" key={step.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-500 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-6 rounded-lg bg-forest-700 p-6 text-white shadow-soft lg:grid-cols-[1fr_auto] lg:p-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold">Para organizações</h2>
          <p className="mt-3 text-lg leading-8 text-white/85">
            Cadastre projetos sociais, divulgue oportunidades e conecte-se com voluntários interessados em apoiar sua
            causa.
          </p>
        </div>
        <Button
          className="min-w-44 !bg-white px-6 !text-forest-700 shadow-soft hover:!bg-sand-50 hover:!text-forest-700"
          to={ROUTES.ORGANIZATION_PROJECT_NEW}
          variant="ghost"
        >
          Publicar projeto
        </Button>
      </section>
    </div>
  );
}

export default HomePage;
