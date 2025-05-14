"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Send, Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import BottomNavigation from "@/components/bottom-navigation"

interface Message {
  id: number
  text: string
  sender: "user" | "partner"
  timestamp: string
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Vi que te gusta el tenis. Llevo jugando unos 2 años.",
      sender: "partner",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      text: "¡Hola! Sí, ¡me encanta el tenis! Estoy en un nivel intermedio. ¿Y tú?",
      sender: "user",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "Yo también diría que soy intermedio. ¿Te interesaría jugar algún día de esta semana?",
      sender: "partner",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      text: "¿Seguimos con el partido de tenis mañana?",
      sender: "partner",
      timestamp: "10:40 AM",
    },
  ])

  const partner = {
    id: params.id,
    name: "Alex Jiménez",
    avatar: "/placeholder.svg?height=100&width=100",
    sport: "Tenis",
    level: "Intermedio",
    lastActive: "Activo ahora",
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Simulate partner response after a short delay
    setTimeout(() => {
      const responseMsg: Message = {
        id: messages.length + 2,
        text: "¡Perfecto! Espero con ansias nuestro partido.",
        sender: "partner",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, responseMsg])
    }, 2000)
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center p-3 border-b bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6 text-slate-600" />
        </Button>

        <div className="flex items-center flex-1 ml-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
            <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="ml-3">
            <div className="flex items-center">
              <h2 className="font-medium text-slate-800">{partner.name}</h2>
              <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-xs">{partner.sport}</Badge>
            </div>
            <p className="text-xs text-emerald-600">{partner.lastActive}</p>
          </div>
        </div>

        <div className="flex">
          <Button variant="ghost" size="icon" className="text-slate-600">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-600">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "partner" && (
              <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                <AvatarImage src={partner.avatar || "/placeholder.svg"} alt={partner.name} />
                <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[75%] p-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-emerald-500 text-white rounded-tr-none"
                  : "bg-white text-slate-800 rounded-tl-none shadow-sm"
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-emerald-100" : "text-slate-400"}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-slate-100 border-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full h-10 w-10 p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNavigation currentPath="/chats" />
    </div>
  )
}
