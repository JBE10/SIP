"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserCard } from "@/components/user-card"
import { API_ENDPOINTS } from "@/lib/config/api"
import { useAuth } from "@/context/auth-context"
import { useApp } from "@/context/app-context"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, RefreshCw, Users } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"

interface CompatibleUser {
  id: number
  name: string
  age: number
  location: string
  bio: string
  foto_url: string
  video_url: string
  sports: string
  compatibility_score: number
  common_sports: string[]
}

export default function SwipePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { filters } = useApp()
  const [users, setUsers] = useState<CompatibleUser[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isMatch, setIsMatch] = useState(false)
  const [matchUser, setMatchUser] = useState<CompatibleUser | null>(null)

  // Cargar usuarios compatibles
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")
      
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      console.log("🔄 Cargando usuarios compatibles...")
      console.log("📊 Filtros aplicados:", filters)
      
      // Construir parámetros de filtros
      const params = new URLSearchParams({
        min_age: filters.ageRange[0].toString(),
        max_age: filters.ageRange[1].toString(),
        distance: filters.distance.toString()
      })
      
      // Agregar ubicación si está seleccionada
      if (filters.selectedBarrio && filters.selectedBarrio !== "Todos") {
        params.append("location", filters.selectedBarrio)
      }
      
      // Agregar deportes si están seleccionados
      if (filters.selectedSports.length > 0) {
        const sportsString = filters.selectedSports
          .map(s => `${s.sport} (${s.level})`)
          .join(", ")
        params.append("sports", sportsString)
      }
      
      const response = await fetch(`${API_ENDPOINTS.USER.COMPATIBLE}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Usuarios compatibles cargados:", data.users?.length || 0)
      
      setUsers(data.users || [])
      setCurrentIndex(0)
    } catch (err) {
      console.error("❌ Error cargando usuarios:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers()
    }
  }, [user])

  // Manejar like
  const handleLike = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      console.log("❤️ Dando like a usuario:", userId)
      const response = await fetch(API_ENDPOINTS.USER.LIKE(userId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ Like registrado:", data)

      // Si hay match, mostrar notificación
      if (data.is_match) {
        console.log("🎉 ¡ES UN MATCH!")
        setIsMatch(true)
        setMatchUser(users[currentIndex])
        
        // Ocultar notificación después de 3 segundos
        setTimeout(() => {
          setIsMatch(false)
          setMatchUser(null)
        }, 3000)
      }

      // Avanzar al siguiente usuario
      setCurrentIndex(prev => prev + 1)
    } catch (err) {
      console.error("❌ Error dando like:", err)
      alert("Error al dar like. Intenta de nuevo.")
    }
  }

  // Manejar dislike
  const handleDislike = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      console.log("❌ Dando dislike a usuario:", userId)
      const response = await fetch(API_ENDPOINTS.USER.DISLIKE(userId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      console.log("✅ Dislike registrado")
      
      // Avanzar al siguiente usuario
      setCurrentIndex(prev => prev + 1)
    } catch (err) {
      console.error("❌ Error dando dislike:", err)
      alert("Error al rechazar usuario. Intenta de nuevo.")
    }
  }

  // Manejar swipe
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      handleLike(users[currentIndex].id)
    } else {
      handleDislike(users[currentIndex].id)
    }
  }

  // Recargar usuarios
  const handleRefresh = () => {
    fetchUsers()
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirigiendo al login...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Buscando deportistas compatibles...</p>
        <p className="text-sm text-muted-foreground">
          Aplicando filtros: {filters.selectedSports.length} deportes, {filters.distance}km
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-red-500">Error: {error}</p>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Users className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No hay usuarios compatibles</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Intenta ajustar tus filtros o espera a que más personas se unan a SportMatch.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/filters">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Modificar filtros
            </Link>
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Buscar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Heart className="h-16 w-16 text-primary" />
        <h2 className="text-xl font-semibold">¡Has visto todos los perfiles!</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Vuelve más tarde para ver nuevos deportistas o ajusta tus filtros.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/filters">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Modificar filtros
            </Link>
          </Button>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Buscar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  const currentUser = users[currentIndex]

  return (
    <>
      <div className="container max-w-md py-6 space-y-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Swipe</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/filters">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Perfil {currentIndex + 1} de {users.length}</span>
          <span>{Math.round(currentUser.compatibility_score)}% match</span>
        </div>

        {/* Card del usuario actual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <UserCard
              user={currentUser}
              onLike={handleLike}
              onDislike={handleDislike}
              onSwipe={handleSwipe}
            />
          </motion.div>
        </AnimatePresence>

        {/* Notificación de match */}
        <AnimatePresence>
          {isMatch && matchUser && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Card className="bg-green-500 text-white border-green-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">¡Es un match! 🎉</h3>
                      <p className="text-sm">Ahora puedes chatear con {matchUser.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation />
    </>
  )
}
