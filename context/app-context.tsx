"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

const mockProfiles = [
  {
    id: "1",
    name: "Mauro Brero",
    age: 28,
    location: "Palermo, CABA",
    description: "Fanático del fútbol y jugador de Boca Juniors amateur. Busco compañeros para jugar los fines de semana.",
    sports: ["Fútbol", "Running", "Tenis"],
    distance: 2.5,
    profile_picture: "/images/profile1.png",
  },
  {
    id: "2",
    name: "Damian Dalla Vía",
    age: 26,
    location: "Belgrano, CABA",
    description: "Estudiante de educación física. Me gusta entrenar en el gimnasio y jugar al tenis.",
    sports: ["Tenis", "Gimnasio", "Natación"],
    distance: 3.8,
    profile_picture: "/images/profile2.png",
  },
  {
    id: "3",
    name: "Elias Ojeda",
    age: 25,
    location: "Recoleta, CABA",
    description: "Apasionado del básquet y el running. Entreno 4 veces por semana.",
    sports: ["Básquet", "Running", "Ciclismo"],
    distance: 1.7,
    profile_picture: "/images/profile3.png",
  },
  {
    id: "4",
    name: "Tomas Brusco",
    age: 20,
    location: "Villa Crespo, CABA",
    description: "Yoga instructor y amante del running. Busco compañeros para entrenar juntas.",
    sports: ["Yoga", "Running", "Pilates"],
    distance: 1.7,
    profile_picture: "/images/profile4.jpeg",
  },
  {
    id: "5",
    name: "Sofia Martinez",
    age: 24,
    location: "Villa Crespo, CABA",
    description: "Yoga instructor y amante del running. Busco compañeras para entrenar juntas.",
    sports: ["Yoga", "Running", "Pilates"],
    distance: 4.2,
    profile_picture: "/images/profile5.jpeg",
  },
]

export interface Profile {
  id: string
  name: string
  age: number
  location: string
  description: string
  sports: string[]
  distance: number
  profile_picture: string
}

interface Match {
  id: string
  profile: Profile
  timestamp: string
}

interface Filters {
  sports: string[]
  distance: number
  ageRange: [number, number]
}

interface AppContextType {
  availableProfiles: Profile[]
  likedProfiles: string[]
  dislikedProfiles: string[]
  matches: Match[]
  currentUser: Profile
  filters: Filters
  setFilters: (filters: Filters) => void
  addLikedProfile: (profileId: string) => Promise<boolean>
  addDislikedProfile: (profileId: string) => void
  resetProfiles: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [filters, setFilters] = useState<Filters>({ sports: [], distance: 50, ageRange: [18, 65] })

  const currentUser: Profile = {
    id: "current-user",
    name: "Tomás",
    age: 28,
    location: "Palermo, Buenos Aires",
    description: "Apasionado del deporte y la vida al aire libre. Busco compañeros para practicar tenis y running regularmente.",
    sports: ["Tenis", "Running", "Natación", "Yoga"],
    distance: 0,
    profile_picture: "/images/profile1.png",
  }

  useEffect(() => {
    const filtered = mockProfiles.filter(
        (profile) =>
            !likedProfiles.includes(profile.id) &&
            !dislikedProfiles.includes(profile.id) &&
            (filters.sports.length === 0 || profile.sports.some((s) => filters.sports.includes(s))) &&
            profile.distance <= filters.distance &&
            profile.age >= filters.ageRange[0] &&
            profile.age <= filters.ageRange[1]
    )
    setAvailableProfiles(filtered)
  }, [likedProfiles, dislikedProfiles, filters])

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles))
      localStorage.setItem("dislikedProfiles", JSON.stringify(dislikedProfiles))
      localStorage.setItem("matches", JSON.stringify(matches))
    }
  }, [likedProfiles, dislikedProfiles, matches])

  const addLikedProfile = useCallback(async (profileId: string): Promise<boolean> => {
    setLikedProfiles((prev) => [...prev, profileId])

    const isMatch = Math.random() < 0.7

    if (isMatch) {
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
    filters,
    setFilters,
    addLikedProfile,
    addDislikedProfile,
    resetProfiles,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp debe ser usado dentro de un AppProvider")
  }
  return context
}

export const useAppContext = useApp
