import api from './api';
import { formatDateRange, formatEnumLabel, truncateText } from '../utils/formatters';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 6;

function normalizeText(value) {
  if (value === null || value === undefined) {
    return undefined;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue ? normalizedValue : undefined;
}

function normalizeStatus(status) {
  const normalizedStatus = normalizeText(status);
  return normalizedStatus ? normalizedStatus.toUpperCase() : undefined;
}

function buildProjetoQueryParams({ page, size, termo, categoria, local, status } = {}) {
  const normalizedLocal = normalizeText(local);
  const params = {
    page: Number.isInteger(page) ? page : DEFAULT_PAGE,
    size: Number.isInteger(size) ? size : DEFAULT_SIZE,
  };

  const normalizedTermo = normalizeText(termo);
  const normalizedCategoria = normalizeText(categoria);
  const normalizedStatus = normalizeStatus(status);

  if (normalizedTermo) {
    params.palavraChave = normalizedTermo;
  }

  if (normalizedCategoria) {
    params.categoria = normalizedCategoria;
  }

  if (normalizedLocal) {
    if (/^[a-z]{2}$/i.test(normalizedLocal)) {
      params.estado = normalizedLocal.toUpperCase();
    } else {
      params.cidade = normalizedLocal;
    }
  }

  if (normalizedStatus) {
    params.status = normalizedStatus;
  }

  return params;
}

function adaptProjeto(apiProject) {
  return {
    id: apiProject.idProjeto,
    title: apiProject.titulo,
    description: apiProject.descricao,
    summary: truncateText(apiProject.descricao, 150),
    city: apiProject.cidade,
    state: apiProject.estado,
    venue: apiProject.local,
    participationType: apiProject.tipoParticipacao,
    participationTypeLabel: formatEnumLabel(apiProject.tipoParticipacao),
    startDate: apiProject.dataInicio,
    endDate: apiProject.dataFim,
    dateRangeLabel: formatDateRange(apiProject.dataInicio, apiProject.dataFim),
    vacancies: apiProject.vagas,
    status: apiProject.status,
    statusLabel: formatEnumLabel(apiProject.status),
    categoryId: apiProject.idCategoria,
    category: apiProject.nomeCategoria ?? 'Categoria nao informada',
    organizationId: apiProject.idOrganizacao,
    organization: apiProject.nomeOrganizacao ?? 'Organizacao nao informada',
  };
}

function adaptProjetoPage(payload) {
  const content = Array.isArray(payload?.content) ? payload.content : [];
  const totalPages = payload?.totalPages ?? (content.length ? 1 : 0);

  return {
    items: content.map(adaptProjeto),
    page: payload?.number ?? DEFAULT_PAGE,
    size: payload?.size ?? content.length ?? DEFAULT_SIZE,
    totalElements: payload?.totalElements ?? content.length,
    totalPages,
    isFirst: payload?.first ?? true,
    isLast: payload?.last ?? true,
    isEmpty: payload?.empty ?? content.length === 0,
  };
}

export async function listarProjetos({ page, size, termo, categoria, local, status } = {}) {
  const response = await api.get('/projetos', {
    params: buildProjetoQueryParams({ page, size, termo, categoria, local, status }),
  });

  return adaptProjetoPage(response.data);
}

export async function buscarProjetoPorId(id) {
  const response = await api.get(`/projetos/${id}`);
  return adaptProjeto(response.data);
}
