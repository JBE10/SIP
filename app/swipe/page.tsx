"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Filter, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileCard from "@/components/profile-card"
import MatchModal from "@/components/match-modal"
import { useMobile } from "@/hooks/use-mobile"
import { profiles } from "@/data/mock-profiles"
import Link from "next/link"
// Add the import for the SportSelector component
import SportSelector from "@/components/sport-selector"

// Update the SwipePage component to include the SportSelector
// Add it right after the header section and before the main content

export default function SwipePage() {
  const router = useRouter()
  const isMobile = useMobile()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<string | null>(null)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<any>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedSport, setSelectedSport] = useState<string | null>(null)

  const handleSwipe = (dir: string) => {
    setDirection(dir)

    // Simulate a match with 30% probability when swiping right
    if (dir === "right" && Math.random() < 0.3) {
      setMatchedProfile(profiles[currentIndex])
      setTimeout(() => {
        setShowMatch(true)
      }, 500)
    }

    setTimeout(() => {
      setDirection(null)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    if ("touches" in e) {
      startX.current = e.touches[0].clientX
      currentX.current = e.touches[0].clientX
    } else {
      startX.current = e.clientX
      currentX.current = e.clientX
    }
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return

    if ("touches" in e) {
      currentX.current = e.touches[0].clientX
    } else {
      currentX.current = e.clientX
    }

    const diff = currentX.current - startX.current
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`

      // Add opacity to indicate like/dislike
      if (diff > 0) {
        cardRef.current.style.boxShadow = `0 0 10px 2px rgba(46, 213, 115, ${Math.min(diff / 100, 0.8)})`
      } else if (diff < 0) {
        cardRef.current.style.boxShadow = `0 0 10px 2px rgba(255, 71, 87, ${Math.min(Math.abs(diff) / 100, 0.8)})`
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (!cardRef.current) return

    const diff = currentX.current - startX.current
    const threshold = 100

    if (diff > threshold) {
      handleSwipe("right")
    } else if (diff < -threshold) {
      handleSwipe("left")
    } else {
      // Reset position if not swiped enough
      cardRef.current.style.transform = ""
      cardRef.current.style.boxShadow = ""
    }
  }

  useEffect(() => {
    if (!isDragging && cardRef.current) {
      cardRef.current.style.transform = ""
      cardRef.current.style.boxShadow = ""
    }
  }, [isDragging])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-emerald-600">SportMatch</h1>
        <Link href="/filters">
          <Button variant="ghost" size="icon">
            <Filter className="h-6 w-6 text-slate-600" />
          </Button>
        </Link>
      </header>

      {/* Sport Selector */}
      <SportSelector selectedSport={selectedSport} onSelectSport={setSelectedSport} />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {profiles.length > 0 ? (
          <div
            ref={cardRef}
            className={`transition-transform duration-300 ${
              direction === "left"
                ? "-translate-x-[150%] rotate-[-20deg]"
                : direction === "right"
                  ? "translate-x-[150%] rotate-[20deg]"
                  : ""
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={isMobile ? undefined : handleTouchStart}
            onMouseMove={isMobile ? undefined : handleTouchMove}
            onMouseUp={isMobile ? undefined : handleTouchEnd}
            onMouseLeave={isMobile ? undefined : handleTouchEnd}
          >
            <ProfileCard profile={profiles[currentIndex]} />
          </div>
        ) : (
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <p className="text-lg text-slate-600">No more profiles to show.</p>
            <p className="text-sm text-slate-400 mt-2">Try adjusting your filters.</p>
          </div>
        )}

        {/* Swipe buttons */}
        <div className="flex justify-center space-x-6 mt-8">
          <Button
            onClick={() => handleSwipe("left")}
            className="h-16 w-16 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#FF4757"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          <Button
            onClick={() => handleSwipe("right")}
            className="h-16 w-16 rounded-full bg-white border border-slate-200 shadow-md hover:bg-slate-50"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.5 12.75L10.5 18.75L19.5 5.25"
                stroke="#2ED573"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="flex justify-around p-4 border-t bg-white">
        <Link href="/profile">
          <Button variant="ghost" className="flex flex-col items-center">
            <User className="h-6 w-6 text-slate-600" />
            <span className="text-xs mt-1 text-slate-600">Profile</span>
          </Button>
        </Link>
        <Button variant="ghost" className="flex flex-col items-center text-emerald-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 11.5C21 16.75 12 22 12 22C12 22 3 16.75 3 11.5C3 7.02 7.02 3 12 3C16.98 3 21 7.02 21 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="11.5"
              r="2.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs mt-1">Discover</span>
        </Button>
        <Link href="/chats">
          <Button variant="ghost" className="flex flex-col items-center">
            <MessageCircle className="h-6 w-6 text-slate-600" />
            <span className="text-xs mt-1 text-slate-600">Chats</span>
          </Button>
        </Link>
      </nav>

      {/* Match modal */}
      {showMatch && matchedProfile && (
        <MatchModal
          profile={matchedProfile}
          onClose={() => setShowMatch(false)}
          onMessage={() => {
            setShowMatch(false)
            router.push("/chats")
          }}
        />
      )}
    </div>
  )
}
