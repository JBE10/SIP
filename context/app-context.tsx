"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Datos de prueba simplificados
const mockProfiles = [
  {
    id: "1",
    name: "Mauro Brero",
    age: 28,
    location: "Palermo",
    bio: "Fanático del fútbol y jugador de Boca Juniors amateur. Busco compañeros para jugar los fines de semana.",
    sports: [
      { sport: "Fútbol", level: "Avanzado" },
      { sport: "Running", level: "Intermedio" },
      { sport: "Tenis", level: "Principiante" }
    ],
    distance: 2.5,
    foto_url: "/images/profile2.png",
    video_url: "",
  },
  {
    id: "2",
    name: "Damian Dalla Vía",
    age: 26,
    location: "Belgrano",
    bio: "Estudiante de educación física. Me gusta entrenar en el gimnasio y jugar al tenis.",
    sports: [
      { sport: "Tenis", level: "Avanzado" },
      { sport: "Gimnasio", level: "Intermedio" },
      { sport: "Natación", level: "Principiante" }
    ],
    distance: 3.8,
    foto_url: "/images/profile3.png",
    video_url: "",
  },
  {
    id: "3",
    name: "Elias Ojeda",
    age: 25,
    location: "Recoleta",
    bio: "Apasionado del básquet y el running. Entreno 4 veces por semana.",
    sports: [
      { sport: "Básquet", level: "Avanzado" },
      { sport: "Running", level: "Intermedio" },
      { sport: "Ciclismo", level: "Principiante" }
    ],
    distance: 1.7,
    foto_url: "/images/profile4.png",
    video_url: "",
  },
  {
    id: "4",
    name: "Sofia Martinez",
    age: 24,
    location: "Villa Crespo",
    bio: "Yoga instructor y amante del running. Busco compañeras para entrenar juntas.",
    sports: [
      { sport: "Yoga", level: "Avanzado" },
      { sport: "Running", level: "Intermedio" },
      { sport: "Pilates", level: "Avanzado" }
    ],
    distance: 4.2,
    foto_url: "/images/profile5.jpeg",
    video_url: "",
  },
  {
    id: "5",
    name: "Carlos Rodriguez",
    age: 32,
    location: "Caballito",
    bio: "Jugador de pádel nivel intermedio. Busco compañeros para jugar regularmente.",
    sports: [
      { sport: "Pádel", level: "Intermedio" },
      { sport: "Tenis", level: "Principiante" },
      { sport: "Natación", level: "Intermedio" }
    ],
    distance: 6.1,
    foto_url: "/images/profile1.png",
    video_url: "",
  },
  {
    id: "6",
    name: "Ana Lopez",
    age: 29,
    location: "San Telmo",
    bio: "Amante del ciclismo urbano y el yoga. Busco compañeros para rutas por la ciudad.",
    sports: [
      { sport: "Ciclismo", level: "Avanzado" },
      { sport: "Yoga", level: "Intermedio" },
      { sport: "Running", level: "Principiante" }
    ],
    distance: 8.3,
    foto_url: "/images/profile2.png",
    video_url: "",
  },
  {
    id: "7",
    name: "Miguel Torres",
    age: 35,
    location: "Almagro",
    bio: "Entrenador personal especializado en funcional. Busco clientes y compañeros para entrenar.",
    sports: [
      { sport: "Funcional", level: "Avanzado" },
      { sport: "Crossfit", level: "Intermedio" },
      { sport: "Gimnasio", level: "Avanzado" }
    ],
    distance: 5.7,
    foto_url: "/images/profile3.png",
    video_url: "",
  },
  {
    id: "8",
    name: "Laura Fernandez",
    age: 22,
    location: "Núñez",
    bio: "Estudiante de deportes. Me gusta el básquet y el vóley. Busco equipo para jugar.",
    sports: [
      { sport: "Básquet", level: "Intermedio" },
      { sport: "Vóley", level: "Principiante" },
      { sport: "Running", level: "Intermedio" }
    ],
    distance: 7.2,
    foto_url: "/images/profile4.png",
    video_url: "",
  },
  {
    id: "9",
    name: "Roberto Silva",
    age: 40,
    location: "Villa Urquiza",
    bio: "Jugador de golf amateur. Busco compañeros para jugar los fines de semana.",
    sports: [
      { sport: "Golf", level: "Intermedio" },
      { sport: "Tenis", level: "Principiante" },
      { sport: "Natación", level: "Avanzado" }
    ],
    distance: 9.5,
    foto_url: "/images/profile5.jpeg",
    video_url: "",
  },
  {
    id: "10",
    name: "Carmen Vega",
    age: 27,
    location: "Colegiales",
    bio: "Instructora de pilates y amante del running. Busco compañeras para entrenar juntas.",
    sports: [
      { sport: "Pilates", level: "Avanzado" },
      { sport: "Running", level: "Intermedio" },
      { sport: "Yoga", level: "Intermedio" }
    ],
    distance: 3.9,
    foto_url: "/images/profile1.png",
    video_url: "",
  },
]

