import Button from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

function NotFoundPage() {
  return (
    <section className="surface-card mx-auto max-w-2xl space-y-4 p-10 text-center">
      <span className="inline-flex rounded-full bg-clay-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-clay-700">
        404
      </span>
      <h1 className="font-display text-4xl font-semibold text-ink-900">Essa página não existe</h1>
      <p className="text-lg text-slate-600">Não encontramos a página solicitada. Confira o endereço ou volte para a página inicial.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button to={ROUTES.HOME}>Ir para início</Button>
        <Button to={ROUTES.PROJECTS} variant="ghost">Ver projetos</Button>
      </div>
    </section>
  );
}

export default NotFoundPage;
