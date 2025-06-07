// ✅ Opción 1: Fondo translúcido + blur (estilo iOS modernizado)

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Search, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/profile", icon: User, label: "Mi Perfil", active: pathname === "/profile" },
    { href: "/swipe", icon: Search, label: "Descubrir", active: pathname === "/swipe" },
    { href: "/chats", icon: MessageCircle, label: "Mensajes", active: pathname === "/chats" || pathname.startsWith("/chats/") },
  ]

  return (
      <div className="fixed bottom-0 left-0 w-full z-50 py-4 bg-black/70 backdrop-blur-lg border-t border-white/10">
          <nav className="flex justify-around items-end">
              {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                      <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                              "flex flex-col items-center justify-center gap-1 w-20 h-16 rounded-2xl transition-all",
                              item.active
                                  ? "bg-green-600 text-white scale-105"
                                  : "text-white/50 hover:text-white hover:bg-white/10"
                          )}
                      >
                          <Icon className="h-6 w-6" />
                          <span className="text-[10px]">{item.label}</span>
                      </Link>
                  )
              })}
          </nav>
      </div>

  )
}
