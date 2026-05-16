import api from './api';

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function register(payload) {
  const response = await api.post('/auth/register', payload);
  return response.data;
}
