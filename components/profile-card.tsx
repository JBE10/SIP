import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import Image from "next/image"

interface ProfileCardProps {
  profile: {
    id: string
    name: string
    age: number
    location: string
    description: string
    sports: string[]
    distance: number
    profile_picture: string
  }
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
      <Card className="overflow-hidden h-[70vh] relative group">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative h-full w-full">
            <Image
                src={profile.profile_picture || "/placeholder.svg?height=600&width=400"}
                alt={profile.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
                unoptimized
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">
              {profile.name}, {profile.age}
            </h2>
            <p className="flex items-center gap-1 text-white/80">
              <MapPin className="h-4 w-4" />
              {profile.location} • a {profile.distance} km
            </p>
          </div>
          <p className="mb-4 line-clamp-3 bg-black/30 p-3 rounded-lg backdrop-blur-sm">{profile.description}</p>
          <div className="flex flex-wrap gap-2">
            {profile.sports.map((sports) => (
                <Badge key={sports} variant="secondary" className="profile-badge">
                  {sports}
                </Badge>
            ))}
          </div>
        </div>
      </Card>
  )
}
