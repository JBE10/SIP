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
import { useRef } from "react"

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
  const [instagram, setInstagram] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [foto, setFoto] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)
  const fotoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

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
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("age", age)
      formData.append("location", selectedBarrio)
      formData.append("bio", bio)
      formData.append("password", password)
      formData.append("confirm_password", confirmPassword)
      formData.append("instagram", instagram)
      formData.append("whatsapp", whatsapp)
      if (foto) formData.append("foto", foto)
      if (video) formData.append("video", video)
      formData.append(
        "sports",
        JSON.stringify(selectedSports)
      )

      const formDataObj = {
        name: name,
        email: email,
        age: Number(age),
        location: selectedBarrio,
        bio: bio,
        sports: selectedSports,
        password: password,
        confirm_password: confirmPassword,
        instagram: instagram,
        whatsapp: whatsapp
      }

      const success = await register(formDataObj)

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-white">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 rounded-full p-2 text-white">
              <Handshake className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Crear cuenta</CardTitle>
          <CardDescription className="text-gray-400">Registrate para encontrar compañeros deportivos</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-900/30 text-red-400 text-sm p-3 rounded-md mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-gray-200">Edad</Label>
              <Input
                id="age"
                type="number"
                placeholder="Tu edad"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-200">Barrio/Zona</Label>
              <select
                id="location"
                className="w-full rounded-md border px-2 py-2 text-base bg-gray-900 text-white border-gray-700"
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
              <Label htmlFor="bio" className="text-gray-200">Biografía</Label>
              <Input
                id="bio"
                placeholder="Cuéntanos sobre ti"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">Deportes preferidos</Label>
              <SportSelector
                selectedSports={selectedSports}
                onToggleSport={handleSportToggle}
                onChangeLevel={handleChangeLevel}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foto" className="text-gray-200">Foto de perfil</Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                ref={fotoInputRef}
                onChange={e => setFoto(e.target.files?.[0] || null)}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video" className="text-gray-200">Video de presentación</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={e => setVideo(e.target.files?.[0] || null)}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-gray-200">Instagram</Label>
              <Input
                id="instagram"
                placeholder="Tu usuario de Instagram"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-gray-200">WhatsApp</Label>
              <Input
                id="whatsapp"
                placeholder="Tu número de WhatsApp"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="bg-gray-900 text-white border-gray-700"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <span className="text-sm text-gray-400">
            ¿Ya tenés una cuenta?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Iniciar sesión
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
