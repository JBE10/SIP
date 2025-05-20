"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { MessageSquare, Handshake } from "lucide-react"
import type { Profile } from "@/context/app-context"

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchedProfile: Profile
}

export function MatchModal({ isOpen, onClose, matchedProfile }: MatchModalProps) {
  // Asegurarse de que el modal se cierre cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (isOpen) {
        onClose()
      }
    }
  }, [isOpen, onClose])

  if (!matchedProfile) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-pink-500 to-purple-600 border-0 text-white">
        <DialogTitle className="sr-only">Match encontrado</DialogTitle>
        <DialogDescription className="sr-only">Has hecho match con {matchedProfile.name}</DialogDescription>

        <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold mb-2">¡Es un match!</h2>
            <p className="text-white/80">Tú y {matchedProfile.name} quieren practicar deportes juntos</p>
          </motion.div>

          <div className="relative w-full h-40 mb-8">
            <motion.div
              className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full overflow-hidden border-4 border-white w-28 h-28"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/images/profile1.png"
                alt="Tu perfil"
                width={112}
                height={112}
                className="object-cover"
                unoptimized
              />
            </motion.div>

            <motion.div
              className="absolute right-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full overflow-hidden border-4 border-white w-28 h-28"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={matchedProfile.profilePicture || `/placeholder.svg?height=112&width=112`}
                alt={matchedProfile.name}
                width={112}
                height={112}
                className="object-cover"
                unoptimized
              />
            </motion.div>

            {/* Reemplazamos el corazón por un apretón de manos */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white rounded-full p-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Handshake className="h-10 w-10 text-purple-600 handshake-pulse" />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button asChild className="w-full bg-white text-purple-600 hover:bg-white/90">
                <Link href={`/chats`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
              <Button
                variant="ghost"
                className="w-full border border-white/30 text-white hover:bg-white/10"
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
