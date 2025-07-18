"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Instagram, MessageCircle, Calendar, X } from "lucide-react"

interface ProfileDetailModalProps {
  open: boolean
  onClose: () => void
  chat: {
    id: string
    name: string
    lastMessage: string
    timestamp: string
    unread: number
    avatar: string
    video_url?: string
    age?: number
    location?: string
    sports?: { sport: string; level: string }[]
    bio?: string
    instagram?: string
    whatsapp?: string
    phone?: string
  }
}

export function ProfileDetailModal({ open, onClose, chat }: ProfileDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md bg-white/90 backdrop-blur-xl text-gray-900 p-0 gap-0 max-h-[90vh] overflow-y-auto border border-white/30 shadow-2xl">
        <DialogTitle className="sr-only">Perfil de {chat.name}</DialogTitle>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Botón cerrar glassmorphism */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 shadow-lg border border-white/30 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video con foto overlay */}
          <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {/* Video */}
            {chat.video_url && chat.video_url.includes('http') ? (
              <video
                src={chat.video_url}
                className="w-full h-full object-cover"
                muted
                loop
                controls
                poster={chat.avatar}
              />
            ) : (
              <div 
                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
                style={{
                  backgroundImage: 'url(https://via.placeholder.com/400x600/3b82f6/ffffff?text=No+video)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/80 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-6" />
                    <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="text-lg font-semibold text-white drop-shadow mb-1">No tiene video</div>
                </div>
              </div>
            )}
            {/* Foto de perfil overlay */}
            <img
              src={chat.avatar && chat.avatar.includes('http')
                ? chat.avatar
                : "/placeholder-user.jpg"}
              alt={chat.name}
              className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-white shadow-lg object-cover bg-white z-20"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-user.jpg"
                e.currentTarget.style.backgroundColor = "#f3f4f6"
                e.currentTarget.style.border = "2px solid #e5e7eb"
              }}
            />
          </div>

          {/* Contenido con glassmorphism */}
          <div className="p-4 space-y-3 bg-white/80 backdrop-blur-sm">
            {/* Nombre y edad */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{chat.name}</h2>
              {chat.age && (
                <div className="inline-flex items-center gap-1 mt-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm text-gray-700 border border-white/30">
                  <Calendar className="w-3 h-3" />
                  {chat.age} años
                </div>
              )}
            </div>

            {/* Deportes */}
            {chat.sports && Array.isArray(chat.sports) && chat.sports.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Deportes</h3>
                <div className="flex flex-wrap gap-1">
                  {chat.sports.map((sport: any, idx: number) => (
                    <Badge
                      key={idx}
                      className="text-xs bg-white/20 backdrop-blur-md text-gray-800 border border-white/30 hover:bg-white/30 transition-all duration-200"
                    >
                      {sport.sport} {sport.level && `(${sport.level})`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            {chat.bio && (
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Descripción</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{chat.bio}</p>
              </div>
            )}

            {/* Botones de contacto */}
            {(!!chat.whatsapp || (typeof chat.instagram === 'string' && chat.instagram)) && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {chat.whatsapp && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-green-500/80 backdrop-blur-md hover:bg-green-500/90 text-white border border-white/30 shadow-lg transition-all duration-200"
                  >
                    <a
                      href={`https://wa.me/${chat.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </Button>
                )}

                {typeof chat.instagram === 'string' && chat.instagram && (
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-pink-500/80 to-purple-600/80 backdrop-blur-md hover:from-pink-500/90 hover:to-purple-600/90 text-white border border-white/30 shadow-lg transition-all duration-200"
                  >
                    <a
                      href={chat.instagram.startsWith('http') ? chat.instagram : `https://instagram.com/${chat.instagram.replace(/^@/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
