import { USER_ROLES } from './auth';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  PROJECTS: '/projetos',
  DASHBOARD_ORGANIZATION: '/dashboard/organizacao',
  DASHBOARD_VOLUNTEER: '/dashboard/voluntario',
};

export function getProjectDetailPath(projectId = ':projectId') {
  return `${ROUTES.PROJECTS}/${projectId}`;
}

export function getDashboardPathByRole(profile) {
  return profile === USER_ROLES.ORGANIZACAO
    ? ROUTES.DASHBOARD_ORGANIZATION
    : ROUTES.DASHBOARD_VOLUNTEER;
}
