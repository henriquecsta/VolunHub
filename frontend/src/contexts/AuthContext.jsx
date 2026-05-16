import { createContext, useEffect, useState } from 'react';
import { AUTH_EXPIRED_EVENT, USER_ROLES } from '../constants/auth';
import * as authService from '../services/authService';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/authStorage';

export const AuthContext = createContext(null);

function normalizeAuthPayload(payload) {
  return {
    token: payload.token,
    tokenType: payload.tipo,
    expiresIn: payload.expiresIn,
    email: payload.email,
    profile: payload.perfil,
  };
}

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

  async function signIn(credentials) {
    const response = await authService.login(credentials);
    const normalizedAuth = normalizeAuthPayload(response);

    setStoredAuth(normalizedAuth);
    setAuth(normalizedAuth);

    return normalizedAuth;
  }

  async function signUp(payload) {
    return authService.register(payload);
  }

  function signOut() {
    clearStoredAuth();
    setAuth(null);
  }

  const profile = auth?.profile ?? null;

  const value = {
    auth,
    profile,
    email: auth?.email ?? null,
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
