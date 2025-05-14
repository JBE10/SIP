import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatPreview from "@/components/chat-preview"
import BottomNavigation from "@/components/bottom-navigation"

const mockChats = [
  {
    id: 1,
    name: "Alex Jiménez",
    avatar: "/placeholder.svg?height=100&width=100",
    lastMessage: "¿Seguimos con el partido de tenis mañana?",
    time: "10:30 AM",
    unread: 2,
    sport: "Tenis",
  },
  {
    id: 2,
    name: "Sara Martínez",
    avatar: "/placeholder.svg?height=100&width=100",
    lastMessage: "¡Encontré una ruta de senderismo genial que podríamos probar!",
    time: "Ayer",
    unread: 0,
    sport: "Senderismo",
  },
  {
    id: 3,
    name: "Miguel Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    lastMessage: "Gracias por el partido de baloncesto. ¡Juguemos de nuevo pronto!",
    time: "Hace 2 días",
    unread: 0,
    sport: "Baloncesto",
  },
]

export default function ChatsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <Link href="/swipe">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-slate-800">Mensajes</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Search */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Buscar mensajes" className="pl-10 bg-slate-100 border-none" />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1">
        {mockChats.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {mockChats.map((chat) => (
              <Link href={`/chats/${chat.id}`} key={chat.id}>
                <ChatPreview chat={chat} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 11.5C21 16.75 12 22 12 22C12 22 3 16.75 3 11.5C3 7.02 7.02 3 12 3C16.98 3 21 7.02 21 11.5Z"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="11.5"
                  r="2.5"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-800">Aún no hay mensajes</h3>
            <p className="text-sm text-slate-500 mt-1">¡Comienza a deslizar para encontrar tu compañero deportivo!</p>
            <Link href="/swipe" className="mt-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Buscar compañeros</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <BottomNavigation currentPath="/chats" />
    </div>
  )
}
