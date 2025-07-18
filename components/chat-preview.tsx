"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useState } from "react"
import { ProfileDetailModal } from "./profile-detail-modal"

interface ChatPreviewProps {
  chat: {
    id: string
    name: string
    lastMessage: string
    timestamp: string
    unread: number
    avatar: string
    video_url?: string
    age?: number
    location?: string
    sports?: { sport: string; level: string }[]
    bio?: string
    instagram?: string
    whatsapp?: string
    phone?: string
  }
  index: number
}

export function ChatPreview({ chat, index }: ChatPreviewProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <Avatar className="border border-primary/20">
            <AvatarImage src={chat.avatar || "/placeholder.svg?height=40&width=40"} alt={chat.name} />
            <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
          </div>
          {chat.unread > 0 && (
            <motion.div
              className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1 pulse-animation"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {chat.unread}
            </motion.div>
          )}
        </div>
      </motion.div>
      <ProfileDetailModal open={open} onClose={() => setOpen(false)} chat={chat} />
    </>
  )
}
