import { apiFetch, setToken } from './client.js'

export async function register(name, email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  setToken(data.token)
  return data.user
}

export async function login(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  return data.user
}

export async function fetchMe() {
  const data = await apiFetch('/auth/me')
  return data.user
}

export function logout() {
  setToken(null)
}
