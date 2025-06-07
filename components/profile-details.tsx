"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Award } from "lucide-react"
import { motion } from "framer-motion"

interface ProfileDetailsProps {
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

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Perfil Deportivo</span>
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <MapPin className="h-3 w-3" />
                {profile.distance} km
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
              {profile.age} años • {profile.location}
            </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Deportes favoritos</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.sports.map((sports) => (
                    <Badge key={sports} variant="secondary" className="text-xs">
                      {sports}
                    </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
  )
}
