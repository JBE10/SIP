"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react"
import { useRouter, usePathname } from "next/navigation"

export type User = {
  id: number
  username: string
  name: string
  email: string
  age: number
  location: string
  bio: string
  sports: string[]
  profilePicture?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: {
    name: string
    email: string
    age: number
    location: string
    bio: string
    sports: string[]
    password: string
    confirm_password: string
  }) => Promise<boolean>
  handleAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      })
      return response.ok
    } catch (error) {
      console.error("Error al verificar token:", error)
      return false
    }
  }

  // ✅ Cargar usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    const initializeAuth = async () => {
      if (isLoggedIn && storedUser && token) {
        try {
          const isTokenValid = await checkToken(token)
          if (isTokenValid) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } else {
            // Token inválido, limpiar datos y redirigir al login
            localStorage.clear()
            setUser(null)
            router.push("/login")
          }
        } catch (err) {
          console.error("Error al inicializar autenticación:", err)
          localStorage.clear()
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [router])

  // ✅ Redirección automática segura
  useEffect(() => {
    if (isLoading) return

    const isAuthRoute = ["/login", "/register", "/forgot-password"].includes(pathname)
    const isPublicRoute = pathname === "/"

    if (!user && !isAuthRoute && !isPublicRoute) {
      router.push("/login")
    }

    if (user && (isAuthRoute || isPublicRoute)) {
      router.push("/swipe")
    }
  }, [user, isLoading, pathname])

  // ✅ Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
      })

      if (!response.ok) return false

      const { access_token } = await response.json()
      localStorage.setItem("token", access_token)

      const userResponse = await fetch("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json"
        }
      })

      if (!userResponse.ok) return false

      const user = await userResponse.json()
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("isLoggedIn", "true")

      return true
    } catch (err) {
      console.error("Error durante login:", err)
      return false
    }
  }

  // ✅ Register
  const register: AuthContextType["register"] = async (userData) => {
    try {
      const payload = {
        username: userData.email,
        name: userData.name,
        email: userData.email,
        age: userData.age,
        location: userData.location,
        bio: userData.bio,
        sports: userData.sports,
        password: userData.password,
        confirm_password: userData.confirm_password,
        profilePicture: "https://randomuser.me/api/portraits/lego/1.jpg"
      }

      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      return res.ok
    } catch (err) {
      console.error("Error durante registro:", err)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.clear()
    router.push("/login")
  }

  // Función para manejar errores de autenticación
  const handleAuthError = () => {
    console.log("Token expirado o inválido. Redirigiendo al login...")
    logout()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register,
      handleAuthError 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return context
}
