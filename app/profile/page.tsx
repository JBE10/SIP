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
import BottomNavigation from "@/components/bottom-navigation"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  const userProfile = {
    name: "Jaime Martínez",
    age: 27,
    gender: "No binario",
    location: "Madrid, España",
    sport: "Tenis",
    level: "Intermedio",
    bio: "Entusiasta del tenis buscando compañeros regulares para practicar. Llevo jugando 3 años y disfruto tanto del individual como del dobles. Disponible la mayoría de los fines de semana y algunas tardes entre semana.",
    images: ["/placeholder.svg?height=400&width=400"],
    stats: {
      matches: 24,
      meetups: 18,
      sports: ["Tenis", "Running", "Yoga"],
    },
    achievements: [
      { name: "Adoptante temprano", description: "Se unió durante la fase beta" },
      { name: "Mariposa social", description: "Conectó con más de 10 compañeros" },
      { name: "Jugador regular", description: "Programó más de 5 encuentros en un mes" },
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
        <h1 className="text-xl font-bold text-slate-800">Perfil</h1>
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
                <AvatarImage src={userProfile.images[0] || "/placeholder.svg"} alt={userProfile.name} />
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
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
          </TabsList>
          <TabsContent value="stats">
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.stats.matches}</p>
                  <p className="text-sm text-slate-500">Partidos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.stats.meetups}</p>
                  <p className="text-sm text-slate-500">Encuentros</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.stats.sports.length}</p>
                  <p className="text-sm text-slate-500">Deportes</p>
                </div>
              </div>

              <h3 className="font-medium text-slate-800 mb-2">Mis deportes</h3>
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
                  + Añadir
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
          Cerrar sesión
        </Button>
      </div>

      {/* Bottom navigation */}
      <BottomNavigation currentPath="/profile" />

      {/* Edit profile modal */}
      {isEditing && <ProfileEditModal profile={userProfile} onClose={() => setIsEditing(false)} />}
    </div>
  )
}
