export const AUTH_STORAGE_KEY = 'volunhub.auth';
export const AUTH_EXPIRED_EVENT = 'volunhub:auth-expired';

export const USER_ROLES = {
  VOLUNTARIO: 'VOLUNTARIO',
  ORGANIZACAO: 'ORGANIZACAO',
};

export const ROLE_OPTIONS = [
  { value: USER_ROLES.VOLUNTARIO, label: 'Voluntario' },
  { value: USER_ROLES.ORGANIZACAO, label: 'Organizacao' },
];
