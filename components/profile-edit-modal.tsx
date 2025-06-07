"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SportSelector } from "@/components/sport-selector"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/types/user"

interface ProfileEditModalProps {
  isOpenAction: boolean
  onCloseAction: () => void
  profile: User
}

export function ProfileEditModal({ isOpenAction, onCloseAction, profile }: ProfileEditModalProps) {
  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age?.toString() || "")
  const [location, setLocation] = useState(profile.location)
  const [description, setDescription] = useState(profile.description)
  const [selectedSports, setSelectedSports] = useState<string[]>(
      typeof profile.sports === "string" ? profile.sports.split(",").map(s => s.trim()) : profile.sports
  )

  const handleSportToggle = (sports: string) => {
    setSelectedSports((prev) =>
        prev.includes(sports) ? prev.filter((s) => s !== sports) : [...prev, sports]
    )
  }

  const handleSave = () => {
    onCloseAction()
  }

  return (
      <Dialog open={isOpenAction} onOpenChange={onCloseAction}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage
                  src={profile.profile_picture || "/placeholder.svg?height=80&width=80"}
                  alt={profile.name}
              />
              <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="sports">Deportes</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Edad</Label>
                <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Sobre mí</Label>
                <Textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="sports" className="pt-4">
              <SportSelector
                  selectedSports={selectedSports}
                  onToggleSportAction={handleSportToggle}
              />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={onCloseAction}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
