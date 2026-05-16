export function getErrorMessage(error, fallbackMessage) {
  const data = error?.response?.data;
  const validationMessage = getValidationMessage(data?.errors ?? data?.fieldErrors);
  const apiMessage =
    (typeof data === 'string' ? data : null) ??
    validationMessage ??
    data?.message ??
    data?.detail ??
    data?.title ??
    data?.error ??
    error?.message;

  return apiMessage || fallbackMessage;
}

function getValidationMessage(errors) {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    const firstError = errors.find(Boolean);

    return (
      firstError?.defaultMessage ??
      firstError?.message ??
      (typeof firstError === 'string' ? firstError : null)
    );
  }

  if (typeof errors === 'object') {
    const firstError = Object.values(errors).flat().find(Boolean);

    return typeof firstError === 'string' ? firstError : firstError?.message ?? null;
  }

  return null;
}
