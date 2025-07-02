"use client"

import { Check } from "lucide-react"

interface SportSelectorProps {
  selectedSports: { sport: string; level: string }[]
  onToggleSport: (sport: string) => void
  onChangeLevel: (sport: string, level: string) => void
}

const levels = ["Principiante", "Intermedio", "Avanzado"]

export function SportSelector({ selectedSports, onToggleSport, onChangeLevel }: SportSelectorProps) {
  // Lista de deportes disponibles
  const availableSports = [
    "Fútbol",
    "Tenis",
    "Básquet",
    "Vóley",
    "Running",
    "Ciclismo",
    "Natación",
    "Yoga",
    "Pilates",
    "Pádel",
    "Hockey",
    "Rugby",
    "Golf",
    "Escalada",
    "Boxeo",
    "Artes marciales",
    "Gimnasio",
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {availableSports.map((sport) => {
        const selected = selectedSports.find((s) => s.sport === sport)
        return (
          <div key={sport} className="flex flex-col gap-1">
            <button
              type="button"
              className={`flex items-center justify-between px-4 py-2 rounded-md border transition-colors w-full ${
                selected ? "border-primary bg-primary/10 text-primary" : "border-input hover:bg-muted"
              }`}
              onClick={() => onToggleSport(sport)}
            >
              <span>{sport}</span>
              {selected && <Check className="h-4 w-4" />}
            </button>
            {selected && (
              <select
                className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                value={selected.level}
                onChange={(e) => {
                  console.log("SportSelector onChange ejecutado:", sport, e.target.value)
                  onChangeLevel(sport, e.target.value)
                }}
              >
                {levels.map((level) => (
                  <option key={`${sport}-${level}`} value={level}>{level}</option>
                ))}
              </select>
            )}
          </div>
        )
      })}
    </div>
  )
}
