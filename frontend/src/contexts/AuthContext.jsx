import { createContext, useEffect, useState } from 'react';
import { AUTH_EXPIRED_EVENT, USER_ROLES } from '../constants/auth';
import * as authService from '../services/authService';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/authStorage';
import { createAuthSession } from '../utils/authSession';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  useEffect(() => {
    function handleAuthExpiration() {
      clearStoredAuth();
      setAuth(null);
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpiration);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpiration);
    };
  }, []);

  useEffect(() => {
    if (!auth?.expiresAt) {
      return undefined;
    }

    const remainingTime = Number(auth.expiresAt) - Date.now();

    if (remainingTime <= 0) {
      clearStoredAuth();
      setAuth(null);
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearStoredAuth();
      setAuth(null);
    }, Math.min(remainingTime, 2147483647));

    return () => window.clearTimeout(timeoutId);
  }, [auth?.expiresAt]);

  async function signIn(credentials) {
    const response = await authService.login(credentials);
    const normalizedAuth = createAuthSession(response);
    const storedAuth = setStoredAuth(normalizedAuth);

    if (!storedAuth) {
      throw new Error('Nao foi possivel validar a sessao retornada pelo servidor.');
    }

    setAuth(storedAuth);

    return storedAuth;
  }

  async function signUp(payload) {
    return authService.register(payload);
  }

  function signOut() {
    clearStoredAuth();
    setAuth(null);
  }

  const user = auth?.user ?? null;
  const profile = user?.perfil ?? auth?.profile ?? null;
  const email = user?.email ?? auth?.email ?? null;

  const value = {
    auth,
    user,
    profile,
    email,
    idUsuario: user?.idUsuario ?? null,
    token: auth?.token ?? null,
    isAuthenticated: Boolean(auth?.token),
    isVolunteer: profile === USER_ROLES.VOLUNTARIO,
    isOrganization: profile === USER_ROLES.ORGANIZACAO,
    login: signIn,
    register: signUp,
    logout: signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
