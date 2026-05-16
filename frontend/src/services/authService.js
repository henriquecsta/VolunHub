import api from './api';

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function login(credentials) {
  const response = await api.post('/auth/login', {
    email: normalizeText(credentials.email).toLowerCase(),
    senha: credentials.senha,
  });

  return response.data;
}

export async function register(payload) {
  const telefone = normalizeText(payload.telefone);
  const response = await api.post('/auth/register', {
    nome: normalizeText(payload.nome),
    email: normalizeText(payload.email).toLowerCase(),
    senha: payload.senha,
    perfil: payload.perfil,
    telefone: telefone || null,
  });

  return response.data;
}
