import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Chat {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  sport: string
}

interface ChatPreviewProps {
  chat: Chat
}

export default function ChatPreview({ chat }: ChatPreviewProps) {
  return (
    <div className="flex items-center p-4 hover:bg-slate-100 transition-colors">
      <div className="relative">
        <Avatar className="h-14 w-14">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
        </Avatar>
        {chat.unread > 0 && (
          <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {chat.unread}
          </div>
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="font-medium text-slate-800">{chat.name}</h3>
            <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-xs">{chat.sport}</Badge>
          </div>
          <span className="text-xs text-slate-500">{chat.time}</span>
        </div>

        <p className={`text-sm truncate mt-1 ${chat.unread > 0 ? "font-medium text-slate-800" : "text-slate-500"}`}>
          {chat.lastMessage}
        </p>
      </div>
    </div>
  )
}
