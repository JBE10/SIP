"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { ALL_SPORTS } from "@/lib/constants/sports"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [description, setDescription] = useState("")
  const [sports, setSports] = useState<string[]>([])
  const [age, setAge] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSportToggle = (sport: string) => {
    setSports((prev) =>
        prev.includes(sport)
            ? prev.filter((s) => s !== sport)
            : [...prev, sport]
    )
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
        password,
        description,
        sports: sports.join(","),
        age: Number(age),
        location,
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
            <CardDescription>Regístrate para encontrar compañeros deportivos</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                  {error}
                </div>
            )}
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
                <Label htmlFor="description">Descripción</Label>
                <Input
                    id="description"
                    placeholder="Cuéntanos sobre ti"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label>Deportes preferidos</Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SPORTS.map((sport) => (
                      <label key={sport} className="flex items-center gap-1 text-sm">
                        <input
                            type="checkbox"
                            value={sport}
                            checked={sports.includes(sport)}
                            onChange={() => handleSportToggle(sport)}
                        />
                        {sport}
                      </label>
                  ))}
                </div>
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
                <Label htmlFor="location">Ubicación</Label>
                <Input
                    id="location"
                    placeholder="Ej: Palermo, CABA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    type="password"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center text-muted-foreground">
              <span>¿Ya tienes una cuenta? </span>
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
  )
}
