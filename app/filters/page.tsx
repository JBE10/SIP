"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const sports = [
  "Baloncesto",
  "Fútbol",
  "Tenis",
  "Running",
  "Ciclismo",
  "Natación",
  "Voleibol",
  "Yoga",
  "Golf",
  "Senderismo",
  "Escalada",
  "Surf",
]

export default function FiltersPage() {
  const [ageRange, setAgeRange] = useState([18, 45])
  const [distance, setDistance] = useState(25)
  const [gender, setGender] = useState("all")
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [skillLevel, setSkillLevel] = useState("all")

  const handleSportToggle = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport))
    } else {
      setSelectedSports([...selectedSports, sport])
    }
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
        <h1 className="text-xl font-bold text-slate-800">Filtros</h1>
        <Button
          variant="ghost"
          className="text-emerald-600"
          onClick={() => {
            setAgeRange([18, 45])
            setDistance(25)
            setGender("all")
            setSelectedSports([])
            setSkillLevel("all")
          }}
        >
          Reiniciar
        </Button>
      </header>

      {/* Filters content */}
      <div className="flex-1 p-4 space-y-6 max-w-md mx-auto w-full">
        {/* Age Range */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-800">Rango de edad</h2>
            <span className="text-sm text-slate-500">
              {ageRange[0]} - {ageRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={ageRange}
            min={18}
            max={65}
            step={1}
            onValueChange={(value) => setAgeRange(value as number[])}
            className="my-4"
          />
        </div>

        {/* Distance */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-slate-800">Distancia</h2>
            <span className="text-sm text-slate-500">{distance} km</span>
          </div>
          <Slider
            defaultValue={[distance]}
            min={1}
            max={100}
            step={1}
            onValueChange={(value) => setDistance(value[0])}
            className="my-4"
          />
        </div>

        {/* Gender */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Género</h2>
          <RadioGroup defaultValue={gender} onValueChange={setGender} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="gender-all" />
              <Label htmlFor="gender-all">Todos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="gender-male" />
              <Label htmlFor="gender-male">Hombre</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="gender-female" />
              <Label htmlFor="gender-female">Mujer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="gender-other" />
              <Label htmlFor="gender-other">Otro</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Sports */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Deportes</h2>
          <div className="flex flex-wrap gap-2">
            {sports.map((sport) => (
              <Badge
                key={sport}
                variant={selectedSports.includes(sport) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedSports.includes(sport)
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
                onClick={() => handleSportToggle(sport)}
              >
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skill Level */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-slate-800 mb-4">Nivel de habilidad</h2>
          <RadioGroup defaultValue={skillLevel} onValueChange={setSkillLevel} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="skill-all" />
              <Label htmlFor="skill-all">Todos los niveles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="skill-beginner" />
              <Label htmlFor="skill-beginner">Principiante</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="skill-intermediate" />
              <Label htmlFor="skill-intermediate">Intermedio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="skill-advanced" />
              <Label htmlFor="skill-advanced">Avanzado</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Apply button */}
        <Link href="/swipe" className="block">
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-xl shadow-md">
            Aplicar filtros
          </Button>
        </Link>
      </div>
    </div>
  )
}
