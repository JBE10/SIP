"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { mockProfiles } from "@/data/mock-profiles"

// Tipos
export interface Profile {
  id: string
  name: string
  age: number
  location: string
  bio: string
  sports: string[]
  distance: number
  profilePicture: string
}

interface Match {
  id: string
  profile: Profile
  timestamp: string
}

interface AppContextType {
  availableProfiles: Profile[]
  likedProfiles: string[]
  dislikedProfiles: string[]
  matches: Match[]
  currentUser: Profile
  addLikedProfile: (profileId: string) => Promise<boolean>
  addDislikedProfile: (profileId: string) => void
  resetProfiles: () => void
}

// Crear el contexto
const AppContext = createContext<AppContextType | undefined>(undefined)

// Proveedor del contexto
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<Match[]>([])

  const currentUser: Profile = {
    id: "current-user",
    name: "Tomás",
    age: 28,
    location: "Palermo, Buenos Aires",
    bio: "Apasionado del deporte y la vida al aire libre. Busco compañeros para practicar tenis y running regularmente.",
    sports: ["Tenis", "Running", "Natación", "Yoga"],
    distance: 0,
    profilePicture: "/images/profile1.png",
  }

  // Inicializar perfiles disponibles
  useEffect(() => {
    // Filtrar perfiles ya likeados o dislikeados
    const filtered = mockProfiles.filter(
        (profile) => !likedProfiles.includes(profile.id) && !dislikedProfiles.includes(profile.id),
    )
    setAvailableProfiles(filtered)
  }, [likedProfiles, dislikedProfiles])

  // Cargar datos guardados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLiked = localStorage.getItem("likedProfiles")
      const savedDisliked = localStorage.getItem("dislikedProfiles")
      const savedMatches = localStorage.getItem("matches")

      if (savedLiked) setLikedProfiles(JSON.parse(savedLiked))
      if (savedDisliked) setDislikedProfiles(JSON.parse(savedDisliked))
      if (savedMatches) setMatches(JSON.parse(savedMatches))
    }
  }, [])

  // Guardar datos cuando cambian
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles))
      localStorage.setItem("dislikedProfiles", JSON.stringify(dislikedProfiles))
      localStorage.setItem("matches", JSON.stringify(matches))
    }
  }, [likedProfiles, dislikedProfiles, matches])

  // Funciones memoizadas para evitar recreaciones
  const addLikedProfile = useCallback(async (profileId: string): Promise<boolean> => {
    setLikedProfiles((prev) => [...prev, profileId])

    // Simular un match con 70% de probabilidad
    const isMatch = Math.random() < 0.7

    if (isMatch) {
      // Encontrar el perfil completo
      const profile = mockProfiles.find((p) => p.id === profileId)
      if (profile) {
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          profile,
          timestamp: new Date().toISOString(),
        }
        setMatches((prev) => [...prev, newMatch])
      }
    }

    return isMatch
  }, [])

  const addDislikedProfile = useCallback((profileId: string) => {
    setDislikedProfiles((prev) => [...prev, profileId])
  }, [])

  const resetProfiles = useCallback(() => {
    setLikedProfiles([])
    setDislikedProfiles([])
    localStorage.removeItem("likedProfiles")
    localStorage.removeItem("dislikedProfiles")
  }, [])

  const value = {
    availableProfiles,
    likedProfiles,
    dislikedProfiles,
    matches,
    currentUser,
    addLikedProfile,
    addDislikedProfile,
    resetProfiles,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp debe ser usado dentro de un AppProvider")
  }
  return context
}
