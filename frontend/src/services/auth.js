// src/services/auth.js
// Serviço de autenticação JWT para login, refresh, logout e persistência dos tokens

const API_URL = '/api';

export async function login(username, password) {
  const response = await fetch(`${API_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Login inválido');
  const data = await response.json();
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  return data;
}

export async function refreshToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) throw new Error('Sem refresh token');
  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });
  if (!response.ok) throw new Error('Falha ao renovar token');
  const data = await response.json();
  localStorage.setItem('access', data.access);
  return data.access;
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

export function getAccessToken() {
  return localStorage.getItem('access');
}

export function isAuthenticated() {
  return !!getAccessToken();
}

// Intercepta fetch para adicionar JWT e renovar se necessário
export async function authFetch(url, options = {}) {
  let access = getAccessToken();
  if (!options.headers) options.headers = {};
  if (access) options.headers['Authorization'] = `Bearer ${access}`;
  let response = await fetch(url, options);
  if (response.status === 401 && localStorage.getItem('refresh')) {
    // Tenta renovar token
    try {
      access = await refreshToken();
      options.headers['Authorization'] = `Bearer ${access}`;
      response = await fetch(url, options);
    } catch (e) {
      logout();
      throw new Error('Sessão expirada');
    }
  }
  return response;
}
