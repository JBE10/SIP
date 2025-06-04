"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { User } from "@/context/auth-context"
import { useAuth } from "@/context/auth-context"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: User
}

export function ProfileEditModal({ isOpen, onClose, profile }: ProfileEditModalProps) {
  const { handleAuthError } = useAuth()
  const [form, setForm] = useState({
    name: "",
    age: 0,
    location: "",
    bio: "",
    email: "",
    sports: [] as string[],
    newSport: "",
    profilePicture: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadError, setUploadError] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        age: profile.age || 0,
        location: profile.location || "",
        bio: profile.bio || "",
        email: profile.email || "",
        sports: profile.sports || [],
        newSport: "",
        profilePicture: profile.profilePicture || ""
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === "age" ? parseInt(value) : value }))
  }

  const handleAddSport = () => {
    const sport = form.newSport.trim()
    if (sport && !form.sports.includes(sport)) {
      setForm(prev => ({ ...prev, sports: [...prev.sports, sport], newSport: "" }))
    }
  }

  const handleRemoveSport = (sport: string) => {
    setForm(prev => ({ ...prev, sports: prev.sports.filter(s => s !== sport) }))
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No hay token de autenticación")
      handleAuthError()
      return
    }

    try {
      const res = await fetch("http://localhost:8000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          bio: form.bio,
          deportes: form.sports,
          age: form.age,
          location: form.location,
          profilePicture: form.profilePicture
        })
      });

      const data = await res.json();
      console.log("Respuesta backend:", data);

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        window.location.reload();
      } else {
        if (res.status === 401) {
          handleAuthError()
        } else {
          console.error("Error al actualizar perfil:", res.status, data);
        }
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/upload-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Foto subida:", data.profilePicture);
        setForm(prev => ({ ...prev, profilePicture: data.profilePicture }));
        setUploadStatus("success");
        
        // Actualizar el usuario en localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.profilePicture = data.profilePicture;
          localStorage.setItem("user", JSON.stringify(user));
        }
        
        // Recargar la página para mostrar la nueva imagen
        window.location.reload();
      } else {
        if (res.status === 401) {
          handleAuthError();
        } else {
          setUploadError(data.detail || "Error al subir la foto");
          setUploadStatus("error");
        }
      }
    } catch (error) {
      console.error("Error al subir la foto:", error);
      setUploadError("Error al subir la foto");
      setUploadStatus("error");
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Nombre completo</Label>
              <Input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <Label>Edad</Label>
              <Input name="age" value={form.age} onChange={handleChange} type="number" />
            </div>

            <div className="space-y-1">
              <Label>Ubicación</Label>
              <Input name="location" value={form.location} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <Label>Sobre mí</Label>
              <Textarea name="bio" value={form.bio} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <Label>Deportes</Label>
              <div className="flex gap-2">
                <Input
                    name="newSport"
                    value={form.newSport}
                    onChange={handleChange}
                    placeholder="Agregar deporte"
                />
                <Button onClick={handleAddSport}>Agregar</Button>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {form.sports.map((sport) => (
                    <div key={sport} className="bg-secondary px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      {sport}
                      <button onClick={() => handleRemoveSport(sport)} className="text-red-500">
                        &times;
                      </button>
                    </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
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

            <Button className="w-full mt-4" onClick={handleSubmit}>
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}
