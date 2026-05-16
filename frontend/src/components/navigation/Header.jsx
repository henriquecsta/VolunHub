import { NavLink } from 'react-router-dom';
import { ROUTES, getDashboardPathByRole } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import BrandLogo from '../common/BrandLogo';
import Button from '../ui/Button';

function navigationClassName({ isActive }) {
  return isActive
    ? 'text-clay-700'
    : 'text-slate-600 hover:text-ink-900';
}

function Header() {
  const { email, isAuthenticated, logout, profile } = useAuth();
  const dashboardPath = isAuthenticated ? getDashboardPathByRole(profile) : null;

  return (
    <header className="border-b border-white/70 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo size="sm" />
          {isAuthenticated ? (
            <span className="rounded-full bg-mist-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">
              {profile}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold">
            <NavLink className={navigationClassName} to={ROUTES.HOME}>
              Home
            </NavLink>
            <NavLink className={navigationClassName} to={ROUTES.PROJECTS}>
              Projetos
            </NavLink>
            {dashboardPath ? (
              <NavLink className={navigationClassName} to={dashboardPath}>
                Dashboard
              </NavLink>
            ) : null}
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-500">{email}</span>
                <Button onClick={logout} size="sm" variant="ghost">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" to={ROUTES.LOGIN} variant="ghost">
                  Entrar
                </Button>
                <Button size="sm" to={ROUTES.REGISTER} variant="secondary">
                  Criar conta
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
