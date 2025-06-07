"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/types/user"

type RegisterPayload = {
  name: string
  email: string
  password: string
  description: string
  sports: string
  location: string
  age: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: RegisterPayload) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const isAuthRoute = ["/login", "/register", "/forgot-password"].includes(pathname)
    if (!isLoading) {
      if (!user && !isAuthRoute && pathname !== "/") {
        router.push("/login")
      } else if (user && isAuthRoute) {
        router.push("/swipe")
      }
    }
  }, [user, isLoading, pathname, router])

  const fetchUserProfile = async (token: string) => {
    const res = await fetch("http://localhost:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error("No se pudo obtener el perfil del usuario")
    const userData = await res.json()
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("isLoggedIn", "true")
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username: email, password }),
      })

      if (!res.ok) {
        console.error("Login fallido:", await res.text())
        return false
      }

      const data = await res.json()
      localStorage.setItem("token", data.access_token)

      await fetchUserProfile(data.access_token)
      return true
    } catch (error) {
      console.error("Error al loguear:", error)
      return false
    }
  }

  const register = async (userData: RegisterPayload): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.name,
          email: userData.email,
          password: userData.password,
          description: userData.description,
          sports: userData.sports,
          profile_picture: "/images/profile1.png",
          location: userData.location,
          age: userData.age,
        }),
      })

      if (!res.ok) {
        console.error("Error en el registro:", await res.text())
        return false
      }

      const data = await res.json()
      localStorage.setItem("token", data.access_token)

      await fetchUserProfile(data.access_token)
      return true
    } catch (error) {
      console.error("Error al registrar:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("likedProfiles")
    localStorage.removeItem("dislikedProfiles")
    localStorage.removeItem("matches")
    router.push("/login")
  }

  return (
      <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
