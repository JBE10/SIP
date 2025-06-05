import { registerUser } from "./register"

export const handleRegister = async () => {
  try {
    const response = await registerUser({
      username: "bauti123",
      email: "bauti@sportmatch.com",
      password: "12345678",
      deportes_preferidos: "Fútbol,Tenis",
      descripcion: "Apasionado por el deporte",
      foto_url: "https://miurl.com/foto.jpg",
      video_url: "https://miurl.com/video.mp4",
      age: 22,
      location: "CABA"
    })

    console.log("Registro exitoso:", response)
    // Redirigir o mostrar mensaje de éxito
    return response
  } catch (error: any) {
    console.error("Error en registro:", error.message)
    alert(error.message)
    throw error
  }
}

// Función para usar en formularios de React
export const registerFromForm = async (formData: FormData) => {
  const userData = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    deportes_preferidos: formData.get('deportes_preferidos') as string,
    descripcion: formData.get('descripcion') as string,
    foto_url: formData.get('foto_url') as string,
    age: formData.get('age') ? parseInt(formData.get('age') as string) : undefined,
    location: formData.get('location') as string,
  }

  return await registerUser(userData)
} 