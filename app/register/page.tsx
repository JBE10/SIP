"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { SportSelector } from "@/components/sport-selector"

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

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [selectedBarrio, setSelectedBarrio] = useState(barrios[0])
  const [bio, setBio] = useState("")
  const [selectedSports, setSelectedSports] = useState<{ sport: string; level: string }[]>([])
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const success = await register({
        name,
        email,
        age: parseInt(age),
        location: selectedBarrio,
        bio,
        sports: selectedSports,
        password,
        confirm_password: confirmPassword
      })

      if (success) {
        router.push("/swipe")
      } else {
        setError("Error al registrarse. Inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Error al registrarse. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500 to-indigo-700 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-primary rounded-full p-2 text-primary-foreground">
              <Handshake className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
          <CardDescription>Registrate para encontrar compañeros deportivos</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                placeholder="Tu edad"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Barrio/Zona</Label>
              <select
                id="location"
                className="w-full rounded-md border px-2 py-2 text-base"
                value={selectedBarrio}
                onChange={(e) => setSelectedBarrio(e.target.value)}
                required
              >
                {barrios.map((barrio) => (
                  <option key={barrio} value={barrio}>{barrio}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Input
                id="bio"
                placeholder="Cuéntanos sobre ti"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Deportes preferidos</Label>
              <SportSelector
                selectedSports={selectedSports}
                onToggleSport={handleSportToggle}
                onChangeLevel={handleChangeLevel}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <span className="text-sm">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
