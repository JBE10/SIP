"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MessageSquare, Handshake } from "lucide-react"
import type { Profile } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchedProfile: Profile
}

export function MatchModal({ isOpen, onClose, matchedProfile }: MatchModalProps) {
  const { user } = useAuth()
  
  useEffect(() => {
    return () => {
      // Solo limpieza, no cerramos el modal automáticamente
    }
  }, [])

  if (!matchedProfile) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-b from-pink-500 to-purple-700 border-0 text-white shadow-2xl rounded-2xl">
        <DialogTitle className="sr-only">Match encontrado</DialogTitle>
        <DialogDescription className="sr-only">Has hecho match con {matchedProfile.name}</DialogDescription>

        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          {/* Título y subtítulo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h2 className="text-4xl font-extrabold mb-2 drop-shadow-lg">¡Es un match!</h2>
            <p className="text-white/90 text-lg font-medium drop-shadow">Tú y <span className="font-bold">{matchedProfile.name}</span> quieren practicar deportes juntos</p>
          </motion.div>

          {/* Apretón de manos */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-white rounded-full p-4 shadow-2xl">
              <Handshake className="h-12 w-12 text-purple-600 handshake-pulse" />
            </div>
          </motion.div>

          {/* Fotos de perfil */}
          <div className="flex justify-center items-center gap-10 mb-8">
            <motion.div
              className="rounded-full overflow-hidden border-4 border-white w-32 h-32 flex-shrink-0 shadow-xl"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={user?.profilePicture || "/placeholder.svg?height=128&width=128"}
                alt="Tu perfil"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                unoptimized
              />
            </motion.div>

            <motion.div
              className="rounded-full overflow-hidden border-4 border-white w-32 h-32 flex-shrink-0 shadow-xl"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={matchedProfile.profilePicture || `/placeholder.svg?height=128&width=128`}
                alt={matchedProfile.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                unoptimized
              />
            </motion.div>
          </div>

          {/* Instagram del match (si existe) */}
          {matchedProfile.instagram && (
            <div className="mb-6 flex flex-col items-center">
              <span className="text-white/90 text-base mb-1">Instagram:</span>
              <a
                href={matchedProfile.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white/90 text-purple-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-white"
              >
                {matchedProfile.instagram.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '').replace('/', '')}
              </a>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col gap-3 w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button asChild className="w-full bg-white text-purple-700 hover:bg-white/90 font-bold text-lg py-3">
                <Link href={`/chats`}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Enviar mensaje
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                variant="ghost"
                className="w-full border border-white/30 text-white hover:bg-white/10 font-bold text-lg py-3"
                onClick={onClose}
              >
                Seguir descubriendo
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
