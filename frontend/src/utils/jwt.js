function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const decodedValue = globalThis.atob(paddedBase64);

  return decodeURIComponent(
    Array.from(decodedValue, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
  );
}

export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string' || typeof globalThis.atob !== 'function') {
    return null;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

export function getJwtExpirationTime(token) {
  const payload = decodeJwtPayload(token);
  const expiration = Number(payload?.exp);

  return Number.isFinite(expiration) ? expiration * 1000 : null;
}

export function isJwtExpired(token) {
  const expiresAt = getJwtExpirationTime(token);

  return Boolean(expiresAt && Date.now() >= expiresAt);
}
