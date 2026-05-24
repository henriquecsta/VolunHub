import { NavLink } from 'react-router-dom';
import { ROUTES, getDashboardPathByRole } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import BrandLogo from '../common/BrandLogo';
import Button from '../ui/Button';

const profileLabels = {
  ORGANIZACAO: 'Organização',
  VOLUNTARIO: 'Voluntário',
};

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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-3">
          <BrandLogo size="sm" />
          {isAuthenticated ? (
            <span className="hidden rounded-full bg-mist-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest-700 sm:inline-flex">
              {profileLabels[profile] ?? profile}
            </span>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:gap-5">
          <nav className="flex shrink-0 items-center gap-3 text-sm font-semibold sm:gap-4">
            <NavLink className={navigationClassName} to={ROUTES.HOME}>
              Início
            </NavLink>
            <NavLink className={navigationClassName} to={ROUTES.PROJECTS}>
              Projetos
            </NavLink>
            {dashboardPath ? (
              <NavLink className={navigationClassName} to={dashboardPath}>
                Painel
              </NavLink>
            ) : null}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden max-w-48 truncate text-sm text-slate-500 md:inline">{email}</span>
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
