"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { mockLogin, mockRegister, type User } from "@/data/mockData"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Omit<User, 'id'>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

      if (isLoggedIn && storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("user")
          localStorage.removeItem("isLoggedIn")
        }
      }
    }
    setIsLoading(false)
  }, [])

  // Redirigir según el estado de autenticación
  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password"
      const isPublicRoute = pathname === "/"

      if (!user && !isAuthRoute && !isPublicRoute) {
        router.push("/login")
      } else if (user && isAuthRoute) {
        router.push("/swipe")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const mockUser = await mockLogin(email, password);
      if (mockUser) {
        setUser(mockUser);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  }

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const mockUser = await mockRegister(userData);
      setUser(mockUser);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Error during registration:", error);
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
