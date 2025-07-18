"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCard } from "@/components/user-card"
import { API_ENDPOINTS } from "@/lib/config/api"
import { useAuth } from "@/context/auth-context"
import { useApp } from "@/context/app-context"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, X, RefreshCw, Users, Handshake, Trophy, MapPin, Clock, Sparkles, MessageCircle } from "lucide-react"
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
  const { user: currentAuthUser } = useAuth()
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
        console.log("❌ No hay token, redirigiendo al login")
        router.push("/login")
        return
      }

      console.log("🔄 Cargando usuarios compatibles...")
      console.log("📊 Filtros aplicados:", filters)

      // Construir parámetros de filtros
      const params = new URLSearchParams({
        min_age: filters.ageRange[0].toString(),
        max_age: filters.ageRange[1].toString(),
        distance: filters.distance.toString(),
      })

      // Agregar ubicación si está seleccionada
      if (filters.selectedBarrio && filters.selectedBarrio !== "Todos") {
        params.append("location", filters.selectedBarrio)
      }

      // Agregar deportes si están seleccionados
      if (filters.selectedSports.length > 0) {
        const sportsString = filters.selectedSports.map((s) => `${s.sport} (${s.level})`).join(", ")
        params.append("sports", sportsString)
      }

      const response = await fetch(`${API_ENDPOINTS.USER.COMPATIBLE}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        console.log("❌ Token expirado o inválido, redirigiendo al login")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
        router.push("/login")
        return
      }

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
    if (currentAuthUser) {
      fetchUsers()
    }
  }, [currentAuthUser])

  // Manejar like
  const handleLike = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      console.log("❤️ Dando like a usuario:", userId)
      const response = await fetch(API_ENDPOINTS.USER.LIKE(userId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        console.log("❌ Token expirado o inválido, redirigiendo al login")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
        router.push("/login")
        return
      }

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

        // Ocultar notificación después de 8 segundos
        setTimeout(() => {
          setIsMatch(false)
          setMatchUser(null)
        }, 8000)
      }

      // Avanzar al siguiente usuario
      setCurrentIndex((prev) => prev + 1)
    } catch (err) {
      console.error("❌ Error dando like:", err)
      alert("Error al dar like. Intenta de nuevo.")
    }
  }

  // Manejar dislike
  const handleDislike = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      console.log("❌ Dando dislike a usuario:", userId)
      const response = await fetch(API_ENDPOINTS.USER.DISLIKE(userId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.status === 401) {
        console.log("❌ Token expirado o inválido, redirigiendo al login")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      console.log("✅ Dislike registrado")

      // Avanzar al siguiente usuario
      setCurrentIndex((prev) => prev + 1)
    } catch (err) {
      console.error("❌ Error dando dislike:", err)
      alert("Error al rechazar usuario. Intenta de nuevo.")
    }
  }

  // Manejar swipe
  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      handleLike(users[currentIndex].id)
    } else {
      handleDislike(users[currentIndex].id)
    }
  }

  // Recargar usuarios
  const handleRefresh = () => {
    fetchUsers()
  }

  if (!currentAuthUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-lg font-medium">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
            <RefreshCw className="h-10 w-10 animate-spin text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Buscando deportistas</h2>
          <p className="text-lg text-gray-600">Encontrando tu match perfecto...</p>
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-gray-500">
            Filtros: {filters.selectedSports.length} deportes • {filters.distance}km
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 space-y-6 p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <X className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-red-800">Oops, algo salió mal</h2>
          <p className="text-red-600 max-w-sm">{error}</p>
        </div>
        <Button onClick={handleRefresh} className="bg-red-500 hover:bg-red-600">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 space-y-6 p-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Users className="h-10 w-10 text-blue-500" />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">No hay usuarios compatibles</h2>
          <p className="text-gray-600 max-w-sm">
            Intenta ajustar tus filtros o espera a que más personas se unan a SportMatch.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm">
            <Link href="/filters">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Modificar filtros
            </Link>
          </Button>
          <Button onClick={handleRefresh} className="bg-blue-500 hover:bg-blue-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Buscar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 space-y-6 p-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-green-500" />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-green-800">¡Has visto todos los perfiles!</h2>
          <p className="text-green-700 max-w-sm">Vuelve más tarde para ver nuevos deportistas o ajusta tus filtros.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild className="bg-white/80 backdrop-blur-sm">
            <Link href="/filters">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Modificar filtros
            </Link>
          </Button>
          <Button onClick={handleRefresh} className="bg-green-500 hover:bg-green-600">
            <RefreshCw className="mr-2 h-4 w-4" />
            Buscar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  const currentUser = users[currentIndex]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-32">
      <div className="container max-w-md py-6 space-y-6 pb-32">
        {/* Header mejorado */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Descubrir
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white/80"
            >
              <Link href="/filters">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="bg-white/60 backdrop-blur-sm border-white/40 hover:bg-white/80"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Estadísticas mejoradas */}
        <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 text-sm border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              Perfil {currentIndex + 1} de {users.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-semibold">{Math.round(currentUser.compatibility_score)}% match</span>
          </div>
        </div>

        {/* Card del usuario actual con animación mejorada */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="w-full"
          >
            <UserCard
              user={currentUser}
              onLike={handleLike}
              onDislike={handleDislike}
              onSwipe={(direction) => {
                if (direction === "right") setCurrentIndex((prev) => prev + 1)
                if (direction === "left") setCurrentIndex((prev) => prev + 1)
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Notificación de match completamente rediseñada */}
        <AnimatePresence>
          {isMatch && matchUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4"
            >
              {/* Partículas animadas de fondo */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                      y: [null, -100],
                      opacity: [0.3, 0, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className="relative bg-background rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-border overflow-hidden"
              >
                {/* Efectos de fondo del cartel */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl"></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10">
                  {/* Header con animación */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                    className="text-center mb-6"
                  >
                    {/* Confetti explosion */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: ["#3b82f6", "#8b5cf6", "#06b6d4", "#6366f1", "#4f46e5"][i % 5],
                            left: "50%",
                            top: "50%",
                          }}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            x: (Math.random() - 0.5) * 200,
                            y: (Math.random() - 0.5) * 200,
                            rotate: Math.random() * 360,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.3 + i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>

                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-2xl relative">
                      <Handshake className="w-12 h-12 text-white drop-shadow-lg" />

                      {/* Anillo pulsante */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-white/50"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl font-black text-white mb-2 drop-shadow-lg"
                      style={{
                        textShadow: "0 0 20px rgba(255,255,255,0.5)",
                      }}
                    >
                      ¡MATCH!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/90 text-sm font-semibold drop-shadow-md"
                    >
                      ¡Ambos quieren entrenar juntos! 🎉
                    </motion.p>
                  </motion.div>

                  {/* Perfiles con animación mejorada */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-8 mb-6"
                  >
                    {/* Usuario actual */}
                    <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                      <div className="relative w-20 h-20">
                        <motion.img
                          src={currentAuthUser?.foto_url || currentAuthUser?.profilePicture || "/placeholder-user.jpg"}
                          alt={currentAuthUser?.name || "Tu perfil"}
                          className="w-20 h-20 rounded-full object-cover border-4 border-border bg-background"
                          onError={(e) => {
                            if (!e.currentTarget.src.endsWith("/placeholder-user.jpg")) {
                              e.currentTarget.src = "/placeholder-user.jpg"
                            }
                          }}
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(255,255,255,0.5)",
                              "0 0 30px rgba(255,255,255,0.8)",
                              "0 0 20px rgba(255,255,255,0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 }}
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                        >
                          <Trophy className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                      <p className="text-sm font-bold text-white mt-3 text-center drop-shadow-md">
                        {currentAuthUser?.name || currentAuthUser?.username}
                      </p>
                      <p className="text-xs text-muted-foreground bg-secondary/60 backdrop-blur-sm px-3 py-1 rounded-full font-medium border border-border">
                        {currentAuthUser?.sports?.[0]?.level || "Deportista"}
                      </p>
                    </motion.div>

                    {/* Icono central súper animado */}
                    <motion.div className="flex flex-col items-center mx-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl relative">
                        <Handshake className="w-8 h-8 text-white drop-shadow-lg" />

                        {/* Apretones de manos flotantes */}
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3"
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                              y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                              ease: "easeInOut",
                            }}
                          >
                            <Handshake className="w-full h-full text-blue-300" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Usuario matched */}
                    <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }}>
                      <div className="relative w-20 h-20">
                        <motion.img
                          src={matchUser?.foto_url || "/placeholder-user.jpg"}
                          alt={matchUser?.name || "Match"}
                          className="w-20 h-20 rounded-full object-cover border-4 border-border bg-background"
                          onError={(e) => {
                            if (!e.currentTarget.src.endsWith("/placeholder-user.jpg")) {
                              e.currentTarget.src = "/placeholder-user.jpg"
                            }
                          }}
                          animate={{
                            boxShadow: [
                              "0 0 20px rgba(255,255,255,0.5)",
                              "0 0 30px rgba(255,255,255,0.8)",
                              "0 0 20px rgba(255,255,255,0.5)",
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 }}
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                        >
                          <Trophy className="w-4 h-4 text-white" />
                        </motion.div>
                      </div>
                      <p className="text-sm font-bold text-white mt-3 text-center drop-shadow-md">{matchUser?.name}</p>
                      <p className="text-xs text-muted-foreground bg-secondary/60 backdrop-blur-sm px-3 py-1 rounded-full font-medium border border-border">
                        {Array.isArray(matchUser?.sports) ? matchUser.sports[0]?.level : "Deportista"}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Detalles del match */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-muted/60 rounded-lg p-4 mb-4 border border-border"
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-white" />
                      <span className="text-sm text-foreground font-semibold drop-shadow-md">{matchUser?.location}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                        <Clock className="w-3 h-3" />
                        <span>Disponible fines de semana</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Botones de acción mejorados */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-3"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-2xl border-2 border-border backdrop-blur-sm"
                        onClick={() => {
                          setIsMatch(false)
                          setMatchUser(null)
                          sessionStorage.setItem("refreshMatches", "true")
                          router.push("/chats")
                        }}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Enviar mensaje a {matchUser?.name}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-muted/40 bg-transparent"
                        onClick={() => {
                          setIsMatch(false)
                          setMatchUser(null)
                        }}
                      >
                        Seguir buscando
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Botón de cierre mejorado */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg border border-white/30"
                    onClick={() => {
                      setIsMatch(false)
                      setMatchUser(null)
                    }}
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation />
    </div>
  )
}

