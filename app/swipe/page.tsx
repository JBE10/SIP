"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, RefreshCw, X } from "lucide-react"
import { MatchModal } from "@/components/match-modal"
import { SwipeCard } from "@/components/swipe-card"
import { motion, AnimatePresence } from "framer-motion"
import { useAppContext } from "@/context/app-context"

export default function SwipePage() {
  const { getAvailableProfiles, addLikedProfile, addDislikedProfile, addMatch, resetViewedProfiles } = useAppContext()

  const [availableProfiles, setAvailableProfiles] = useState(getAvailableProfiles())
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<any>(null)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  // Actualizar perfiles disponibles cuando cambia el contexto
  useEffect(() => {
    setAvailableProfiles(getAvailableProfiles())
  }, [getAvailableProfiles])

  const currentProfile = availableProfiles[currentProfileIndex]
  const isLastProfile = !currentProfile || currentProfileIndex === availableProfiles.length - 1

  const handleLike = () => {
    if (!currentProfile) return

    // Simular un match con 50% de probabilidad
    const isMatch = Math.random() > 0.5

    if (isMatch) {
      setMatchedProfile(currentProfile)
      addMatch(currentProfile)
      setShowMatchModal(true)
    } else {
      addLikedProfile(currentProfile.id)
      nextProfile("right")
    }
  }

  const handleDislike = () => {
    if (!currentProfile) return
    addDislikedProfile(currentProfile.id)
    nextProfile("left")
  }

  const nextProfile = (dir: "left" | "right") => {
    if (!isLastProfile) {
      setDirection(dir)
      // Pequeño retraso para permitir que la animación termine
      setTimeout(() => {
        setCurrentProfileIndex(currentProfileIndex + 1)
        setDirection(null)
      }, 300)
    }
  }

  const handleReset = () => {
    resetViewedProfiles()
    setAvailableProfiles(getAvailableProfiles())
    setCurrentProfileIndex(0)
  }

  return (
    <div className="container max-w-md py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/menu">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <motion.h1
          className="text-xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Descubrir
        </motion.h1>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/filters">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="sr-only">Filtros</span>
          </Link>
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isLastProfile || availableProfiles.length === 0 ? (
          <motion.div
            key="no-more-profiles"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden h-[70vh] flex items-center justify-center">
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-2">No hay más perfiles</h2>
                <p className="text-muted-foreground mb-4">
                  Has visto todos los perfiles disponibles. Puedes reiniciar para ver todos los perfiles nuevamente.
                </p>
                <div className="flex flex-col gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={handleReset} className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reiniciar perfiles
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="outline">
                      <Link href="/filters">Ajustar filtros</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={`swipe-container-${currentProfileIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="swipe-card-container"
          >
            <AnimatePresence>
              {availableProfiles.slice(currentProfileIndex, currentProfileIndex + 3).map((profile, index) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  isTop={index === 0}
                  onSwipeLeft={handleDislike}
                  onSwipeRight={handleLike}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-destructive text-destructive"
            onClick={handleDislike}
            disabled={isLastProfile || availableProfiles.length === 0}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">No me interesa</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-primary text-primary"
            onClick={handleLike}
            disabled={isLastProfile || availableProfiles.length === 0}
          >
            <Check className="h-6 w-6" />
            <span className="sr-only">Me interesa</span>
          </Button>
        </motion.div>
      </motion.div>

      <MatchModal isOpen={showMatchModal} onClose={() => setShowMatchModal(false)} matchedProfile={matchedProfile} />
    </div>
  )
}
