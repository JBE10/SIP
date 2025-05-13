"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X } from "lucide-react"

interface Profile {
  id: number
  name: string
  age: number
  sport: string
  level: string
  images: string[]
}


interface MatchModalProps {
  profile: Profile
  onClose: () => void
  onMessage: () => void
}

export default function MatchModal({ profile, onClose, onMessage }: MatchModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl">
        <div className="relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-emerald-500 opacity-90">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 rounded-full p-2 text-white hover:bg-white/30 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 pt-10">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">It's a Match!</h2>
              <p className="text-white/80">You and {profile.name} both want to play together</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=200&width=200" alt="Your profile" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md">
                  <Badge className="bg-emerald-100 text-emerald-800">You</Badge>
                </div>
              </div>

              <div className="w-10 h-10 mx-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 9L19 4M19 4V9M19 4H14M10 15L5 20M5 20V15M5 20H10"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.images[0]} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md">
                  <Badge className="bg-emerald-100 text-emerald-800">{profile.sport}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <Button onClick={onMessage} className="w-full bg-white text-emerald-600 hover:bg-white/90">
                <MessageCircle className="mr-2 h-5 w-5" />
                Send a Message
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Keep Swiping
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
