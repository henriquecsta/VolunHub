import { USER_ROLES } from '../constants/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmail(email) {
  if (!email) {
    return 'Informe o e-mail.';
  }

  if (email.length > 150) {
    return 'E-mail deve ter no máximo 150 caracteres.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Informe um e-mail válido.';
  }

  return '';
}

function validatePassword(password) {
  if (!password) {
    return 'Informe a senha.';
  }

  if (password.length < 6 || password.length > 100) {
    return 'Senha deve ter entre 6 e 100 caracteres.';
  }

  return '';
}

export function hasValidationErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export function validateLoginForm(form) {
  const errors = {
    email: validateEmail(normalizeText(form.email)),
    senha: validatePassword(form.senha),
  };

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)));
}

export function validateRegisterForm(form) {
  const nome = normalizeText(form.nome);
  const telefone = normalizeText(form.telefone);
  const perfil = normalizeText(form.perfil);

  const errors = {
    nome: !nome
      ? 'Informe o nome.'
      : nome.length > 150
        ? 'Nome deve ter no máximo 150 caracteres.'
        : '',
    email: validateEmail(normalizeText(form.email)),
    senha: validatePassword(form.senha),
    perfil: !Object.values(USER_ROLES).includes(perfil)
      ? 'Escolha voluntário ou organização.'
      : '',
    telefone: telefone.length > 20 ? 'Telefone deve ter no máximo 20 caracteres.' : '',
  };

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)));
}
