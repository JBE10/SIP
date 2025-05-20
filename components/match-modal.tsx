"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare } from "lucide-react"

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  matchedProfile: any
}

export function MatchModal({ isOpen, onClose, matchedProfile }: MatchModalProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true)
    } else {
      setShowAnimation(false)
    }
  }, [isOpen])

  if (!matchedProfile) return null

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-pink-500 to-purple-600 border-0 text-white">
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
              <h2 className="text-3xl font-bold mb-2">¡Es un match!</h2>
              <p className="text-white/80">Tú y {matchedProfile.name} se han gustado mutuamente</p>
            </motion.div>

            <div className="relative w-full h-40 mb-8">
              <AnimatePresence>
                {showAnimation && (
                    <>
                      <motion.div
                          className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full overflow-hidden border-4 border-white w-28 h-28"
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                      >
                        <Image src="/images/profile1.png" alt="Tu perfil" fill className="object-cover" unoptimized />
                      </motion.div>

                      <motion.div
                          className="absolute right-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full overflow-hidden border-4 border-white w-28 h-28"
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                      >
                        <Image
                            src={matchedProfile.profilePicture || `/placeholder.svg?height=200&width=200`}
                            alt={matchedProfile.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                      </motion.div>

                      <motion.div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="60"
                            height="60"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white drop-shadow-lg heart-pulse"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </motion.div>
                    </>
                )}
              </AnimatePresence>
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
