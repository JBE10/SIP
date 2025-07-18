"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"

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

interface MatchCardProps {
  match: Match
  index: number
  onClick: () => void
}

export function MatchCard({ match, index, onClick }: MatchCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-lg p-4 border cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={match.foto_url || "/placeholder-user.jpg"}
            alt={match.name || "Match"}
            className="w-16 h-16 rounded-full object-cover"
          />
          {match.video_url && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Match Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg truncate">
              {match.name}, {match.age}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{match.location}</span>
          </div>

          {match.bio && <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{match.bio}</p>}

          {/* Sports Preview */}
          {(match.sports && Array.isArray(match.sports) && match.sports.length > 0) && (
            <div className="flex flex-wrap gap-1 mb-2">
              {match.sports.slice(0, 2).map((sport, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {sport.sport}
                </Badge>
              ))}
              {match.sports.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{match.sports.length - 2}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Match: {match.match_date ? new Date(match.match_date).toLocaleDateString() : "Fecha desconocida"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
