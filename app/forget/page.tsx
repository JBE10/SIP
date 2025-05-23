"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Handshake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // Simulación de envío de correo
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setIsSubmitted(true)
        } catch (err) {
            setError("Error al enviar el correo. Inténtalo de nuevo.")
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
                    <CardTitle className="text-2xl font-bold">Recuperar contraseña</CardTitle>
                    <CardDescription>Te enviaremos un enlace para restablecer tu contraseña</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

                    {isSubmitted ? (
                        <div className="bg-green-100 text-green-800 p-4 rounded-md text-center">
                            <p className="font-medium">¡Correo enviado!</p>
                            <p className="mt-2">
                                Hemos enviado un enlace de recuperación a {email}. Por favor, revisa tu bandeja de entrada.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-center text-muted-foreground">
                        <Link href="/login" className="text-primary hover:underline">
                            Volver a inicio de sesión
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
