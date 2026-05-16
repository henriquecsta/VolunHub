import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES, getDashboardPathByRole } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const { isAuthenticated, profile } = useAuth();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />;
  }

  if (allowedRoles.length && !allowedRoles.includes(profile)) {
    return <Navigate replace to={getDashboardPathByRole(profile)} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
