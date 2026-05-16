import { Navigate, Outlet } from 'react-router-dom';
import { getDashboardPathByRole } from '../constants/routes';
import { useAuth } from '../hooks/useAuth';

function GuestRoute() {
  const { isAuthenticated, profile } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to={getDashboardPathByRole(profile)} />;
  }

  return <Outlet />;
}

export default GuestRoute;
