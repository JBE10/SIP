"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { X, Handshake } from "lucide-react"

interface SwipeCardProps {
  profile: {
    id: string
    name: string
    age: number
    location: string
    description: string
    sports: string[]
    profile_picture: string
  }
  isTop: boolean
  onSwipeLeftAction: () => void
  onSwipeRightAction: () => void
}

export function SwipeCard({ profile, isTop, onSwipeLeftAction, onSwipeRightAction }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const likeScale = useTransform(x, [0, 150], [1, 1.5])
  const dislikeScale = useTransform(x, [-150, 0], [1.5, 1])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    if (info.offset.x > 100) {
      setExitX(200)
      onSwipeRightAction()
    } else if (info.offset.x < -100) {
      setExitX(-200)
      onSwipeLeftAction()
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExitX(200)
    onSwipeRightAction()
  }

  const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExitX(-200)
    onSwipeLeftAction()
  }

  return (
      <motion.div
          className={`absolute w-full ${isTop ? "z-10" : "z-0"}`}
          style={{ x, rotate, opacity }}
          drag={isTop ? "x" : false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={{ x: exitX }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden h-[70vh] relative">
          <div className="relative w-full h-full min-h-[400px]">
            <Image
                src={profile.profile_picture || "/placeholder.svg"}
                alt={profile.name}
                fill
                className="object-cover rounded-md"
                priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">
                {profile.name}, {profile.age}
              </h3>
              <p className="text-sm mb-2">{profile.location}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.sports.map((sports) => (
                    <span key={sports} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {sports}
                </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {isTop && (
            <>
              <motion.button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg z-20"
                  style={{ scale: dislikeScale }}
                  onClick={handleDislikeClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
              >
                <X className="h-8 w-8 text-red-500" />
              </motion.button>

              <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg z-20"
                  style={{ scale: likeScale }}
                  onClick={handleLikeClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
              >
                <Handshake className="h-8 w-8 text-green-500" />
              </motion.button>
            </>
        )}
      </motion.div>
  )
}
