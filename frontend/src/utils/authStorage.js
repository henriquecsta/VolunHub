import { AUTH_STORAGE_KEY } from '../constants/auth';
import { normalizeStoredAuth } from './authSession';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getStoredAuth() {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const authData = normalizeStoredAuth(JSON.parse(rawValue));

    if (!authData) {
      clearStoredAuth();
      return null;
    }

    return authData;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function setStoredAuth(authData) {
  if (!canUseStorage()) {
    return null;
  }

  const normalizedAuth = normalizeStoredAuth(authData);

  if (!normalizedAuth) {
    clearStoredAuth();
    return null;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedAuth));

  return normalizedAuth;
}

export function clearStoredAuth() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredToken() {
  return getStoredAuth()?.token ?? null;
}
