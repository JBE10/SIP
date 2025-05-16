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
  fetchProfiles: () => Promise<void>
  fetchMatches: () => Promise<void>
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
  fetchProfiles: async () => {},
  fetchMatches: async () => {},
}

const AppContext = createContext<AppContextType>(defaultContext)

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewedProfiles, setViewedProfiles] = useState<string[]>([])
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [isNewSession, setIsNewSession] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const currentUser = defaultContext.currentUser

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // Fetch profiles from Python backend
  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profiles`)
      const data = await response.json()

      if (data.profiles) {
        // Transform MongoDB _id to id for frontend compatibility
        const transformedProfiles = data.profiles.map((profile: any) => ({
          id: profile._id,
          name: profile.name,
          age: profile.age,
          location: profile.location,
          bio: profile.bio,
          sports: profile.sports,
          distance: profile.distance,
          profilePicture: profile.profilePicture,
        }))

        setProfiles(transformedProfiles)
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      // Fallback to mock data if API fails
      setProfiles(mockProfiles)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch matches from Python backend
  const fetchMatches = async () => {
    try {
      const response = await fetch(`${API_URL}/api/matches?userId=${currentUser.id}`)
      const data = await response.json()

      if (data.matches) {
        // We need to fetch profile details for each match
        const matchesWithProfiles = await Promise.all(
          data.matches.map(async (match: any) => {
            const otherUserId = match.user1Id === currentUser.id ? match.user2Id : match.user1Id
            const profileResponse = await fetch(`${API_URL}/api/profiles/${otherUserId}`)
            const profileData = await profileResponse.json()

            return {
              id: match._id,
              profile: {
                id: profileData.profile._id,
                name: profileData.profile.name,
                age: profileData.profile.age,
                location: profileData.profile.location,
                bio: profileData.profile.bio,
                sports: profileData.profile.sports,
                distance: profileData.profile.distance,
                profilePicture: profileData.profile.profilePicture,
              },
              timestamp: match.timestamp,
              hasChat: match.hasChat,
            }
          }),
        )

        setMatches(matchesWithProfiles)
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
      // Keep existing matches if API fails
    }
  }

  // Load data on initial render
  useEffect(() => {
    fetchProfiles()

    if (typeof window !== "undefined") {
      // Load session data from localStorage
      const savedMatches = localStorage.getItem("matches")
      if (savedMatches) setMatches(JSON.parse(savedMatches))

      // Check if it's a new session
      const lastSessionDate = localStorage.getItem("lastSessionDate")
      const currentDate = new Date().toDateString()

      if (lastSessionDate !== currentDate) {
        // It's a new session, reset viewed profiles
        setViewedProfiles([])
        setLikedProfiles([])
        setDislikedProfiles([])
        localStorage.setItem("lastSessionDate", currentDate)
        setIsNewSession(true)
      } else {
        setIsNewSession(false)
        // If not a new session, load viewed profiles from sessionStorage
        const sessionViewedProfiles = sessionStorage.getItem("viewedProfiles")
        const sessionLikedProfiles = sessionStorage.getItem("likedProfiles")
        const sessionDislikedProfiles = sessionStorage.getItem("dislikedProfiles")

        if (sessionViewedProfiles) setViewedProfiles(JSON.parse(sessionViewedProfiles))
        if (sessionLikedProfiles) setLikedProfiles(JSON.parse(sessionLikedProfiles))
        if (sessionDislikedProfiles) setDislikedProfiles(JSON.parse(sessionDislikedProfiles))
      }

      // Fetch matches from Python backend
      fetchMatches()
    }
  }, [])

  // Save session data when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("viewedProfiles", JSON.stringify(viewedProfiles))
      sessionStorage.setItem("likedProfiles", JSON.stringify(likedProfiles))
      sessionStorage.setItem("dislikedProfiles", JSON.stringify(dislikedProfiles))
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

  const addMatch = async (profile: Profile) => {
    // Check if match already exists
    if (!matches.some((match) => match.id === profile.id)) {
      // Create match in Python backend
      try {
        const matchData = {
          user1Id: currentUser.id,
          user2Id: profile.id,
          timestamp: new Date(),
          hasChat: true,
        }

        const response = await fetch(`${API_URL}/api/matches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(matchData),
        })

        const data = await response.json()

        if (data.success) {
          const newMatch: Match = {
            id: data.match._id,
            profile,
            timestamp: data.match.timestamp,
            hasChat: data.match.hasChat,
          }

          setMatches([...matches, newMatch])
        }
      } catch (error) {
        console.error("Error creating match:", error)
        // Fallback to local state if API fails
        const newMatch: Match = {
          id: profile.id,
          profile,
          timestamp: new Date().toISOString(),
          hasChat: true,
        }
        setMatches([...matches, newMatch])
      }
    }
    addLikedProfile(profile.id)
  }

  const getAvailableProfiles = () => {
    return profiles.filter((profile) => !viewedProfiles.includes(profile.id))
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
        fetchProfiles,
        fetchMatches,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
