"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockProfiles } from "@/data/mock-profiles"

type Profile = {
  id: string
  name: string
  age: number
  location: string
  bio: string
  sports: string[]
  distance: number
  profilePicture: string
}

type Match = {
  id: string
  profile: Profile
  timestamp: string
  hasChat: boolean
}

type AppContextType = {
  viewedProfiles: string[]
  likedProfiles: string[]
  dislikedProfiles: string[]
  matches: Match[]
  currentUser: Profile
  addViewedProfile: (profileId: string) => void
  addLikedProfile: (profileId: string) => void
  addDislikedProfile: (profileId: string) => void
  addMatch: (profile: Profile) => void
  getAvailableProfiles: () => Profile[]
  getMatches: () => Match[]
  resetViewedProfiles: () => void
}

const defaultContext: AppContextType = {
  viewedProfiles: [],
  likedProfiles: [],
  dislikedProfiles: [],
  matches: [],
  currentUser: {
    id: "current-user",
    name: "Tomás Fernández",
    age: 26,
    location: "Belgrano, CABA",
    bio: "Estudiante de educación física. Me gusta entrenar en el gimnasio y jugar al tenis. Busco compañeros para actividades al aire libre y para mejorar mi técnica en deportes de raqueta.",
    sports: ["Tenis", "Gimnasio", "Natación", "Pádel"],
    distance: 0,
    profilePicture: "/images/profile2.png",
  },
  addViewedProfile: () => {},
  addLikedProfile: () => {},
  addDislikedProfile: () => {},
  addMatch: () => {},
  getAvailableProfiles: () => [],
  getMatches: () => [],
  resetViewedProfiles: () => {},
}

const AppContext = createContext<AppContextType>(defaultContext)

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [isNewSession, setIsNewSession] = useState(true)
  const currentUser = defaultContext.currentUser

  // Cargar datos guardados del localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Solo cargamos los matches de localStorage, no los perfiles vistos
      // Esto permite que los perfiles se "reinicien" en cada sesión
      const savedMatches = localStorage.getItem("matches")

      if (savedMatches) setMatches(JSON.parse(savedMatches))

      // Verificamos si es una nueva sesión
      const lastSessionDate = localStorage.getItem("lastSessionDate")
      const currentDate = new Date().toDateString()

      if (lastSessionDate !== currentDate) {
        // Es una nueva sesión, reiniciamos los perfiles vistos
        setViewedProfiles([])
        setLikedProfiles([])
        setDislikedProfiles([])
        localStorage.setItem("lastSessionDate", currentDate)
        setIsNewSession(true)
      } else {
        setIsNewSession(false)
        // Si no es una nueva sesión, cargamos los perfiles vistos para esta sesión
        const sessionViewedProfiles = sessionStorage.getItem("viewedProfiles")
        const sessionLikedProfiles = sessionStorage.getItem("likedProfiles")
        const sessionDislikedProfiles = sessionStorage.getItem("dislikedProfiles")

        if (sessionViewedProfiles) setViewedProfiles(JSON.parse(sessionViewedProfiles))
        if (sessionLikedProfiles) setLikedProfiles(JSON.parse(sessionLikedProfiles))
        if (sessionDislikedProfiles) setDislikedProfiles(JSON.parse(sessionDislikedProfiles))
      }
    }
  }, [])

  // Guardar datos en sessionStorage cuando cambian (solo para la sesión actual)
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("viewedProfiles", JSON.stringify(viewedProfiles))
      sessionStorage.setItem("likedProfiles", JSON.stringify(likedProfiles))
      sessionStorage.setItem("dislikedProfiles", JSON.stringify(dislikedProfiles))

      // Los matches sí se guardan en localStorage para persistir entre sesiones
      localStorage.setItem("matches", JSON.stringify(matches))
    }
  }, [viewedProfiles, likedProfiles, dislikedProfiles, matches])

  const addViewedProfile = (profileId: string) => {
    if (!viewedProfiles.includes(profileId)) {
      setViewedProfiles([...viewedProfiles, profileId])
    }
  }

  const addLikedProfile = (profileId: string) => {
    if (!likedProfiles.includes(profileId)) {
      setLikedProfiles([...likedProfiles, profileId])
      addViewedProfile(profileId)
    }
  }

  const addDislikedProfile = (profileId: string) => {
    if (!dislikedProfiles.includes(profileId)) {
      setDislikedProfiles([...dislikedProfiles, profileId])
      addViewedProfile(profileId)
    }
  }

  const addMatch = (profile: Profile) => {
    // Verificar si ya existe un match con este perfil
    if (!matches.some((match) => match.id === profile.id)) {
      const newMatch: Match = {
        id: profile.id,
        profile,
        timestamp: new Date().toISOString(),
        hasChat: true,
      }
      setMatches([...matches, newMatch])
    }
    addLikedProfile(profile.id)
  }

  const getAvailableProfiles = () => {
    return mockProfiles.filter((profile) => !viewedProfiles.includes(profile.id))
  }

  const getMatches = () => {
    return matches
  }

  const resetViewedProfiles = () => {
    setViewedProfiles([])
    setLikedProfiles([])
    setDislikedProfiles([])
    sessionStorage.removeItem("viewedProfiles")
    sessionStorage.removeItem("likedProfiles")
    sessionStorage.removeItem("dislikedProfiles")
  }

  return (
    <AppContext.Provider
      value={{
        viewedProfiles,
        likedProfiles,
        dislikedProfiles,
        matches,
        currentUser,
        addViewedProfile,
        addLikedProfile,
        addDislikedProfile,
        addMatch,
        getAvailableProfiles,
        getMatches,
        resetViewedProfiles,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
