"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { User, Search, MessageCircle, Settings, LogOut } from "lucide-react"

export default function MenuPage() {
  const router = useRouter()

  const [username, setUsername] = useState("Usuario")
  const [deportes, setDeportes] = useState("No cargado")
  const [fotoUrl, setFotoUrl] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Token inválido")

        const data = await res.json()
        setUsername(data.username)
        setDeportes(data.deportes_preferidos || "No especificado")
        setFotoUrl(data.foto_url)
      } catch (err) {
        console.error(err)
        router.push("/login")
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="flex justify-between items-center p-4 border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          {fotoUrl && (
            <img
              src={fotoUrl}
              alt="Foto de perfil"
              className="w-12 h-12 rounded-full border shadow-sm object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-primary">SportMatch</h1>
            <p className="text-sm text-muted-foreground">Hola, {username}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="flex-1 flex flex-col items-center justify-center p-4 text-center gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="space-y-4" variants={item}>
          <motion.h2
            className="text-3xl font-bold text-primary relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            ¿Qué quieres hacer hoy?
          </motion.h2>
          <motion.p className="text-muted-foreground" variants={item}>
            Encuentra tu compañero deportivo ideal
          </motion.p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="grid grid-cols-2 gap-4 w-full max-w-sm" variants={container}>
          <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="h-24 w-full flex-col gap-2">
              <Link href="/swipe">
                <Search className="h-6 w-6" />
                <span>Descubrir</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="h-24 w-full flex-col gap-2">
              <Link href="/chats">
                <MessageCircle className="h-6 w-6" />
                <span>Mensajes</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="h-24 w-full flex-col gap-2">
              <Link href="/profile">
                <User className="h-6 w-6" />
                <span>Mi Perfil</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={item} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild variant="outline" className="h-24 w-full flex-col gap-2">
              <Link href="/filters">
                <Settings className="h-6 w-6" />
                <span>Filtros</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Bottom Navigation */}
      <motion.nav
        className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
    </div>
  )
}
