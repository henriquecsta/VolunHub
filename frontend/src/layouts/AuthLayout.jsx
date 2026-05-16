import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-hero px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/70 bg-forest-700 px-8 py-10 text-white shadow-soft">
          <div className="space-y-6">
            <Link className="font-display text-2xl font-semibold tracking-tight" to={ROUTES.HOME}>
              VolunHub
            </Link>
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                Frontend base
              </span>
              <h1 className="font-display text-4xl font-semibold leading-tight">
                Uma fundacao solida para autenticacao, rotas e consumo do backend.
              </h1>
              <p className="max-w-xl text-lg text-emerald-50/85">
                Esta primeira etapa ja deixa JWT, navegacao e organizacao de codigo prontos para a proxima fase de integracoes.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">Rotas</p>
              <p className="mt-2 text-sm text-emerald-50/80">Publicas, privadas e protegidas por perfil.</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">Axios</p>
              <p className="mt-2 text-sm text-emerald-50/80">Base URL centralizada e envio automatico do token.</p>
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
