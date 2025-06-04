"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SportSelector } from "@/components/sport-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: any
}

export function ProfileEditModal({ isOpen, onClose, profile }: ProfileEditModalProps) {
  const [username, setUsername] = useState(profile.username || "")
  const [description, setDescription] = useState(profile.description || "")
  const [ubicacion, setUbicacion] = useState(profile.ubicacion || "")
  const [deportes_preferidos, setDeportesPreferidos] = useState<string[]>(
    profile.deportes_preferidos ? profile.deportes_preferidos.split(",") : []
  )

  const handleSportToggle = (sport: string) => {
    if (deportes_preferidos.includes(sport)) {
      setDeportesPreferidos(deportes_preferidos.filter((s) => s !== sport))
    } else {
      setDeportesPreferidos([...deportes_preferidos, sport])
    }
  }

  const handleSave = () => {
    // En una aplicación real, aquí guardaríamos los cambios en el perfil
    // Por ahora, simplemente cerramos el modal
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={profile.foto_url || "/placeholder-avatar.jpg"} alt={profile.username} />
            <AvatarFallback>{profile.username?.substring(0, 2) || "U"}</AvatarFallback>
          </Avatar>
        </div>
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="sports">Deportes</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input id="ubicacion" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Sobre mí</Label>
              <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </TabsContent>
          <TabsContent value="sports" className="pt-4">
            <SportSelector selectedSports={deportes_preferidos} onToggleSport={handleSportToggle} />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
