import axios from 'axios';
import { AUTH_EXPIRED_EVENT } from '../constants/auth';
import { clearStoredAuth, getStoredToken } from '../utils/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error?.response?.status === 401;
    const isAuthRequest = error?.config?.url?.includes('/auth/');

    if (isUnauthorized && !isAuthRequest) {
      clearStoredAuth();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, { detail: { status: 401 } }));
      }
    }

    return Promise.reject(error);
  },
);

export default api;
