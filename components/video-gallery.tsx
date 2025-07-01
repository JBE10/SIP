"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Play, Trash2, Video } from "lucide-react"
import { API_ENDPOINTS } from "@/src/config/api"
import { useAuth } from "@/context/auth-context"

export function VideoGallery() {
  const { user, handleAuthError } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [videos, setVideos] = useState<string[]>([])

  // Cargar videos del usuario
  useEffect(() => {
    if (user?.video_url) {
      setVideos([user.video_url])
    }
  }, [user?.video_url])

  console.log("VideoGallery renderizado, user:", user?.username, "video_url:", user?.video_url, "videos:", videos)

  const handleDeleteVideo = async (videoUrl: string, index: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este video?")) return
    
    const token = localStorage.getItem("token")
    if (!token) {
      setUploadError("No hay token de autenticación")
      return
    }

    try {
      // Por ahora solo eliminamos del estado local
      // TODO: Implementar endpoint para eliminar video del backend
      setVideos(videos.filter((_, i) => i !== index))
      
      // Actualizar localStorage
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        if (videos.length === 1) {
          userData.video_url = null
        }
        localStorage.setItem("user", JSON.stringify(userData))
      }
    } catch (error) {
      console.error("Error al eliminar video:", error)
      setUploadError("Error al eliminar video")
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleVideoUpload llamado")
    if (!e.target.files || e.target.files.length === 0) {
      console.log("No se seleccionó ningún archivo")
      return
    }
    
    const file = e.target.files[0]
    console.log("Archivo seleccionado:", file.name, file.type, file.size)
    
    // Verificar que sea un video
    if (!file.type.startsWith("video/")) {
      setUploadError("Solo se permiten archivos de video")
      return
    }

    // Verificar tamaño (50MB máximo)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("El archivo es demasiado grande. Máximo 50MB")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("token")

    console.log("Token encontrado:", !!token)
    if (!token) {
      setUploadError("No hay token de autenticación. Por favor, inicia sesión nuevamente.")
      return
    }

    // Verificar que el token no esté vacío
    if (token.trim() === "") {
      setUploadError("Token vacío. Por favor, inicia sesión nuevamente.")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      console.log("Enviando petición a:", API_ENDPOINTS.USER.UPLOAD_VIDEO)
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "No hay token")
      console.log("FormData:", formData)
      
      const res = await fetch(API_ENDPOINTS.USER.UPLOAD_VIDEO, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        console.log("Error en respuesta:", res.status, res.statusText)
        
        if (res.status === 401) {
          console.log("Error 401: Token inválido o expirado")
          setUploadError("Token inválido o expirado. Por favor, inicia sesión nuevamente.")
          handleAuthError()
          return
        }
        
        let errorMessage = `Error ${res.status}: ${res.statusText}`
        try {
          const errorData = await res.json()
          if (errorData.detail) {
            errorMessage = errorData.detail
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch {
          try {
            const errorText = await res.text()
            if (errorText) {
              errorMessage = errorText
            }
          } catch {
            // Si no se puede leer el error, usar el mensaje por defecto
          }
        }
        
        console.log("Error detallado:", errorMessage)
        setUploadError(`Error al subir video: ${errorMessage}`)
        return
      }

      const data = await res.json()
      console.log("Video subido exitosamente:", data)
      
      // Actualizar el usuario en localStorage
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        userData.video_url = data.video_url
        localStorage.setItem("user", JSON.stringify(userData))
      }
      
      // Actualizar la lista de videos
      setVideos([data.video_url])
      
      // Mostrar mensaje de éxito
      alert("¡Video subido exitosamente!")
    } catch (error) {
      console.error("Error de red al subir video:", error)
      setUploadError("Error de conexión: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Video Deportivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {videos.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mis Videos Deportivos</h3>
            {videos.map((videoUrl, index) => (
              <div key={index} className="space-y-2">
                <div className="relative">
                  <video
                    controls
                    className="w-full rounded-lg shadow-md"
                    src={videoUrl}
                    poster={user?.profilePicture}
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteVideo(videoUrl, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Video {index + 1} - Demostración deportiva
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Sube un video corto mostrando tus habilidades deportivas
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo 50MB • Formatos: MP4, MOV, AVI
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          {/* Botón para subir video */}
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("Botón de subir video clickeado")
              const input = document.getElementById('video-upload') as HTMLInputElement
              if (input) {
                input.click()
              } else {
                console.error("No se encontró el input file")
              }
            }}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Subiendo..." : videos.length > 0 ? "Agregar otro video" : "Subir video"}
          </Button>
          
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            disabled={isUploading}
            id="video-upload"
          />
          
          {uploadError && (
            <p className="text-red-500 text-sm">{uploadError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 