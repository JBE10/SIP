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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const formData = new FormData()
        formData.append("file", e.target.files[0])
        const token = localStorage.getItem("token")

        const res = await fetch("http://localhost:8000/users/upload-photo", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (!res.ok) {
            console.error("Error al subir imagen")
            return
        }

        const data = await res.json()
        const updatedUser = { ...userData, profilePicture: data.profilePicture }
        setUserData(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    if (!userData) return null

    return (
        <>
            <motion.div
                className="container max-w-md py-6 space-y-6 pb-32"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div className="flex items-center justify-between" variants={item}>
                    <h1 className="text-2xl font-bold">Mi Perfil</h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)}>
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Editar perfil</span>
                        </Button>
                    </div>
                </motion.div>

                <motion.div className="flex flex-col items-center gap-4" variants={item}>
                    <motion.div
                        className="relative"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary relative">
                            <Image
                                src={userData.profilePicture || "/placeholder.svg?height=96&width=96"}
                                alt="Foto de perfil"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <label className="mt-2 block text-sm font-medium text-center text-primary cursor-pointer">
                            Cambiar foto de perfil
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                        </label>
                    </motion.div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold">
                            {userData.name}, {userData.age}
                        </h2>
                        <p className="text-muted-foreground flex items-center justify-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {userData.location}
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre mí</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{userData.bio}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Mis deportes</CardTitle>
                            <CardDescription>Deportes que practico o me interesan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {userData.sports.map((sport: string, index: number) => (
                                    <motion.div
                                        key={sport}
                                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {sport}
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full">
                                <Button variant="outline" className="w-full" onClick={() => setIsEditModalOpen(true)}>
                                    Editar deportes
                                </Button>
                            </motion.div>
                        </CardFooter>
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
                                <Input id="name" value={userData.name} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input id="email" type="email" value={userData.email} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <Input id="location" value={userData.location} readOnly />
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

                <ProfileEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    profile={userData}
                />
            </motion.div>

            <BottomNavigation />
        </>
    )
}
