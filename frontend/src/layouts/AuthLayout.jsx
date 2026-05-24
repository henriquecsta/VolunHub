import { Outlet } from 'react-router-dom';
import BrandLogo from '../components/common/BrandLogo';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-hero px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/70 bg-forest-700 px-8 py-10 text-white shadow-soft">
          <div className="space-y-6">
            <div className="inline-flex rounded-3xl bg-white p-2 shadow-soft">
              <BrandLogo className="rounded-2xl" size="lg" />
            </div>
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                Voluntariado conectado
              </span>
              <h1 className="font-display text-4xl font-semibold leading-tight">
                Uma plataforma para aproximar projetos sociais e pessoas voluntárias.
              </h1>
              <p className="max-w-xl text-lg text-emerald-50/85">
                Publique oportunidades, acompanhe inscrições e organize históricos de participação em um único ambiente.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">Voluntários</p>
              <p className="mt-2 text-sm text-emerald-50/80">Buscam projetos, realizam inscrições e acompanham histórico.</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">Organizações</p>
              <p className="mt-2 text-sm text-emerald-50/80">Publicam projetos e gerenciam inscrições recebidas.</p>
            </div>
          </div>
        </section>

        <section className="surface-card flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;
