import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Info } from "lucide-react"

interface Profile {
  id: number
  name: string
  age: number
  gender: string
  location: string
  distance: number
  sport: string
  level: string
  bio: string
  images: string[]
  badges?: string[]
}

interface ProfileCardProps {
  profile: Profile
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden rounded-2xl shadow-lg">
      {/* Image carousel */}
      <div className="relative h-[450px] w-full">
        <img
          src={profile.images[0] || "/placeholder.svg"}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Image indicators */}
        <div className="absolute top-3 left-0 right-0 flex justify-center space-x-1">
          {profile.images.map((_, index) => (
            <div key={index} className={`h-1 rounded-full ${index === 0 ? "w-8 bg-white" : "w-4 bg-white/50"}`} />
          ))}
        </div>

        {/* Badges */}
        {profile.badges && profile.badges.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col items-end space-y-2">
            {profile.badges.map((badge, index) => (
              <Badge key={index} className="bg-emerald-500 text-white">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {/* Profile info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {profile.name}, {profile.age}
              </h2>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {profile.location} • {profile.distance} km de distancia
                </span>
              </div>
            </div>
            <button className="bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile details */}
      <div className="p-4 bg-white">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className="bg-emerald-100 text-emerald-800">{profile.sport}</Badge>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            {profile.level}
          </Badge>
          <Badge variant="outline" className="border-slate-200 text-slate-600">
            {profile.gender}
          </Badge>
        </div>

        <p className="text-slate-600">{profile.bio}</p>
      </div>
    </Card>
  )
}