// Tipos
export interface Profile {
  id: string
  name: string
  age: number
  location: string
  bio: string
  sports: { sport: string; level: string }[]
  distance: number
  foto_url: string
  video_url: string
  instagram?: string
}

export interface Filters {
  distance: number
  ageRange: [number, number]
  selectedSports: { sport: string; level: string }[]
  selectedBarrio: string
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
  filters: Filters
  addLikedProfile: (profileId: string) => Promise<boolean>
  addDislikedProfile: (profileId: string) => void
  resetProfiles: () => void
  updateFilters: (newFilters: Filters) => void
  applyFilters: (profiles: Profile[]) => Profile[]
}

// Crear el contexto
const AppContext = createContext<AppContextType | undefined>(undefined)

// Proveedor del contexto
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [filters, setFilters] = useState<Filters>({
    distance: 10,
    ageRange: [18, 40],
    selectedSports: [],
    selectedBarrio: "Palermo"
  })

  const currentUser: Profile = {
    id: "current-user",
    name: "Tomás",
    age: 28,
    location: "Palermo",
    bio: "Apasionado del deporte y la vida al aire libre. Busco compañeros para practicar tenis y running regularmente.",
    sports: [
      { sport: "Tenis", level: "Avanzado" },
      { sport: "Running", level: "Intermedio" },
      { sport: "Natación", level: "Intermedio" },
      { sport: "Yoga", level: "Intermedio" }
    ],
    distance: 0,
    foto_url: "/images/profile1.png",
    video_url: "",
  }

  // Función para aplicar filtros
  const applyFilters = useCallback((profiles: Profile[]): Profile[] => {
    return profiles.filter(profile => {
      // Filtro por distancia
      if (profile.distance > filters.distance) return false;

      // Filtro por edad
      if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) return false;

      // Filtro por ubicación (barrio) - comparación exacta
      if (filters.selectedBarrio && profile.location !== filters.selectedBarrio) return false;

      // Filtro por deportes
      if (filters.selectedSports.length > 0) {
        const profileSports = profile.sports.map(s => s.sport.toLowerCase());
        const hasMatchingSport = filters.selectedSports.some(filterSport =>
          profileSports.includes(filterSport.sport.toLowerCase())
        );
        if (!hasMatchingSport) return false;
      }

      return true;
    });
  }, [filters]);

  // Función para actualizar filtros
  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
    // Guardar filtros en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("filters", JSON.stringify(newFilters))
    }
  }, [])

  // Inicializar perfiles disponibles con filtros aplicados
  useEffect(() => {
    // Filtrar perfiles ya likeados o dislikeados
    const filtered = mockProfiles.filter(
      (profile) => !likedProfiles.includes(profile.id) && !dislikedProfiles.includes(profile.id),
    )
    // Aplicar filtros adicionales
    const filteredWithFilters = applyFilters(filtered)
    setAvailableProfiles(filteredWithFilters)
  }, [likedProfiles, dislikedProfiles, filters, applyFilters])

  // Cargar datos guardados del localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLiked = localStorage.getItem("likedProfiles")
      const savedDisliked = localStorage.getItem("dislikedProfiles")
      const savedMatches = localStorage.getItem("matches")
      const savedFilters = localStorage.getItem("filters")

      if (savedLiked) setLikedProfiles(JSON.parse(savedLiked))
      if (savedDisliked) setDislikedProfiles(JSON.parse(savedDisliked))
      if (savedMatches) setMatches(JSON.parse(savedMatches))
      if (savedFilters) setFilters(JSON.parse(savedFilters))
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
          profile: {
            ...profile,
            foto_url: profile.foto_url,
            video_url: profile.video_url,
          },
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
    addLikedProfile,
    addDislikedProfile,
    resetProfiles,
    updateFilters,
    applyFilters,
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

// Para compatibilidad con código existente
export const useAppContext = useApp
