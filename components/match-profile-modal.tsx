"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Phone, MapPin, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface Match {
  id: number
  name: string
  age: number
  location: string
  bio: string
  foto_url: string
  video_url: string
  sports: { sport: string; level: string }[]
  match_date: string
  instagram?: string
  whatsapp?: string
  phone?: string
}

interface MatchProfileModalProps {
  match: Match | null
  isOpen: boolean
  onClose: () => void
}

export function MatchProfileModal({ match, isOpen, onClose }: MatchProfileModalProps) {
  if (!match) return null

  const handleWhatsAppClick = () => {
    const phoneNumber = match.whatsapp || match.phone
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, "")
      window.open(`https://wa.me/${cleanNumber}`, "_blank")
    }
  }

  const handleInstagramClick = () => {
    if (match.instagram) {
      const username = match.instagram.replace("@", "")
      window.open(`https://instagram.com/${username}`, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {match.name}, {match.age}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Section */}
          {match.video_url && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <video
                src={match.video_url}
                controls
                className="w-full rounded-lg aspect-video object-cover"
                poster={match.foto_url}
              >
                Tu navegador no soporta videos.
              </video>
            </motion.div>
          )}

          {/* Profile Image (if no video) */}
          {!match.video_url && match.foto_url && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <img
                src={match.foto_url || "/placeholder.svg"}
                alt={match.name}
                className="w-full rounded-lg aspect-video object-cover"
              />
            </motion.div>
          )}

          {/* Location and Match Date */}
          <motion.div
            className="flex items-center justify-between text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{match.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Match: {new Date(match.match_date).toLocaleDateString()}</span>
            </div>
          </motion.div>

          {/* Bio/Description */}
          {match.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="font-semibold mb-2">Sobre mí</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{match.bio}</p>
            </motion.div>
          )}

          {/* Sports */}
          {match.sports && match.sports.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="font-semibold mb-3">Deportes</h3>
              <div className="flex flex-wrap gap-2">
                {match.sports.map((sport, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {sport.sport} - {sport.level}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact Buttons */}
          <motion.div
            className="space-y-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {(match.whatsapp || match.phone) && (
              <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            )}

            {match.instagram && (
              <Button onClick={handleInstagramClick} variant="outline" className="w-full bg-transparent">
                <Instagram className="h-4 w-4 mr-2" />
                Ver Instagram
              </Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
