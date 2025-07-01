"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatPreview } from "@/components/chat-preview"
import { ThemeToggle } from "@/components/theme-toggle"
import { Search, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import Link from "next/link"
import { API_ENDPOINTS } from "@/lib/config/api"
import { useAuth } from "@/context/auth-context"

interface Match {
  id: number
  name: string
  age: number
  location: string
  bio: string
  foto_url: string
  video_url: string
  sports: { sport: string; level: string }[]
  match_date: string
}

export default function ChatsPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])

  // Cargar matches del backend
  const fetchMatches = async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("No hay token, redirigiendo al login")
        return
      }

      console.log("🔄 Cargando matches...")
      const response = await fetch(API_ENDPOINTS.matches, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("✅ Matches cargados:", data.matches?.length || 0)
      
      setMatches(data.matches || [])
    } catch (err) {
      console.error("❌ Error cargando matches:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMatches()
    }
  }, [user])

  // Filtrar matches cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = matches.filter((match) => 
      match.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredMatches(filtered)
  }, [searchTerm, matches])

  // Convertir matches a formato de chat
  const chats = filteredMatches.map((match) => ({
    id: match.id.toString(),
    name: match.name,
    lastMessage: "¡Es un match! 🎉 ¿Te gustaría practicar deportes juntos?",
    timestamp: new Date(match.match_date).toLocaleDateString(),
    unread: 0, // Por ahora sin mensajes no leídos
    avatar: match.foto_url || "/placeholder-user.jpg",
  }))

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-lg">Cargando matches...</p>
      </div>
    )
  }

  return (
    <>
      <div className="container max-w-md py-6 space-y-6 pb-32">
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Matches
          </motion.h1>
          <ThemeToggle />
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar matches"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        <div className="space-y-2">
          {(chats?.length ?? 0) > 0 ? (
            chats.map((chat, index) => <ChatPreview key={chat.id} chat={chat} index={index} />)
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">No tienes matches aún</h2>
              <p className="text-muted-foreground mb-4">
                Cuando hagas match con alguien, aparecerá aquí para que puedas chatear.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild>
                  <Link href="/swipe">Descubrir personas</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </>
  )
}
