"use client"

import { useState } from "react"
import { ChevronLeft, Camera, Edit2, MapPin, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import ProfileEditModal from "@/components/profile-edit-modal"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  const userProfile = {
    name: "Jamie Smith",
    age: 27,
    gender: "Non-binary",
    location: "Brooklyn, NY",
    sport: "Tennis",
    level: "Intermediate",
    bio: "Tennis enthusiast looking for regular practice partners. I've been playing for 3 years and enjoy both singles and doubles. Available most weekends and some weekday evenings.",
    images: ["/placeholder.svg?height=400&width=400"],
    stats: {
      matches: 24,
      meetups: 18,
      sports: ["Tennis", "Running", "Yoga"],
    },
    achievements: [
      { name: "Early Adopter", description: "Joined during the beta phase" },
      { name: "Social Butterfly", description: "Connected with 10+ partners" },
      { name: "Regular Player", description: "Scheduled 5+ meetups in a month" },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <Link href="/swipe">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-slate-800">Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-5 w-5 text-slate-600" />
        </Button>
      </header>

      {/* Profile content */}
      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {/* Profile header */}
        <div className="relative mb-6">
          <div className="bg-emerald-500 h-32 rounded-t-xl"></div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={userProfile.images[0]} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-emerald-500 hover:bg-emerald-600 h-8 w-8"
              >
                <Camera className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <Card className="pt-16 pb-6 px-6 text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {userProfile.name}, {userProfile.age}
          </h2>
          <div className="flex items-center justify-center mt-1 text-slate-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{userProfile.location}</span>
          </div>

          <div className="flex justify-center space-x-2 mt-3">
            <Badge className="bg-emerald-100 text-emerald-800">{userProfile.sport}</Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              {userProfile.level}
            </Badge>
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              {userProfile.gender}
            </Badge>
          </div>

          <p className="mt-4 text-slate-600">{userProfile.bio}</p>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.stats.matches}</p>
                  <p className="text-sm text-slate-500">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.stats.meetups}</p>
                  <p className="text-sm text-slate-500">Meetups</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.stats.sports.length}</p>
                  <p className="text-sm text-slate-500">Sports</p>
                </div>
              </div>

              <h3 className="font-medium text-slate-800 mb-2">My Sports</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {userProfile.stats.sports.map((sport, index) => (
                  <Badge
                    key={index}
                    className={index === 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}
                  >
                    {sport}
                  </Badge>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-6 border-dashed border-slate-300 text-slate-500"
                >
                  + Add
                </Button>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="achievements">
            <Card className="p-4">
              <div className="space-y-4">
                {userProfile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <div className="bg-emerald-100 p-2 rounded-full mr-3">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-emerald-600"
                      >
                        <path
                          d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{achievement.name}</h4>
                      <p className="text-sm text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout button */}
        <Button variant="outline" className="w-full mt-6 border-slate-200 text-slate-600 hover:bg-slate-100">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>

      {/* Bottom navigation */}
      <nav className="flex justify-around p-4 border-t bg-white">
        <Button variant="ghost" className="flex flex-col items-center text-emerald-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </Button>
        <Link href="/swipe">
          <Button variant="ghost" className="flex flex-col items-center text-slate-600">
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
        </Link>
        <Link href="/chats">
          <Button variant="ghost" className="flex flex-col items-center text-slate-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 12C21 16.9706 16.9706 21 12 21C10.8031 21 9.6678 20.7855 8.6157 20.3994L3 21L3.6006 15.3843C3.2145 14.3322 3 13.1969 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs mt-1">Chats</span>
          </Button>
        </Link>
      </nav>

      {/* Edit profile modal */}
      {isEditing && <ProfileEditModal profile={userProfile} onClose={() => setIsEditing(false)} />}
    </div>
  )
}
