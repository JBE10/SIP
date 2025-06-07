"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Save, ArrowLeft } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { ALL_SPORTS } from "@/lib/constants/sports"

export default function FiltersPage() {
  const router = useRouter()
  const { filters, setFilters } = useAppContext()

  const [distance, setDistance] = useState([filters.distance])
  const [ageMin, setAgeMin] = useState(filters.ageRange[0])
  const [ageMax, setAgeMax] = useState(filters.ageRange[1])
  const [selectedSports, setSelectedSports] = useState<string[]>(filters.sports)

  useEffect(() => {
    setDistance([filters.distance])
    setAgeMin(filters.ageRange[0])
    setAgeMax(filters.ageRange[1])
    setSelectedSports(filters.sports)
  }, [filters])

  const handleSportToggle = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport))
    } else {
      setSelectedSports([...selectedSports, sport])
    }
  }

  const handleSaveFilters = () => {
    setFilters({
      sports: selectedSports,
      distance: distance[0],
      ageRange: [ageMin, ageMax],
    })
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
            <div className="grid grid-cols-2 gap-2">
              {ALL_SPORTS.map((sport: string) => {
                const isSelected = selectedSports.includes(sport)
                return (
                    <button
                        key={sport}
                        type="button"
                        onClick={() => handleSportToggle(sport)}
                        className={`w-full px-3 py-2 rounded-md border text-sm font-medium transition-all
                  ${
                            isSelected
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                        }`}
                    >
                      {sport}
                    </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distancia máxima</CardTitle>
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
            <CardTitle>Edad mínima y máxima</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label>Edad mínima</Label>
              <input
                  type="number"
                  min={18}
                  max={ageMax}
                  className="w-full p-2 rounded-md border bg-background text-white"
                  value={ageMin}
                  onChange={(e) => setAgeMin(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Edad máxima</Label>
              <input
                  type="number"
                  min={ageMin}
                  max={65}
                  className="w-full p-2 rounded-md border bg-background text-white"
                  value={ageMax}
                  onChange={(e) => setAgeMax(Number(e.target.value))}
              />
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
