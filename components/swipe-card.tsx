"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, X, Check } from "lucide-react"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"

interface SwipeCardProps {
  profile: {
    id: string
    name: string
    age: number
    location: string
    bio: string
    sports: string[]
    distance: number
    profilePicture: string
  }
  isTop: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function SwipeCard({ profile, isTop, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)

  // Motion values para el deslizamiento
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const leftIndicatorOpacity = useTransform(x, [-100, -20, 0], [1, 0, 0])
  const rightIndicatorOpacity = useTransform(x, [0, 20, 100], [0, 0, 1])
  const controls = useAnimation()

  // Umbral para considerar un swipe completo (en píxeles)
  const swipeThreshold = 100

  const handleDragEnd = async (_, info: any) => {
    if (info.offset.x < -swipeThreshold) {
      setExitX(-500)
      await controls.start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.3 },
      })
      onSwipeLeft()
    } else if (info.offset.x > swipeThreshold) {
      setExitX(500)
      await controls.start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      })
      onSwipeRight()
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      })
    }
  }

  // Resetear la posición cuando cambia el perfil
  useEffect(() => {
    x.set(0)
    controls.set({ x: 0, opacity: 1 })
  }, [profile.id, controls, x])

  return (
    <motion.div
      className="swipe-card"
      style={{
        x,
        rotate,
        zIndex: isTop ? 10 : 0,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 1.02 }}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="relative h-full rounded-lg overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src={profile.profilePicture || "/placeholder.svg"}
            alt={profile.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Gradiente mejorado para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* Controles dentro de la tarjeta (estilo Tinder) */}
        <div className="swipe-controls">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="z-20">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-destructive bg-background/80 backdrop-blur-sm text-destructive"
              onClick={() => {
                setExitX(-500)
                controls
                  .start({
                    x: -500,
                    opacity: 0,
                    transition: { duration: 0.3 },
                  })
                  .then(() => onSwipeLeft())
              }}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">No me interesa</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="z-20">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full border-2 border-primary bg-background/80 backdrop-blur-sm text-primary"
              onClick={() => {
                setExitX(500)
                controls
                  .start({
                    x: 500,
                    opacity: 0,
                    transition: { duration: 0.3 },
                  })
                  .then(() => onSwipeRight())
              }}
            >
              <Check className="h-6 w-6" />
              <span className="sr-only">Me interesa</span>
            </Button>
          </motion.div>
        </div>

        {/* Contenido del perfil con mejor contraste */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-20 text-white z-10">
          <div className="mb-3">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              {profile.name}, {profile.age}
            </h2>
            <p className="flex items-center gap-1 text-white/90 drop-shadow-md">
              <MapPin className="h-4 w-4" />
              {profile.location} • a {profile.distance} km
            </p>
          </div>

          {/* Fondo semi-transparente para la bio para mejorar legibilidad */}
          <div className="bg-black/40 p-3 rounded-lg mb-4 backdrop-blur-sm">
            <p className="text-white">{profile.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.sports.map((sport) => (
              <Badge key={sport} variant="secondary" className="profile-badge">
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        {/* Indicadores de acción */}
        <motion.div className="swipe-action-indicator left" style={{ opacity: leftIndicatorOpacity }}>
          <X className="h-8 w-8" />
        </motion.div>
        <motion.div className="swipe-action-indicator right" style={{ opacity: rightIndicatorOpacity }}>
          <Check className="h-8 w-8" />
        </motion.div>
      </div>
    </motion.div>
  )
}
