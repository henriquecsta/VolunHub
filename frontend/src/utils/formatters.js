function hasValue(value) {
  return value !== null && value !== undefined && value !== '';
}

export function formatEnumLabel(value) {
  if (!hasValue(value)) {
    return 'Nao informado';
  }

  return String(value)
    .toLowerCase()
    .split('_')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export function formatDate(dateValue) {
  if (!hasValue(dateValue)) {
    return 'Data nao informada';
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatDateTime(dateValue) {
  if (!hasValue(dateValue)) {
    return 'Data nao informada';
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
    return 'Periodo nao informado';
  }

  if (!hasValue(startDate)) {
    return `Ate ${formatDate(endDate)}`;
  }

  if (!hasValue(endDate) || startDate === endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} ate ${formatDate(endDate)}`;
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
