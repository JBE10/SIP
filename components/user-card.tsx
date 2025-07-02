"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion, PanInfo } from "framer-motion"

interface UserCardProps {
  user: {
    id: number
    name: string
    age: number
    location: string
    bio: string
    foto_url: string
    video_url: string
    sports: string | { sport: string; level: string }[]
    compatibility_score: number
    common_sports: string[]
  }
  onLike: (userId: number) => void
  onDislike: (userId: number) => void
  onSwipe: (direction: 'left' | 'right') => void
}

export function UserCard({ user, onLike, onDislike, onSwipe }: UserCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted
      setIsVideoMuted(!isVideoMuted)
    }
  }

  const handleLike = () => {
    onLike(user.id)
    onSwipe('right')
  }

  const handleDislike = () => {
    onDislike(user.id)
    onSwipe('left')
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      handleLike()
    } else if (info.offset.x < -threshold) {
      handleDislike()
    }
  }

  const sports = Array.isArray(user.sports) ? user.sports : (user.sports ? JSON.parse(user.sports) : [])

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="overflow-hidden shadow-lg">
        <div className="relative">
          {/* Video de fondo o imagen por defecto */}
          <div className="relative w-full h-96 bg-black">
            {user.video_url ? (
              <video
                ref={videoRef}
                src={user.video_url}
                className="w-full h-full object-cover"
                muted={isVideoMuted}
                loop
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onError={(e) => {
                  console.log("❌ Error cargando video:", e)
                  console.log("🔗 URL del video:", user.video_url)
                  // Ocultar el video si falla y mostrar fondo por defecto
                  e.currentTarget.style.display = 'none'
                  const container = e.currentTarget.parentElement
                  if (container) {
                    container.style.backgroundImage = 'url(https://via.placeholder.com/400x600/3b82f6/ffffff?text=Sin+Video)'
                    container.style.backgroundSize = 'cover'
                    container.style.backgroundPosition = 'center'
                  }
                }}
              />
            ) : (
              // Imagen de fondo por defecto cuando no hay video
              <div 
                className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                style={{
                  backgroundImage: 'url(https://via.placeholder.com/400x600/3b82f6/ffffff?text=Sin+Video)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🏃‍♂️</div>
                  <div className="text-sm opacity-80">Sin video</div>
                </div>
              </div>
            )}
            
            {/* Controles de video (solo si hay video) */}
            {user.video_url && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleMuteToggle}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleVideoToggle}
                  className="bg-black/50 text-white hover:bg-black/70"
                >
                  {isVideoPlaying ? <Pause size={16} /> : <Play size={16} />}
                </Button>
              </div>
            )}
          </div>

          {/* Foto de perfil superpuesta */}
          <div className="absolute top-4 left-4">
            <img
              src={user.foto_url || "https://via.placeholder.com/64x64/cccccc/666666?text=?"}
              alt={`${user.name}`}
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              onLoad={(e) => {
                console.log("✅ Imagen cargada exitosamente:", user.foto_url)
              }}
              onError={(e) => {
                console.log("❌ Error cargando imagen:", e)
                console.log("🔗 URL de la imagen:", user.foto_url)
                console.log("👤 Usuario:", user.name)
                // Fallback a imagen por defecto
                e.currentTarget.src = "https://via.placeholder.com/64x64/cccccc/666666?text=?"
                // También agregar un estilo de fallback visual
                e.currentTarget.style.backgroundColor = "#f3f4f6"
                e.currentTarget.style.border = "2px solid #e5e7eb"
              }}
            />
          </div>
          
          {/* Score de compatibilidad */}
          <div className="absolute top-4 left-24 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            {user.compatibility_score}% match
          </div>
        </div>

        <CardContent className="p-6">
          {/* Información del usuario */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-1">
              {user.name}, {user.age}
            </h2>
            <p className="text-muted-foreground mb-2">
              📍 {user.location}
            </p>
            {user.bio && (
              <p className="text-sm text-gray-600 mb-3">
                {user.bio}
              </p>
            )}
          </div>

          {/* Deportes en común */}
          {user.common_sports.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-green-600 mb-2">
                🏆 Deportes en común:
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.common_sports.map((sport, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deportes del usuario */}
          {sports.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">🏃‍♂️ Deportes:</h3>
              <div className="flex flex-wrap gap-2">
                {sports.map((sport: any, index: number) => {
                  const sportName = typeof sport === 'string' ? sport : sport.sport
                  const level = typeof sport === 'object' ? sport.level : 'Principiante'
                  return (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {sportName} ({level})
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={handleDislike}
              className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              <X size={24} />
            </Button>
            
            <Button
              size="lg"
              onClick={handleLike}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white"
            >
              <Heart size={24} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 