"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, User } from "lucide-react"
import { API_ENDPOINTS } from "@/src/config/api"
import { useAuth } from "@/context/auth-context"

export function ProfilePictureUpload() {
  const { user, handleAuthError } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  useEffect(() => {
    if (user) {
      setProfilePicture(user.foto_url || user.profilePicture || "")
    }
  }, [user])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("🖼️ Iniciando upload de foto...")
    if (!e.target.files || e.target.files.length === 0) {
      console.log("❌ No se seleccionó ningún archivo")
      return
    }
    
    const file = e.target.files[0]
    console.log("📁 Archivo seleccionado:", {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    })
    
    if (!file.type.startsWith("image/")) {
      console.log("❌ Tipo de archivo no válido:", file.type)
      setUploadError("Solo se permiten archivos de imagen")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("❌ Archivo demasiado grande:", file.size)
      setUploadError("El archivo es demasiado grande. Máximo 5MB")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("token")

    console.log("🔑 Token encontrado:", !!token)
    console.log("🔑 Token length:", token ? token.length : 0)
    console.log("🔑 Token preview:", token ? `${token.substring(0, 20)}...` : "No token")
    
    if (!token) {
      console.log("❌ No hay token de autenticación")
      setUploadError("No hay token de autenticación")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      const uploadUrl = API_ENDPOINTS.USER.UPLOAD_PHOTO
      console.log("🚀 URL de upload:", uploadUrl)
      console.log("🌍 Entorno:", process.env.NODE_ENV)
      console.log("🔗 API_URL:", process.env.NEXT_PUBLIC_API_URL || "No definido")
      
      console.log("📊 FormData entries:")
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? {
          name: value.name,
          type: value.type,
          size: value.size
        } : value)
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      
      console.log("📋 Headers de la petición:", headers)
      
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: formData,
      })

      console.log("📡 Respuesta del servidor:")
      console.log("  Status:", res.status)
      console.log("  Status Text:", res.statusText)
      console.log("  OK:", res.ok)
      console.log("  Headers:", Object.fromEntries(res.headers.entries()))

      if (!res.ok) {
        console.log("❌ Error en respuesta:", res.status, res.statusText)
        
        if (res.status === 401) {
          console.log("🔒 Error 401: Token inválido o expirado")
          setUploadError("Token inválido o expirado")
          handleAuthError()
          return
        }
        
        if (res.status === 403) {
          console.log("🚫 Error 403: Acceso denegado")
          setUploadError("Acceso denegado")
          return
        }
        
        if (res.status === 404) {
          console.log("🔍 Error 404: Endpoint no encontrado")
          setUploadError("Endpoint no encontrado")
          return
        }
        
        let errorMessage = `Error ${res.status}`
        try {
          const errorData = await res.json()
          console.log("📄 Error data:", errorData)
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (parseError) {
          console.log("❌ Error parseando respuesta:", parseError)
          try {
            const errorText = await res.text()
            console.log("📄 Error text:", errorText)
            errorMessage = errorText || errorMessage
          } catch {
            // Usar mensaje por defecto
          }
        }
        
        console.log("💬 Error final:", errorMessage)
        setUploadError(`Error al subir foto: ${errorMessage}`)
        return
      }

      const data = await res.json()
      console.log("✅ Foto subida exitosamente:", data)
      console.log("🖼️ foto_url recibida:", data.foto_url)
      
      // Actualizar localStorage
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const userData = JSON.parse(userStr)
        userData.foto_url = data.foto_url
        userData.profilePicture = data.foto_url
        localStorage.setItem("user", JSON.stringify(userData))
        console.log("💾 Usuario actualizado en localStorage:", userData)
      }
      
      setProfilePicture(data.foto_url)
      console.log("🎯 Estado local actualizado con:", data.foto_url)
      alert("¡Foto de perfil subida exitosamente!")
    } catch (error) {
      console.error("🌐 Error de red al subir foto:", error)
      console.error("📋 Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      setUploadError("Error de conexión: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsUploading(false)
      console.log("🏁 Upload finalizado")
    }
  }

  console.log("🖼️ Renderizando ProfilePictureUpload con profilePicture:", profilePicture)

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
              <img
                src={profilePicture || "/placeholder-user.jpg"}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-user.jpg"
                  console.error("❌ Error cargando imagen:", e)
                  console.error("🔗 URL de la imagen:", profilePicture)
                }}
                onLoad={() => console.log("✅ Imagen cargada exitosamente:", profilePicture)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log("🖱️ Botón cambiar foto clickeado")
                  const input = document.getElementById('photo-upload') as HTMLInputElement
                  if (input) {
                    input.click()
                  } else {
                    console.error("❌ No se encontró el input file")
                  }
                }}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Cambiar
              </Button>
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
        
        <Button 
          variant="outline" 
          onClick={() => {
            console.log("🖱️ Botón subir foto clickeado")
            const input = document.getElementById('photo-upload') as HTMLInputElement
            if (input) {
              input.click()
            } else {
              console.error("❌ No se encontró el input file")
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
      </CardContent>
    </Card>
  )
} 