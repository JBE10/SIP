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
      <Card className="overflow-hidden shadow-lg p-4 flex flex-col items-center">
        {/* Video como fondo principal y foto de perfil arriba a la izquierda */}
        <div className="w-full mb-4">
          <div className="w-full aspect-[9/16] bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
            {/* Video */}
            {user.video_url && user.video_url.includes('http') ? (
              <video
                ref={videoRef}
                src={user.video_url}
                className="w-full h-full object-cover"
                muted={isVideoMuted}
                loop
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
                style={{
                  backgroundImage: 'url(https://via.placeholder.com/400x600/3b82f6/ffffff?text=No+video)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/80 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-6" />
                    <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="text-lg font-semibold text-white drop-shadow mb-1">No tiene video</div>
                </div>
              </div>
            )}
            {/* Foto de perfil overlay */}
            <img
              src={user.foto_url && user.foto_url.includes('http')
                ? user.foto_url
                : "https://via.placeholder.com/64x64/cccccc/666666?text=?"}
              alt={`${user.name}`}
              className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-white shadow-lg object-cover bg-white z-20"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/64x64/cccccc/666666?text=?"
                e.currentTarget.style.backgroundColor = "#f3f4f6"
                e.currentTarget.style.border = "2px solid #e5e7eb"
              }}
            />
            {/* Controles de video */}
            {user.video_url && user.video_url.includes('http') && (
              <div className="absolute top-2 right-2 flex gap-2 z-10">
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
        </div>

        {/* Nombre, edad y ubicación */}
        <div className="w-full text-center mb-2">
          <h2 className="text-2xl font-bold mb-1">
            {user.name}, {user.age}
          </h2>
          <p className="text-muted-foreground mb-2">
            📍 {user.location}
          </p>
        </div>

        {/* Deportes y nivel */}
        <div className="w-full flex flex-wrap justify-center gap-2 mb-2">
          {sports.map((sport: any, idx: number) => (
            <span
              key={sport.sport || idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
            >
              {sport.sport} ({sport.level})
            </span>
          ))}
        </div>

        {/* Descripción */}
        {user.bio && (
          <div className="w-full text-center mt-2">
            <p className="text-sm text-gray-600 mb-3">
              {user.bio}
            </p>
          </div>
        )}

        {/* Deportes en común */}
        {user.common_sports.length > 0 && (
          <div className="mb-2 w-full text-center">
            <h3 className="text-xs font-semibold text-green-600 mb-1">
              🏆 Deportes en común:
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
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

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mt-4">
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
      </Card>
    </motion.div>
  )
} 