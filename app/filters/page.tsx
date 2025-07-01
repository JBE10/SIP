"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SportSelector } from "@/components/sport-selector"
import { ArrowLeft, Save } from "lucide-react"
import { useApp } from "@/context/app-context"
import { useRouter } from "next/navigation"

const barrios = [
  "Palermo",
  "Belgrano",
  "Recoleta",
  "Villa Crespo",
  "Caballito",
  "San Telmo",
  "Almagro",
  "Núñez",
  "Colegiales",
  "Retiro",
  "Puerto Madero",
  "Villa Urquiza",
  "Saavedra",
  "Boedo",
  "Flores",
]

export default function FiltersPage() {
  const { filters, updateFilters } = useApp()
  const router = useRouter()
  
  const [distance, setDistance] = useState([filters.distance])
  const [ageRange, setAgeRange] = useState<number[]>(filters.ageRange)
  const [selectedSports, setSelectedSports] = useState(filters.selectedSports)
  const [selectedBarrio, setSelectedBarrio] = useState(filters.selectedBarrio)

  // Actualizar estado local cuando cambien los filtros del contexto
  useEffect(() => {
    setDistance([filters.distance])
    setAgeRange(filters.ageRange)
    setSelectedSports(filters.selectedSports)
    setSelectedBarrio(filters.selectedBarrio)
  }, [filters])

  const handleSportToggle = (sport: string) => {
    const exists = selectedSports.find((s) => s.sport === sport)
    if (exists) {
      setSelectedSports(selectedSports.filter((s) => s.sport !== sport))
    } else {
      setSelectedSports([...selectedSports, { sport, level: "Principiante" }])
    }
  }

  const handleChangeLevel = (sport: string, level: string) => {
    setSelectedSports((prev) => prev.map((s) => (s.sport === sport ? { ...s, level } : s)))
  }

  const handleSaveFilters = () => {
    const newFilters = {
      distance: distance[0],
      ageRange: [ageRange[0], ageRange[1]] as [number, number],
      selectedSports,
      selectedBarrio,
    }
    
    console.log("Guardando filtros:", newFilters)
    updateFilters(newFilters)
    
    // Redirigir a swipe
    router.push("/swipe")
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
          <SportSelector
            selectedSports={selectedSports}
            onToggleSport={handleSportToggle}
            onChangeLevel={handleChangeLevel}
          />
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
            <Label>Selecciona tu barrio/zona</Label>
            <select
              className="w-full rounded-md border px-2 py-2 text-base"
              value={selectedBarrio}
              onChange={(e) => setSelectedBarrio(e.target.value)}
            >
              {barrios.map((barrio) => (
                <option key={barrio} value={barrio}>{barrio}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/swipe">Cancelar</Link>
        </Button>
        <Button className="w-full" onClick={handleSaveFilters}>
          <Save className="mr-2 h-4 w-4" />
          Guardar filtros
        </Button>
      </div>
    </div>
  )
}
