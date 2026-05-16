export function getErrorMessage(error, fallbackMessage) {
  const apiMessage =
    (typeof error?.response?.data === 'string' ? error.response.data : null) ??
    error?.response?.data?.message ??
    error?.response?.data?.detail ??
    error?.response?.data?.title ??
    error?.response?.data?.error ??
    error?.message;

  return apiMessage || fallbackMessage;
}
