function hasValue(value) {
  return value !== null && value !== undefined && value !== '';
}

const ENUM_LABELS = {
  APROVADA: 'Aprovada',
  ATIVO: 'Ativo',
  CANCELADA: 'Cancelada',
  CANCELADO: 'Cancelado',
  CONCLUIDA: 'Concluída',
  ENCERRADO: 'Encerrado',
  FINALIZADA: 'Finalizada',
  HIBRIDO: 'Híbrido',
  ORGANIZACAO: 'Organização',
  PENDENTE: 'Pendente',
  PRESENCIAL: 'Presencial',
  RECUSADA: 'Recusada',
  REMOTO: 'Remoto',
  VOLUNTARIO: 'Voluntário',
};

const CATEGORY_LABELS = {
  'apoio social': 'Apoio Social',
  cultura: 'Cultura',
  educacao: 'Educação',
  'meio ambiente': 'Meio Ambiente',
  saude: 'Saúde',
};

function normalizeLabelKey(value) {
  return String(value)
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function formatEnumLabel(value) {
  if (!hasValue(value)) {
    return 'Não informado';
  }

  const normalizedValue = String(value).toUpperCase();

  if (ENUM_LABELS[normalizedValue]) {
    return ENUM_LABELS[normalizedValue];
  }

  return String(value)
    .toLowerCase()
    .split('_')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export function formatCategoryName(value) {
  if (!hasValue(value)) {
    return 'Categoria não informada';
  }

  const normalizedValue = String(value).trim();
  const normalizedKey = normalizeLabelKey(normalizedValue);

  return CATEGORY_LABELS[normalizedKey] ?? normalizedValue;
}

export function formatDate(dateValue) {
  if (!hasValue(dateValue)) {
    return 'Data não informada';
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatDateTime(dateValue) {
  if (!hasValue(dateValue)) {
    return 'Data não informada';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatDateRange(startDate, endDate) {
  if (!hasValue(startDate) && !hasValue(endDate)) {
    return 'Período não informado';
  }

  if (!hasValue(startDate)) {
    return `Até ${formatDate(endDate)}`;
  }

  if (!hasValue(endDate) || startDate === endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} até ${formatDate(endDate)}`;
}

export function truncateText(text, maxLength = 140) {
  if (!hasValue(text)) {
    return '';
  }

  const normalizedText = String(text).trim();

  if (normalizedText.length <= maxLength) {
    return normalizedText;
  }

  return `${normalizedText.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}
