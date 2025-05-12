import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ChatPreview from "@/components/chat-preview"

const mockChats = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    lastMessage: "Are we still on for tennis tomorrow?",
    time: "10:30 AM",
    unread: 2,
    sport: "Tennis",
  },
  {
    id: 2,
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=100&width=100",
    lastMessage: "I found a great hiking trail we could try!",
    time: "Yesterday",
    unread: 0,
    sport: "Hiking",
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    lastMessage: "Thanks for the basketball game. Let's play again soon!",
    time: "2 days ago",
    unread: 0,
    sport: "Basketball",
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
        <h1 className="text-xl font-bold text-slate-800">Messages</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Search */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search messages" className="pl-10 bg-slate-100 border-none" />
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
            <h3 className="text-lg font-medium text-slate-800">No messages yet</h3>
            <p className="text-sm text-slate-500 mt-1">Start swiping to find your sports partner!</p>
            <Link href="/swipe" className="mt-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Find Partners</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <nav className="flex justify-around p-4 border-t bg-white">
        <Button variant="ghost" className="flex flex-col items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs mt-1 text-slate-600">Profile</span>
        </Button>
        <Link href="/swipe">
          <Button variant="ghost" className="flex flex-col items-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <span className="text-xs mt-1 text-slate-600">Discover</span>
          </Button>
        </Link>
        <Button variant="ghost" className="flex flex-col items-center text-emerald-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C10.8031 21 9.6678 20.7855 8.6157 20.3994L3 21L3.6006 15.3843C3.2145 14.3322 3 13.1969 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs mt-1">Chats</span>
        </Button>
      </nav>
    </div>
  )
}
