const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof process !== 'undefined' ? (process as any).env?.VITE_API_BASE_URL : undefined) ||
  'http://localhost:4000/api';

export const apiConfig = {
  baseURL: API_BASE_URL.replace(/\/$/, ''),
};

const TOKEN_KEY = 'safenet_token';
let authToken: string | null =
  typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (typeof localStorage !== 'undefined') {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken() {
  if (!authToken && typeof localStorage !== 'undefined') {
    authToken = localStorage.getItem(TOKEN_KEY);
  }
  return authToken;
}
