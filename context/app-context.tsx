"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockProfiles } from "@/data/mock-profiles"

// Definir tipos
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
  user1Id: string
  user2Id: string
  timestamp: string
  otherUser?: Profile
}

interface Message {
  id: string
  matchId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

interface AppContextType {
  currentUser: Profile | null
  availableProfiles: Profile[]
  matches: Match[]
  likedProfiles: string[]
  dislikedProfiles: string[]
  loading: boolean
  getAvailableProfiles: () => Promise<void>
  getMatches: () => Promise<void>
  getMessages: (matchId: string) => Promise<Message[]>
  sendMessage: (matchId: string, content: string) => Promise<void>
  markMessagesAsRead: (matchId: string) => Promise<void>
  addLikedProfile: (profileId: string) => Promise<boolean>
  addDislikedProfile: (profileId: string) => void
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Inicializar con un usuario actual simulado
  useEffect(() => {
    const mockCurrentUser: Profile = {
      id: "current-user",
      name: "Tu Nombre",
      age: 25,
      location: "Tu Ubicación",
      bio: "Tu biografía aquí. Describe tus intereses deportivos y lo que buscas.",
      sports: ["Fútbol", "Running", "Tenis"],
      distance: 0,
      profilePicture: "/images/profile1.png",
    }
    setCurrentUser(mockCurrentUser)
    getAvailableProfiles()
    getMatches()
    setLoading(false)
  }, [])

  const getAvailableProfiles = async () => {
    try {
      // Filtrar perfiles ya likeados o dislikeados
      const filteredProfiles = mockProfiles.filter(
        (profile) => !likedProfiles.includes(profile.id) && !dislikedProfiles.includes(profile.id),
      )
      setAvailableProfiles(filteredProfiles)
    } catch (error) {
      console.error("Error fetching profiles:", error)
    }
  }

  const getMatches = async () => {
    try {
      const response = await fetch(`/api/matches?userId=current-user`)
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error("Error fetching matches:", error)
    }
  }

  const getMessages = async (matchId: string): Promise<Message[]> => {
    try {
      const response = await fetch(`/api/messages?matchId=${matchId}`)
      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error("Error fetching messages:", error)
      return []
    }
  }

  const sendMessage = async (matchId: string, content: string) => {
    if (!currentUser) return

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchId,
          senderId: currentUser.id,
          receiverId: matches.find((m) => m.id === matchId)?.otherUser?.id || "",
          content,
        }),
      })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const markMessagesAsRead = async (matchId: string) => {
    if (!currentUser) return

    try {
      await fetch(`/api/messages/read?matchId=${matchId}&userId=${currentUser.id}`, {
        method: "PATCH",
      })
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const addLikedProfile = async (profileId: string): Promise<boolean> => {
    setLikedProfiles((prev) => [...prev, profileId])

    // Simular un match con una probabilidad del 70%
    const isMatch = Math.random() < 0.7

    if (isMatch) {
      // Crear un nuevo match
      try {
        const response = await fetch("/api/matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user1Id: "current-user",
            user2Id: profileId,
          }),
        })

        if (response.ok) {
          await getMatches()
        }
      } catch (error) {
        console.error("Error creating match:", error)
      }
    }

    // Actualizar perfiles disponibles
    await getAvailableProfiles()

    return isMatch
  }

  const addDislikedProfile = async (profileId: string) => {
    setDislikedProfiles((prev) => [...prev, profileId])
    await getAvailableProfiles()
  }

  const updateProfile = async (profile: Partial<Profile>) => {
    if (!currentUser) return

    try {
      const updatedProfile = { ...currentUser, ...profile }
      setCurrentUser(updatedProfile)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const value = {
    currentUser,
    availableProfiles,
    matches,
    likedProfiles,
    dislikedProfiles,
    loading,
    getAvailableProfiles,
    getMatches,
    getMessages,
    sendMessage,
    markMessagesAsRead,
    addLikedProfile,
    addDislikedProfile,
    updateProfile,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
