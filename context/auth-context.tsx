"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { API_ENDPOINTS, API_HEADERS } from "@/lib/config/api"

export type User = {
  id: number
  username: string
  name: string
  email: string
  age: number
  location: string
  bio: string
  sports: { sport: string; level: string }[]
  foto_url?: string
  video_url?: string
  profilePicture?: string
  deportes_preferidos?: string
  descripcion?: string
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
    sports: { sport: string; level: string }[]
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

  // Función para parsear deportes del backend
  const parseSports = (deportesString: string): { sport: string; level: string }[] => {
    if (!deportesString) return []
    
    try {
      // Si ya es un array, devolverlo tal cual
      if (Array.isArray(deportesString)) {
        return deportesString.map(sport => {
          if (typeof sport === "string") {
            // Intentar parsear "Deporte (Nivel)"
            const match = sport.match(/^(.+?)\s*\((.+?)\)$/)
            if (match) {
              return { sport: match[1].trim(), level: match[2].trim() }
            }
            return { sport: sport.trim(), level: "Principiante" }
          }
          return sport
        })
      }
      
      // Si es string, dividir por comas y parsear cada uno
      const sportsArray = deportesString.split(",").map(s => s.trim()).filter(s => s)
      return sportsArray.map(sport => {
        const match = sport.match(/^(.+?)\s*\((.+?)\)$/)
        if (match) {
          return { sport: match[1].trim(), level: match[2].trim() }
        }
        return { sport: sport.trim(), level: "Principiante" }
      })
    } catch (error) {
      console.error("Error parseando deportes:", error)
      return []
    }
  }

  // ✅ Cargar usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (isLoggedIn && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        // Asegurar que el usuario tiene el formato correcto
        const user = {
          ...parsedUser,
          name: parsedUser.name || parsedUser.username, // Mapear username a name si es necesario
          bio: parsedUser.bio || parsedUser.descripcion || "",
          sports: parseSports(parsedUser.deportes_preferidos || parsedUser.sports || ""),
          profilePicture: parsedUser.foto_url || parsedUser.profilePicture || "",
          video_url: parsedUser.video_url || ""
        }
        setUser(user)
      } catch (err) {
        localStorage.clear()
        setUser(null)
      }
    }

    setIsLoading(false)
  }, [])

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

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          ...API_HEADERS,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      })

      if (!response.ok) return false

      const { access_token } = await response.json()
      localStorage.setItem("token", access_token)

      const userResponse = await fetch(API_ENDPOINTS.USER.ME, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json"
        }
      })

      if (!userResponse.ok) return false

      const backendUser = await userResponse.json()
      
      // Mapear campos del backend al frontend
      const user = {
        ...backendUser,
        name: backendUser.username, // Mapear username a name
        bio: backendUser.descripcion || "",
        sports: parseSports(backendUser.deportes_preferidos || []),
        profilePicture: backendUser.foto_url || "",
        video_url: backendUser.video_url || ""
      }
      
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
        username: userData.name,
        email: userData.email,
        password: userData.password,
        deportes_preferidos: userData.sports.map((s: any) => `${s.sport} (${s.level})`).join(", "),
        descripcion: userData.bio,
        foto_url: "https://randomuser.me/api/portraits/lego/1.jpg",
        video_url: "",
        age: userData.age,
        location: userData.location,
        profilePicture: "https://randomuser.me/api/portraits/lego/1.jpg"
      }

      console.log("Enviando datos de registro:", payload)

      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify(payload)
      })

      console.log("Status de respuesta:", res.status)
      console.log("Headers de respuesta:", res.headers)

      let data;
      try {
        data = await res.json()
        console.log("Datos parseados:", data)
      } catch (parseError) {
        console.error("Error parseando JSON:", parseError)
        const text = await res.text()
        console.log("Respuesta como texto:", text)
        return false
      }

      if (res.ok) {
        console.log("Registro exitoso!")
        return true
      } else {
        console.error("Error en registro. Status:", res.status)
        console.error("Detalles del error:", data)
        return false
      }
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
      <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register, handleAuthError }}>
        {children}
      </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return context
} 