import { USER_ROLES } from '../constants/auth';
import { decodeJwtPayload, getJwtExpirationTime, isJwtExpired } from './jwt';

const DEFAULT_TOKEN_TYPE = 'Bearer';

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeRole(value) {
  const role = normalizeText(value).toUpperCase();

  return Object.values(USER_ROLES).includes(role) ? role : null;
}

function getExpiresAtFromResponse(expiresIn) {
  const duration = Number(expiresIn);

  return Number.isFinite(duration) && duration > 0 ? Date.now() + duration : null;
}

function getExpiresAt(authData, token) {
  const jwtExpiresAt = getJwtExpirationTime(token);
  const storedExpiresAt = Number(authData?.expiresAt);

  if (jwtExpiresAt) {
    return jwtExpiresAt;
  }

  if (Number.isFinite(storedExpiresAt) && storedExpiresAt > 0) {
    return storedExpiresAt;
  }

  return getExpiresAtFromResponse(authData?.expiresIn ?? authData?.expires_in);
}

export function createAuthSession(authData = {}) {
  const token = normalizeText(authData.token);
  const jwtPayload = decodeJwtPayload(token) ?? {};
  const profile = normalizeRole(
    authData.perfil ?? authData.profile ?? authData.user?.perfil ?? jwtPayload.perfil,
  );
  const email = normalizeText(
    authData.email ?? authData.user?.email ?? jwtPayload.email ?? jwtPayload.sub,
  ).toLowerCase();
  const idUsuario = authData.idUsuario ?? authData.user?.idUsuario ?? jwtPayload.idUsuario ?? null;

  return {
    token,
    tokenType: normalizeText(authData.tipo ?? authData.tokenType) || DEFAULT_TOKEN_TYPE,
    expiresIn: authData.expiresIn ?? null,
    expiresAt: getExpiresAt(authData, token),
    email,
    profile,
    user: {
      idUsuario,
      email,
      perfil: profile,
    },
  };
}

export function isAuthSessionValid(authData) {
  if (!authData || typeof authData !== 'object') {
    return false;
  }

  if (!normalizeText(authData.token) || !authData.email || !authData.profile) {
    return false;
  }

  if (!Object.values(USER_ROLES).includes(authData.profile)) {
    return false;
  }

  if (!decodeJwtPayload(authData.token)) {
    return false;
  }

  const expiresAt = Number(authData.expiresAt);

  if (!Number.isFinite(expiresAt) || expiresAt <= 0 || Date.now() >= expiresAt) {
    return false;
  }

  return !isJwtExpired(authData.token);
}

export function normalizeStoredAuth(authData) {
  const authSession = createAuthSession(authData);

  return isAuthSessionValid(authSession) ? authSession : null;
}
