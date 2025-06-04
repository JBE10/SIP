"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Search, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/profile",
      icon: User,
      label: "Mi Perfil",
      active: pathname === "/profile",
    },
    {
      href: "/swipe",
      icon: Search,
      label: "Descubrir",
      active: pathname === "/swipe",
    },
    {
      href: "/chats",
      icon: MessageCircle,
      label: "Mensajes",
      active: pathname === "/chats" || pathname.startsWith("/chats/"),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-t-3xl shadow-2xl z-50">
      <div className="flex justify-around items-center py-4 px-6">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 min-w-[70px]",
                item.active
                  ? "text-white bg-white/20 scale-105"
                  : "text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105",
              )}
            >
              <Icon className={cn("h-6 w-6", item.active && "scale-110")} />
              <span className={cn("text-xs font-medium", item.active && "font-semibold")}>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer text */}
      <div className="text-center py-2 text-xs text-gray-500 border-t border-gray-700 bg-gray-800/50 rounded-b-3xl">
        © 2025 SportMatch
      </div>
    </nav>
  )
}
  