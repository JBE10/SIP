import { API_ENDPOINTS } from '../config/api'

export async function registerUser(userData: {
  username: string
  email: string
  password: string
  deportes_preferidos?: string
  descripcion?: string
  foto_url?: string
  video_url?: string
  age?: number
  location?: string
}) {
  try {
    const response = await fetch(API_ENDPOINTS.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Error al registrarse")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en el registro:", error)
    throw error
  }
} 