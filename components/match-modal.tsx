"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAppContext } from "@/context/app-context"

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchedProfile: any
}

export function MatchModal({ isOpen, onClose, matchedProfile }: MatchModalProps) {
  const { currentUser } = useAppContext()

  if (!matchedProfile) return null

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <DialogTitle className="text-center text-2xl">¡Es un match!</DialogTitle>
              <DialogDescription className="text-center">
                A ti y a {matchedProfile.name} les gustaría practicar deportes juntos
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-6">
            <motion.div
                className="flex flex-col items-center"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Avatar className="h-24 w-24 border-2 border-primary shadow-lg shadow-primary/20">
                <AvatarImage src={currentUser.profilePicture || "/placeholder.svg"} alt="Tu perfil" />
                <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="mt-2 font-medium">Tú</span>
            </motion.div>

            <motion.div
                className="flex items-center text-primary"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                  delay: 0.5,
                }}
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pulse-animation"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </motion.div>

            <motion.div
                className="flex flex-col items-center"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Avatar className="h-24 w-24 border-2 border-primary shadow-lg shadow-primary/20">
                <AvatarImage src={matchedProfile.profilePicture || "/placeholder.svg"} alt={matchedProfile.name} />
                <AvatarFallback>{matchedProfile.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="mt-2 font-medium">{matchedProfile.name}</span>
            </motion.div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="w-full">
                <Link href={`/chats/${matchedProfile.id}`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </Link>
              </Button>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
              <Button variant="outline" onClick={onClose} className="w-full">
                Seguir buscando
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
