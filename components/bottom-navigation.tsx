"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, MapPin, MessageCircle } from "lucide-react"

interface BottomNavigationProps {
    currentPath: string
}

export default function BottomNavigation({ currentPath }: BottomNavigationProps) {
    return (
        <nav className="flex justify-around p-4 border-t bg-white">
            <Link href="/profile">
                <Button
                    variant="ghost"
                    className={`flex flex-col items-center ${currentPath === "/profile" ? "text-emerald-600" : "text-slate-600"}`}
                >
                    <User className="h-6 w-6" />
                    <span className="text-xs mt-1">Perfil</span>
                </Button>
            </Link>
            <Link href="/swipe">
                <Button
                    variant="ghost"
                    className={`flex flex-col items-center ${currentPath === "/swipe" ? "text-emerald-600" : "text-slate-600"}`}
                >
                    <MapPin className="h-6 w-6" />
                    <span className="text-xs mt-1">Descubrir</span>
                </Button>
            </Link>
            <Link href="/chats">
                <Button
                    variant="ghost"
                    className={`flex flex-col items-center ${currentPath === "/chats" ? "text-emerald-600" : "text-slate-600"}`}
                >
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-xs mt-1">Chats</span>
                </Button>
            </Link>
        </nav>
    )
}
