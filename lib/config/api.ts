// lib/config/api.ts

// Configuración de API que detecta automáticamente el entorno
const isDevelopment = process.env.NODE_ENV === 'development'
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
)

// URL dinámica basada en el entorno
export const API_BASE_URL = isDevelopment || isLocalhost 
  ? 'http://localhost:8000'  // Desarrollo local
  : 'https://web-production-07ed64.up.railway.app'  // Railway backend

console.log('API_BASE_URL:', API_BASE_URL, 'NODE_ENV:', process.env.NODE_ENV, 'isLocalhost:', isLocalhost)

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  me: `${API_BASE_URL}/users/me`,
  uploadPhoto: `${API_BASE_URL}/upload-profile-picture`,
  uploadVideo: `${API_BASE_URL}/upload-sport-video`,
  compatible: `${API_BASE_URL}/users/compatible`,
  matches: `${API_BASE_URL}/matches`,
  // Endpoints para compatibilidad con el contexto de autenticación
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  USER: {
    ME: `${API_BASE_URL}/users/me`,
    COMPATIBLE: `${API_BASE_URL}/users/compatible`,
    LIKE: (userId: number) => `${API_BASE_URL}/users/like/${userId}`,
    DISLIKE: (userId: number) => `${API_BASE_URL}/users/dislike/${userId}`,
  },
} as const

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
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