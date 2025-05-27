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
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shadow-lg">
      <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 min-w-[70px]",
                item.active
                  ? "text-primary bg-primary/15 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105",
              )}
            >
              <Icon className={cn("h-6 w-6", item.active && "scale-110")} />
              <span className={cn("text-xs font-medium", item.active && "font-semibold")}>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer text */}
      <div className="text-center py-2 text-xs text-muted-foreground border-t bg-background/50">
        © 2025 SportMatch - Todos los derechos reservados
      </div>
    </nav>
  )
}
