"use client"

import { Check } from "lucide-react"

interface SportSelectorProps {
  selectedSports: string[]
  onToggleSportAction: (sports: string) => void
}

export function SportSelector({ selectedSports, onToggleSportAction }: SportSelectorProps) {
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
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {availableSports.map((sports) => {
        const isSelected = selectedSports.includes(sports)
        return (
          <button
            key={sports}
            type="button"
            className={`flex items-center justify-between px-4 py-2 rounded-md border transition-colors ${
              isSelected ? "border-primary bg-primary/10 text-primary" : "border-input hover:bg-muted"
            }`}
            onClick={() => onToggleSportAction(sports)}
          >
            <span>{sports}</span>
            {isSelected && <Check className="h-4 w-4" />}
          </button>
        )
      })}
    </div>
  )
}
