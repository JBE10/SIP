"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Instagram, MessageSquare, Phone } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { API_BASE_URL } from "@/lib/config/api"

interface ContactInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function ContactInfoModal({ isOpen, onClose, onSave }: ContactInfoModalProps) {
  const { user, updateUser } = useAuth()
  const [instagram, setInstagram] = useState(user?.instagram || "")
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          instagram: instagram.trim() || null,
          whatsapp: whatsapp.trim() || null,
          phone: phone.trim() || null,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser(updatedUser)
        onSave()
        onClose()
      } else {
        console.error("Error actualizando información de contacto")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Información de Contacto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-pink-600" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="tu_usuario"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Solo tu nombre de usuario, sin @
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              placeholder="5491112345678"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Número con código de país (ej: 5491112345678)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              Teléfono
            </Label>
            <Input
              id="phone"
              placeholder="+54 9 11 1234-5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Número de teléfono para llamadas
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Consejo:</strong> Agregar tu información de contacto ayuda a que tus matches puedan comunicarse contigo más fácilmente.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 