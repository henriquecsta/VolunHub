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
  if (profile === USER_ROLES.ORGANIZACAO) {
    return ROUTES.DASHBOARD_ORGANIZATION;
  }

  if (profile === USER_ROLES.VOLUNTARIO) {
    return ROUTES.DASHBOARD_VOLUNTEER;
  }

  return ROUTES.PROJECTS;
}
