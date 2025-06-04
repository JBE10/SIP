"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { mockAuth, mockUser } from "../src/data/mockUser"

interface AuthContextType {
  user: any
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Simular verificación de token al cargar
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      setUser(mockUser)
      setIsAuthenticated(true)
    }
  }, [])

  // Redirigir según el estado de autenticación
  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password"
      const isPublicRoute = pathname === "/"

      if (!user && !isAuthRoute && !isPublicRoute) {
        router.push("/login")
      } else if (user && isAuthRoute) {
        router.push("/swipe")
      }
    }
  }, [user, isAuthenticated, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      // Simular login exitoso
      setToken(mockAuth.token)
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("token", mockAuth.token)
      router.push("/swipe")
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      // Simular registro exitoso
      setToken(mockAuth.token)
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem("token", mockAuth.token)
      router.push("/swipe")
      return true
    } catch (error) {
      console.error("Error en registro:", error)
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("token")
    localStorage.removeItem("likedProfiles")
    localStorage.removeItem("dislikedProfiles")
    localStorage.removeItem("matches")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
