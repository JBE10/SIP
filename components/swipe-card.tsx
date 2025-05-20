"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { X, Heart } from "lucide-react"

interface SwipeCardProps {
  profile: {
    id: string
    name: string
    age: number
    location: string
    bio: string
    sports: string[]
    profilePicture: string
  }
  isTop: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function SwipeCard({ profile, isTop, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Motion values for the card
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  // Scale for the like/dislike buttons
  const likeScale = useTransform(x, [0, 150], [1, 1.5])
  const dislikeScale = useTransform(x, [-150, 0], [1.5, 1])

  // Handle drag end
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    if (info.offset.x > 100) {
      setExitX(200)
      onSwipeRight()
    } else if (info.offset.x < -100) {
      setExitX(-200)
      onSwipeLeft()
    }
  }

  // Handle like button click
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExitX(200)
    onSwipeRight()
  }

  // Handle dislike button click
  const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExitX(-200)
    onSwipeLeft()
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
          <div className="relative w-full h-full">
            <Image
                src={profile.profilePicture || `/placeholder.svg?height=800&width=600`}
                alt={profile.name}
                fill
                className="object-cover"
                priority
                unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">
                {profile.name}, {profile.age}
              </h3>
              <p className="text-sm mb-2">{profile.location}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.sports.map((sport) => (
                    <span key={sport} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {sport}
                </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {isTop && (
            <>
              {/* Dislike button */}
              <motion.button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg z-20"
                  style={{ scale: dislikeScale }}
                  onClick={handleDislikeClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
              >
                <X className="h-8 w-8 text-red-500" />
              </motion.button>

              {/* Like button */}
              <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg z-20"
                  style={{ scale: likeScale }}
                  onClick={handleLikeClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
              >
                <Heart className="h-8 w-8 text-green-500" />
              </motion.button>
            </>
        )}
      </motion.div>
  )
}
