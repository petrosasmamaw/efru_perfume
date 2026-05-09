const DEPLOYED_API_URL =
  import.meta.env.VITE_API_URL || 'https://efru-perfume.onrender.com';

const LOCAL_API_URL =
  import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:5000';

export function getApiBaseUrl() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0';

  return isLocalhost ? LOCAL_API_URL : DEPLOYED_API_URL;
}
