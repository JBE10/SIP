"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, Settings, LogOut } from "lucide-react"
import { MatchModal } from "@/components/match-modal"
import { SwipeCard } from "@/components/swipe-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "@/context/app-context"
import { ProfileDetails } from "@/components/profile-details"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/context/auth-context"
import type { Profile } from "@/context/app-context"

export default function SwipePage() {
  const { availableProfiles, addLikedProfile, addDislikedProfile, resetProfiles, filters } = useApp()
  const { logout, user } = useAuth()
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)

  const currentProfile = availableProfiles?.[currentProfileIndex]
  const isLastProfile = !currentProfile || currentProfileIndex === (availableProfiles?.length ?? 0) - 1

  // Debug: mostrar información de filtros
  useEffect(() => {
    console.log("=== FILTROS APLICADOS ===")
    console.log("Filtros actuales:", filters)
    console.log("Perfiles disponibles después de filtros:", availableProfiles?.length)
    console.log("Perfiles:", availableProfiles)
    console.log("=== FIN FILTROS ===")
  }, [filters, availableProfiles])

  const handleLike = async () => {
    if (!currentProfile) return

    // Simular un match con 50% de probabilidad
    const isMatch = Math.random() > 0.5

    if (isMatch) {
      setMatchedProfile(currentProfile)
      setShowMatchModal(true)
      // No avanzamos al siguiente perfil automáticamente cuando hay match
      // Solo avanzaremos cuando el usuario cierre el modal
    } else {
      addLikedProfile(currentProfile.id)
      nextProfile()
    }
  }

  const handleDislike = () => {
    if (!currentProfile) return
    addDislikedProfile(currentProfile.id)
    nextProfile()
  }

  const nextProfile = () => {
    if (!isLastProfile) {
      setTimeout(() => {
        setCurrentProfileIndex(currentProfileIndex + 1)
      }, 300)
    }
  }

  const handleMatchModalClose = () => {
    setShowMatchModal(false)
    // Solo después de cerrar el modal, avanzamos al siguiente perfil
    // y añadimos el perfil a los likes
    if (matchedProfile) {
      addLikedProfile(matchedProfile.id)
      nextProfile()
    }
  }

  const handleReset = () => {
    resetProfiles()
    setCurrentProfileIndex(0)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-xl font-bold">Descubrir</h1>
          <p className="text-sm text-muted-foreground">Hola, {user?.name || "Usuario"}</p>
          <p className="text-xs text-muted-foreground">
            {availableProfiles?.length || 0} perfiles disponibles
            {filters.selectedSports.length > 0 && ` • ${filters.selectedSports.length} deporte(s) filtrado(s)`}
            {filters.selectedBarrio !== "Palermo" && ` • ${filters.selectedBarrio}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/filters">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Filtros</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container max-w-md py-6 space-y-6">
        <AnimatePresence mode="wait">
          {(availableProfiles?.length ?? 0) === 0 ? (
            <motion.div
              key="no-more-profiles"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-[60vh] flex items-center justify-center">
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
                {(availableProfiles || []).slice(currentProfileIndex, currentProfileIndex + 3).map((profile, index) => (
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

        {/* Detalle de perfil */}
        {currentProfile && !isLastProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4"
          >
            <ProfileDetails profile={currentProfile} />
          </motion.div>
        )}

        {/* Modal de match - Aseguramos que solo se renderice cuando matchedProfile existe */}
        {matchedProfile && (
          <MatchModal isOpen={showMatchModal} onClose={handleMatchModalClose} matchedProfile={matchedProfile} />
        )}
      </div>

      {/* Bottom Navigation - Siempre visible */}
      <BottomNavigation />
    </div>
  )
}
