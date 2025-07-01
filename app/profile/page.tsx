"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { VideoGallery } from "@/components/video-gallery"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { ThemeToggle } from "@/components/theme-toggle"
import { Edit, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useAuth } from "@/context/auth-context"
import { API_ENDPOINTS } from "@/src/config/api"

export default function ProfilePage() {
    const router = useRouter()
    const { user, logout, handleAuthError } = useAuth()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [userData, setUserData] = useState<any>(null)

    useEffect(() => {
        if (!user) {
            router.push("/login")
            return
        }
        setUserData({
            ...user,
            name: user.name || "",
            email: user.email || "",
            location: user.location || "",
            bio: user.bio || "",
            age: user.age || 0,
            sports: user.sports || []
        })
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
                    <ProfilePictureUpload />
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
                                {userData.sports.map((sport: any, index: number) => {
                                    if (typeof sport === "string") {
                                        return (
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
                                        )
                                    }
                                    // Si es objeto
                                    return (
                                        <motion.div
                                            key={sport.sport || index}
                                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {sport.sport} ({sport.level})
                                        </motion.div>
                                    )
                                })}
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
                    <VideoGallery />
                </motion.div>

                <motion.div variants={item}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración de cuenta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" value={userData.name || ""} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input id="email" type="email" value={userData.email || ""} readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación</Label>
                                <Input id="location" value={userData.location || ""} readOnly />
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
