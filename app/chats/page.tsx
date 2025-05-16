"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatPreview } from "@/components/chat-preview"
import { ArrowLeft, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useAppContext } from "@/context/app-context"
import { useState, useEffect } from "react"

export default function ChatsPage() {
  const { matches } = useAppContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMatches, setFilteredMatches] = useState(matches)

  // Filtrar matches cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = matches.filter((match) => match.profile.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredMatches(filtered)
  }, [searchTerm, matches])

  // Convertir matches a formato de chat
  const chats = filteredMatches.map((match) => ({
    id: match.id,
    name: match.profile.name,
    lastMessage: "Hola! ¿Te gustaría practicar deportes juntos?",
    timestamp: new Date(match.timestamp).toLocaleDateString(),
    unread: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0, // Simular mensajes no leídos
    avatar: match.profile.profilePicture,
  }))

  return (
    <div className="container max-w-md py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/menu">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <motion.h1
          className="text-xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Mensajes
        </motion.h1>
        <div className="w-10" />
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar conversaciones"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <div className="space-y-2">
        {chats.length > 0 ? (
          chats.map((chat, index) => <ChatPreview key={chat.id} chat={chat} index={index} />)
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-2">No tienes mensajes</h2>
            <p className="text-muted-foreground mb-4">
              Cuando hagas match con alguien, podrás iniciar una conversación aquí.
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
  )
}
