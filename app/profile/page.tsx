"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { Edit, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/context/auth-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    setUserData(user)
  }, [user, router])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (!userData) return null

  return (
    <>
      <motion.div
        className="container max-w-2xl mx-auto p-4 space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>Tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={userData.foto_url || "/placeholder-avatar.jpg"}
                    alt="Foto de perfil"
                    fill
                    className="rounded-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{userData.username}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{userData.ubicacion || "No especificada"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deportes preferidos</h4>
                <p className="text-muted-foreground">{userData.deportes_preferidos || "No especificados"}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Descripción</h4>
                <p className="text-muted-foreground">{userData.description || "No especificada"}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Configuración de cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={userData.username} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" value={userData.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" value={userData.ubicacion || "No especificada"} readOnly />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                <Button variant="outline" className="w-full" onClick={() => setIsEditModalOpen(true)}>
                  Editar información
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                <Button variant="destructive" className="w-full" onClick={logout}>
                  Cerrar sesión
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        <ProfileEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={userData} />
      </motion.div>
      <BottomNavigation />
    </>
  )
}
