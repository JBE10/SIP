"use client"

import Link from "next/link"
import { User, Search, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export function BottomNavigation() {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex justify-around items-center py-2 px-4">
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Mi Perfil</span>
        </Link>

        <Link
          href="/swipe"
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-xs">Descubrir</span>
        </Link>

        <Link
          href="/chats"
          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Mensajes</span>
        </Link>
      </div>
    </motion.nav>
  )
}
  