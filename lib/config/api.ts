// lib/config/api.ts

// Configuración de API que detecta automáticamente el entorno
const isDevelopment = process.env.NODE_ENV === 'development'
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'

// Por ahora usar localhost hasta que Railway esté configurado
export const API_BASE_URL = 'http://localhost:8000'  // Backend local

// Una vez que Railway esté funcionando, cambiar a:
// export const API_BASE_URL = isDevelopment || isLocalhost 
//   ? 'http://localhost:8000'  // Desarrollo local
//   : 'https://TU_URL_RAILWAY_CORRECTA'  // Railway backend

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  me: `${API_BASE_URL}/users/me`,
  uploadPhoto: `${API_BASE_URL}/users/upload-photo`,
  matches: `${API_BASE_URL}/matches`,
} as const

// Función auxiliar para hacer requests con configuración automática
export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  // Agregar token de autenticación si existe
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers: defaultHeaders,
  })
} 