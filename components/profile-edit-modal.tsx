"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { User } from "@/context/auth-context"
import { useAuth } from "@/context/auth-context"
import { API_ENDPOINTS } from "@/src/config/api"
import { SportSelector } from "@/components/sport-selector"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

// Función para parsear deportes (igual que en auth-context)
const parseSports = (deportesString: string): { sport: string; level: string }[] => {
  if (!deportesString) return []
  
  try {
    // Si ya es un array, devolverlo tal cual
    if (Array.isArray(deportesString)) {
      return deportesString.map(sport => {
        if (typeof sport === "string") {
          // Intentar parsear "Deporte (Nivel)"
          const match = sport.match(/^(.+?)\s*\((.+?)\)$/)
          if (match) {
            return { sport: match[1].trim(), level: match[2].trim() }
          }
          return { sport: sport.trim(), level: "Principiante" }
        }
        return sport
      })
    }
    
    // Si es string, dividir por comas y parsear cada uno
    const sportsArray = deportesString.split(",").map(s => s.trim()).filter(s => s)
    return sportsArray.map(sport => {
      const match = sport.match(/^(.+?)\s*\((.+?)\)$/)
      if (match) {
        return { sport: match[1].trim(), level: match[2].trim() }
      }
      return { sport: sport.trim(), level: "Principiante" }
    })
  } catch (error) {
    console.error("Error parseando deportes:", error)
    return []
  }
}

const barrios = [
  "Palermo",
  "Belgrano",
  "Recoleta",
  "Villa Crespo",
  "Caballito",
  "San Telmo",
  "Almagro",
  "Núñez",
  "Colegiales",
  "Retiro",
  "Puerto Madero",
  "Villa Urquiza",
  "Saavedra",
  "Boedo",
  "Flores",
]

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: User
}

