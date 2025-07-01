"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, User, Trash2 } from "lucide-react"
import { API_ENDPOINTS } from "@/src/config/api"
import { useAuth } from "@/context/auth-context"

export function ProfilePictureUpload() {
  const { user, handleAuthError } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  // Cargar la foto de perfil actual
  useEffect(() => {
    if (user) {
      setProfilePicture(user.foto_url || user.profilePicture || "")
    }
  }, [user])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    
    if (!file.type.startsWith("image/")) {
      setUploadError("Solo se permiten archivos de imagen")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo es demasiado grande. Máximo 5MB")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("token")

    if (!token) {
      setUploadError("No hay token de autenticación")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      console.log("Enviando foto a:", API_ENDPOINTS.USER.UPLOAD_PHOTO)
      
      const res = await fetch(API_ENDPOINTS.USER.UPLOAD_PHOTO, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        if (res.status === 401) {
          setUploadError("Token inválido o expirado")
          handleAuthError()
          return
        }
        
        let errorMessage = `Error ${res.status}`
        try {
          const errorData = await res.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch {
          // Usar mensaje por defecto
        }
        
        setUploadError(`Error al subir foto: ${errorMessage}`)
        return
      }

      const data = await res.json()
      console.log("Foto subida exitosamente:", data)
      
      // Actualizar localStorage
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        userData.foto_url = data.foto_url
        userData.profilePicture = data.foto_url
        localStorage.setItem("user", JSON.stringify(userData))
      }
      
      setProfilePicture(data.foto_url)
      alert("¡Foto de perfil subida exitosamente!")
    } catch (error) {
      console.error("Error al subir foto:", error)
      setUploadError("Error de conexión: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!profilePicture) return

    const token = localStorage.getItem("token")
    if (!token) {
      setUploadError("No hay token de autenticación")
      return
    }

    try {
      // Limpiar la foto en localStorage
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        userData.foto_url = ""
        userData.profilePicture = ""
        localStorage.setItem("user", JSON.stringify(userData))
      }
      
      setProfilePicture("")
      alert("Foto de perfil eliminada")
    } catch (error) {
      console.error("Error al eliminar foto:", error)
      setUploadError("Error al eliminar la foto")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Foto de Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profilePicture ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mi Foto de Perfil</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log("Botón de cambiar foto clickeado")
                    const input = document.getElementById('photo-upload') as HTMLInputElement
                    if (input) {
                      input.click()
                    } else {
                      console.error("No se encontró el input file")
                    }
                  }}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeletePhoto}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Sube una foto para tu perfil
            </p>
            <p className="text-xs text-muted-foreground">
              Máximo 5MB • Formatos: JPG, PNG, GIF
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          {/* Botón para subir foto */}
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("Botón de subir foto clickeado")
              const input = document.getElementById('photo-upload') as HTMLInputElement
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
            {isUploading ? "Subiendo..." : profilePicture ? "Cambiar foto" : "Subir foto"}
          </Button>
          
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            disabled={isUploading}
            id="photo-upload"
          />
          
          {uploadError && (
            <p className="text-red-500 text-sm">{uploadError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 