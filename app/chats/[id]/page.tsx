"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, MoreVertical, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "@/context/app-context"

export default function ChatPage({ params }: { params: { id: string } }) {
  const { matches } = useApp()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Encontrar el match correspondiente
  const match = matches.find((m) => m.id === params.id)

  // Si no hay match, usar datos simulados
  const chat = match
    ? {
        id: match.id,
        name: match.profile.name,
        avatar: match.profile.profile_picture,
        status: "En línea",
      }
    : {
        id: params.id,
        name: "Usuario",
        avatar: "/placeholder.svg",
        status: "En línea",
      }

  // Cargar mensajes iniciales
  useEffect(() => {
    // Simular mensajes iniciales
    const initialMessages = [
      {
        id: "1",
        senderId: "other",
        text: `Hola! Vi que también te gusta ${match?.profile.sports[0] || "el deporte"}`,
        timestamp: "10:30",
      },
      {
        id: "2",
        senderId: "me",
        text: `¡Hola! Sí, practico ${match?.profile.sports[0] || "deportes"} desde hace unos años. ¿Tú también?`,
        timestamp: "10:32",
      },
      {
        id: "3",
        senderId: "other",
        text: `Sí, estoy buscando compañeros para practicar en ${match?.profile.location || "Buenos Aires"}`,
        timestamp: "10:33",
      },
    ]

    setMessages(initialMessages)
  }, [match])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        senderId: "me",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMsg])
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <motion.header
        className="border-b p-4 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/chats">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
              <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{chat.name}</h2>
              <p className="text-xs text-muted-foreground">{chat.status}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Más opciones</span>
          </Button>
        </div>
      </motion.header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div
                className={`message-bubble ${message.senderId === "me" ? "sent" : "received"}`}
                whileHover={{ scale: 1.02 }}
              >
                <p>{message.text}</p>
                <span className="message-time">{message.timestamp}</span>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      <motion.footer
        className="border-t p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
              <span className="sr-only">Enviar</span>
            </Button>
          </motion.div>
        </form>
      </motion.footer>
    </div>
  )
}
