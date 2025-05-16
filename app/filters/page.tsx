"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SportSelector } from "@/components/sport-selector"
import { ArrowLeft, Save } from "lucide-react"

export default function FiltersPage() {
  const [distance, setDistance] = useState([10])
  const [ageRange, setAgeRange] = useState([18, 40])
  const [selectedSports, setSelectedSports] = useState<string[]>(["Fútbol", "Tenis"])

  const handleSportToggle = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport))
    } else {
      setSelectedSports([...selectedSports, sport])
    }
  }

  return (
    <div className="container max-w-md py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/menu">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Filtros</h1>
        <div className="w-10" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deportes</CardTitle>
        </CardHeader>
        <CardContent>
          <SportSelector selectedSports={selectedSports} onToggleSport={handleSportToggle} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distancia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={distance} max={50} step={1} onValueChange={setDistance} />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">0 km</span>
            <span className="font-medium">{distance[0]} km</span>
            <span className="text-sm text-muted-foreground">50 km</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rango de edad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={ageRange} min={18} max={65} step={1} onValueChange={setAgeRange} />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">18</span>
            <span className="font-medium">
              {ageRange[0]} - {ageRange[1]}
            </span>
            <span className="text-sm text-muted-foreground">65+</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ubicación actual</Label>
            <div className="p-3 bg-muted rounded-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Palermo, CABA, Argentina</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Cambiar ubicación
          </Button>
        </CardFooter>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/swipe">Cancelar</Link>
        </Button>
        <Button className="w-full" asChild>
          <Link href="/swipe">
            <Save className="mr-2 h-4 w-4" />
            Guardar filtros
          </Link>
        </Button>
      </div>
    </div>
  )
}