export function ProfileEditModal({ isOpen, onClose, profile }: ProfileEditModalProps) {
  const { handleAuthError } = useAuth()
  const [localSports, setLocalSports] = useState<{ sport: string; level: string }[]>([])
  
  const [form, setForm] = useState({
    name: "",
    age: 0,
    location: barrios[0],
    bio: "",
    email: "",
    profilePicture: "",
    deportes_preferidos: "",
    instagram: "",
    whatsapp: "",
    phone: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    if (profile && isOpen) {
      console.log("=== DEBUGGING PERFIL ===")
      console.log("Perfil completo:", profile)
      console.log("profile.sports (tipo):", typeof profile.sports, profile.sports)
      console.log("profile.deportes_preferidos (tipo):", typeof profile.deportes_preferidos, profile.deportes_preferidos)
      
      // Verificar si los deportes ya están en formato objeto
      if (Array.isArray(profile.sports) && profile.sports.length > 0) {
        console.log("Primer deporte:", profile.sports[0])
        console.log("¿Es objeto?:", typeof profile.sports[0] === 'object')
      }
      
      // Debuggear parseSports paso a paso
      const deportesString = profile.deportes_preferidos || (Array.isArray(profile.sports) ? profile.sports.join(", ") : "")
      console.log("String a parsear:", deportesString)
      console.log("¿Es string vacío?:", deportesString === "")
      console.log("¿Es null/undefined?:", deportesString == null)
      
      const parsedSports = parseSports(deportesString)
      console.log("Deportes parseados:", parsedSports)
      console.log("=== FIN DEBUGGING ===")
      
      setForm({
        name: profile.name || profile.username || "",
        age: profile.age || 0,
        location: profile.location || barrios[0],
        bio: profile.bio || profile.descripcion || "",
        email: profile.email || "",
        profilePicture: profile.profilePicture || profile.foto_url || "",
        deportes_preferidos: deportesString,
        instagram: profile.instagram || "",
        whatsapp: profile.whatsapp || "",
        phone: profile.phone || ""
      })
      
      setLocalSports(parsedSports)
    }
  }, [profile, isOpen])

  // Función simple para actualizar deportes
  const updateSportsInForm = (newSports: { sport: string; level: string }[]) => {
    console.log("updateSportsInForm llamado con:", newSports)
    setLocalSports(newSports)
    const deportesString = newSports.map(s => `${s.sport} (${s.level})`).join(", ")
    console.log("String de deportes generado:", deportesString)
    setForm(prev => {
      const newForm = { ...prev, deportes_preferidos: deportesString }
      console.log("Nuevo formulario:", newForm)
      return newForm
    })
  }

  const handleSportToggle = (sport: string) => {
    console.log("handleSportToggle ejecutado con deporte:", sport)
    console.log("Deportes actuales:", localSports)
    
    const exists = localSports.find((s: any) => s.sport === sport)
    if (exists) {
      console.log("Eliminando deporte:", sport)
      const newSports = localSports.filter((s: any) => s.sport !== sport)
      updateSportsInForm(newSports)
    } else {
      console.log("Agregando deporte:", sport)
      const newSports = [...localSports, { sport, level: "Principiante" }]
      updateSportsInForm(newSports)
    }
  }

  const handleChangeLevel = (sport: string, level: string) => {
    console.log("handleChangeLevel ejecutado - deporte:", sport, "nivel:", level)
    const updated = localSports.map((s: any) => (s.sport === sport ? { ...s, level } : s))
    console.log("Deportes actualizados:", updated)
    updateSportsInForm(updated)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "whatsapp") {
      setForm(prev => ({ ...prev, whatsapp: value, phone: value }))
    } else {
      setForm(prev => ({ ...prev, [name]: name === "age" ? parseInt(value) : value }))
    }
  }

  const handleSubmit = async () => {
    console.log("=== GUARDANDO PERFIL ===")
    console.log("handleSubmit ejecutándose...")
    console.log("Datos del formulario:", form)
    console.log("Deportes del formulario:", form.deportes_preferidos)
    
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No hay token de autenticación")
      handleAuthError()
      return
    }

    try {
      const payload = {
        username: form.name,
        descripcion: form.bio,
        deportes_preferidos: form.deportes_preferidos,
        age: form.age,
        location: form.location,
        foto_url: form.profilePicture,
        instagram: form.instagram,
        whatsapp: form.whatsapp,
        phone: form.phone
      }
      
      console.log("Enviando payload al backend:", payload)
      console.log("URL del endpoint:", API_ENDPOINTS.AUTH.PROFILE_UPDATE)

      const res = await fetch(API_ENDPOINTS.AUTH.PROFILE_UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      console.log("Respuesta del servidor:", res.status, res.statusText)
      const data = await res.json();
      console.log("Datos de respuesta:", data);

      if (res.ok) {
        console.log("Perfil actualizado exitosamente")
        // Actualizar el usuario en localStorage con los datos del backend
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const updatedUser = {
            ...user,
            name: data.user.username,
            username: data.user.username,
            bio: data.user.descripcion,
            descripcion: data.user.descripcion,
            age: data.user.edad,
            location: data.user.location,
            foto_url: data.user.foto_url,
            profilePicture: data.user.foto_url,
            sports: parseSports(data.user.deportes_preferidos || data.user.sports || ""),
            deportes_preferidos: data.user.deportes_preferidos,
            instagram: data.user.instagram || "",
            whatsapp: data.user.whatsapp || "",
            phone: data.user.phone || ""
          };
          console.log("Usuario actualizado en localStorage:", updatedUser)
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        // Cerrar el modal en lugar de recargar la página
        onClose();
        
        // Mostrar mensaje de éxito
        alert("Perfil actualizado exitosamente");
      } else {
        if (res.status === 401) {
          handleAuthError()
        } else {
          console.error("Error al actualizar perfil:", res.status, data);
          alert("Error al actualizar perfil: " + (data.detail || "Error desconocido"));
        }
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error de conexión al actualizar perfil");
    }
    console.log("=== FIN GUARDANDO PERFIL ===")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tipo de archivo
      if (!file.type.startsWith("image/")) {
        setUploadError("Solo se permiten archivos de imagen");
        return;
      }

      // Verificar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("La imagen debe ser menor a 5MB");
        return;
      }

      setSelectedFile(file);
      setUploadError("");
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) {
      setUploadError("Por favor selecciona una imagen");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación");
      handleAuthError();
      return;
    }

    setUploadStatus("uploading");
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Subiendo foto al servidor...");
      const res = await fetch(API_ENDPOINTS.USER.UPLOAD_PHOTO, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Respuesta del servidor:", res.status, res.statusText);

      if (res.ok) {
        const data = await res.json();
        console.log("Foto subida exitosamente:", data);
        
        // El backend devuelve foto_url, no profilePicture
        const fotoUrl = data.foto_url;
        setForm(prev => ({ ...prev, profilePicture: fotoUrl }));
        setUploadStatus("success");
        
        // Actualizar el usuario en localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.profilePicture = fotoUrl;
          user.foto_url = fotoUrl;
          localStorage.setItem("user", JSON.stringify(user));
        }
        
        // No recargar la página, solo mostrar mensaje de éxito
        setUploadStatus("success");
        setTimeout(() => {
          setUploadStatus("idle");
          setSelectedFile(null);
        }, 2000);
      } else {
        if (res.status === 401) {
          handleAuthError();
        } else {
          let errorData;
          try {
            errorData = await res.json();
          } catch {
            errorData = await res.text();
          }
          console.error("Error al subir foto:", res.status, errorData);
          setUploadError(errorData.detail || "Error al subir la foto");
          setUploadStatus("error");
        }
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
      setUploadError("Error de conexión al subir la foto");
      setUploadStatus("error");
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div id="profile-edit-description" className="sr-only">
            Formulario para editar información del perfil de usuario
          </div>

          <div className="overflow-y-auto max-h-[70vh] min-h-[300px] p-2">
            <Accordion type="multiple" defaultValue={["personal", "contacto"]} className="w-full">
              <AccordionItem value="personal">
                <AccordionTrigger>Datos personales</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Nombre completo</Label>
                    <Input name="name" value={form.name} onChange={handleChange} />
                    <Label>Edad</Label>
                    <Input name="age" value={form.age} onChange={handleChange} type="number" />
                    <Label htmlFor="location">Barrio/Zona</Label>
                    <select
                      id="location"
                      name="location"
                      className="w-full rounded-md border px-2 py-2 text-base"
                      value={form.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sin especificar</option>
                      {barrios.map((barrio) => (
                        <option key={barrio} value={barrio}>{barrio}</option>
                      ))}
                    </select>
                    <Label>Email</Label>
                    <Input name="email" value={form.email} onChange={handleChange} />
                    <Label>Sobre mí</Label>
                    <Textarea name="bio" value={form.bio} onChange={handleChange} />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contacto">
                <AccordionTrigger>Contacto</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Instagram (link completo)</Label>
                    <Input
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/tuusuario"
                      type="url"
                    />
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="5491112345678"
                      value={form.whatsapp}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">Número con código de país (ej: 5491112345678)</p>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+54 9 11 1234-5678"
                      value={form.phone}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">Número de teléfono para llamadas</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="deportes">
                <AccordionTrigger>Deportes</AccordionTrigger>
                <AccordionContent>
                  <SportSelector
                    selectedSports={localSports}
                    onToggleSport={handleSportToggle}
                    onChangeLevel={handleChangeLevel}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="foto">
                <AccordionTrigger>Foto de perfil</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Label>Foto de perfil</Label>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                    <Button 
                      onClick={uploadPhoto} 
                      disabled={!selectedFile || uploadStatus === "uploading"}
                    >
                      {uploadStatus === "uploading" ? "Subiendo..." : "Subir foto"}
                    </Button>
                    {uploadError && (
                      <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                    )}
                    {uploadStatus === "success" && (
                      <p className="text-green-500 text-sm mt-1">Foto subida exitosamente</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="pt-4 border-t">
            <Button className="w-full" onClick={handleSubmit}>
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}
