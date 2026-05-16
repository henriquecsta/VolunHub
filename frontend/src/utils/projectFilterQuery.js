import { PROJECT_STATUS_VALUES } from '../constants/projects';

export const DEFAULT_PROJECT_FILTERS = {
  termo: '',
  local: '',
  categoria: '',
  status: 'ATIVO',
};

const SEARCH_PARAM_KEYS = {
  termo: 'busca',
  local: 'local',
  categoria: 'categoria',
  status: 'status',
  page: 'pagina',
};

export function createProjectFilters(overrides = {}) {
  return {
    termo: normalizeText(overrides.termo),
    local: normalizeText(overrides.local),
    categoria: normalizeCategory(overrides.categoria),
    status: normalizeStatus(overrides.status),
  };
}

export function parseProjectListQuery(searchParams) {
  return {
    filters: createProjectFilters({
      termo: searchParams.get(SEARCH_PARAM_KEYS.termo),
      local: searchParams.get(SEARCH_PARAM_KEYS.local),
      categoria: searchParams.get(SEARCH_PARAM_KEYS.categoria),
      status: searchParams.get(SEARCH_PARAM_KEYS.status),
    }),
    page: normalizePage(searchParams.get(SEARCH_PARAM_KEYS.page)),
  };
}

export function buildProjectListSearchParams(filters, page = 0) {
  const normalizedFilters = createProjectFilters(filters);
  const params = new URLSearchParams();
  const hasNonStatusFilters = Boolean(
    normalizedFilters.termo || normalizedFilters.local || normalizedFilters.categoria,
  );

  if (normalizedFilters.termo) {
    params.set(SEARCH_PARAM_KEYS.termo, normalizedFilters.termo);
  }

  if (normalizedFilters.local) {
    params.set(SEARCH_PARAM_KEYS.local, normalizedFilters.local);
  }

  if (normalizedFilters.categoria) {
    params.set(SEARCH_PARAM_KEYS.categoria, normalizedFilters.categoria);
  }

  if (normalizedFilters.status !== DEFAULT_PROJECT_FILTERS.status || hasNonStatusFilters) {
    params.set(SEARCH_PARAM_KEYS.status, normalizedFilters.status);
  }

  if (page > 0) {
    params.set(SEARCH_PARAM_KEYS.page, String(page + 1));
  }

  return params;
}

export function areProjectFiltersEqual(firstFilters, secondFilters) {
  const firstNormalizedFilters = createProjectFilters(firstFilters);
  const secondNormalizedFilters = createProjectFilters(secondFilters);

  return (
    firstNormalizedFilters.termo === secondNormalizedFilters.termo
    && firstNormalizedFilters.local === secondNormalizedFilters.local
    && firstNormalizedFilters.categoria === secondNormalizedFilters.categoria
    && firstNormalizedFilters.status === secondNormalizedFilters.status
  );
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeCategory(value) {
  const normalizedValue = normalizeText(value);

  return /^\d+$/.test(normalizedValue) ? normalizedValue : '';
}

function normalizeStatus(value) {
  const normalizedStatus = normalizeText(value).toUpperCase();

  return PROJECT_STATUS_VALUES.includes(normalizedStatus)
    ? normalizedStatus
    : DEFAULT_PROJECT_FILTERS.status;
}

function normalizePage(value) {
  const normalizedPage = Number(value);

  if (!Number.isInteger(normalizedPage) || normalizedPage <= 1) {
    return 0;
  }

  return normalizedPage - 1;
}
