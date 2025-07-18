"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, MessageSquare, Phone, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/context/auth-context"
import { API_BASE_URL } from "@/lib/config/api"

interface Message {
  id: number
  content: string
  created_at: string
  is_read: boolean
  sender: {
    id: number
    username: string
    foto_url: string
  }
}

interface MatchUser {
  id: number
  username: string
  age: number
  location: string
  descripcion: string
  foto_url: string
  video_url: string
  deportes_preferidos: string
  instagram?: string
  whatsapp?: string
  phone?: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [matchUser, setMatchUser] = useState<MatchUser | null>(null)
  const [loading, setLoading] = useState(true)

  const matchId = params.id as string

  useEffect(() => {
    if (matchId) {
      loadMatchData()
      loadMessages()
    }
  }, [matchId])

  const loadMatchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matches/${user?.id}`)
      const data = await response.json()
      
      const match = data.matches.find((m: any) => m.match_id.toString() === matchId)
      if (match) {
        setMatchUser(match.user)
      }
    } catch (error) {
      console.error("Error cargando datos del match:", error)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages/${matchId}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Error cargando mensajes:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    try {
      const response = await fetch(`${API_BASE_URL}/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match_id: parseInt(matchId),
          sender_id: user.id,
          content: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage("")
        loadMessages() // Recargar mensajes
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <motion.header
        className="flex items-center gap-4 p-4 border-b bg-white shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={matchUser?.foto_url || "/placeholder-user.jpg"}
              alt={matchUser?.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg truncate">{matchUser?.username}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {matchUser?.age} años • {matchUser?.location}
            </p>
          </div>
        </div>

        {/* Botones de contacto rápido */}
        <div className="flex gap-2">
          {(matchUser?.whatsapp || matchUser?.phone) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const number = (matchUser?.whatsapp || matchUser?.phone || '').replace(/\D/g, '')
                window.open(`https://wa.me/${number}`, '_blank')
              }}
              className="text-green-600 hover:text-green-700"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
          {matchUser?.phone && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`tel:${matchUser.phone}`, '_blank')}
              className="text-blue-600 hover:text-blue-700"
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          {matchUser?.instagram && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(matchUser.instagram, '_blank')}
              className="text-pink-600 hover:text-pink-700"
            >
              <Instagram className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.header>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay mensajes aún</p>
            <p className="text-sm">¡Envía el primer mensaje para empezar a chatear!</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender.id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender.id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Input de mensaje */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
