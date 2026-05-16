import { createBrowserRouter } from 'react-router-dom';
import { USER_ROLES } from '../constants/auth';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import OrganizationDashboardPage from '../pages/OrganizationDashboardPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ProjectFormPage from '../pages/ProjectFormPage';
import ProjectsPage from '../pages/ProjectsPage';
import RegisterPage from '../pages/RegisterPage';
import VolunteerDashboardPage from '../pages/VolunteerDashboardPage';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projetos', element: <ProjectsPage /> },
      { path: 'projetos/:projectId', element: <ProjectDetailPage /> },
      {
        element: <ProtectedRoute allowedRoles={[USER_ROLES.ORGANIZACAO]} />,
        children: [
          { path: 'dashboard/organizacao', element: <OrganizationDashboardPage /> },
          { path: 'organizacao/projetos/novo', element: <ProjectFormPage /> },
          { path: 'organizacao/projetos/:projectId/editar', element: <ProjectFormPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={[USER_ROLES.VOLUNTARIO]} />,
        children: [{ path: 'dashboard/voluntario', element: <VolunteerDashboardPage /> }],
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
