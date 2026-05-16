import { createBrowserRouter } from 'react-router-dom';
import { USER_ROLES } from '../constants/auth';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardOrganizationPage from '../pages/DashboardOrganizationPage';
import DashboardVolunteerPage from '../pages/DashboardVolunteerPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ProjectsPage from '../pages/ProjectsPage';
import RegisterPage from '../pages/RegisterPage';
import GuestRoute from './GuestRoute';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos', element: <ProjectsPage /> },
      { path: 'projetos/:projectId', element: <ProjectDetailPage /> },
      {
        element: <PrivateRoute allowedRoles={[USER_ROLES.ORGANIZACAO]} />,
        children: [{ path: 'dashboard/organizacao', element: <DashboardOrganizationPage /> }],
      },
      {
        element: <PrivateRoute allowedRoles={[USER_ROLES.VOLUNTARIO]} />,
        children: [{ path: 'dashboard/voluntario', element: <DashboardVolunteerPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/',
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'cadastro', element: <RegisterPage /> },
        ],
      },
    ],
  },
]);
