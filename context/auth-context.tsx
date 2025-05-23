"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => void
    register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // Cargar usuario del localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

        if (isLoggedIn && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Error parsing stored user:", error)
                localStorage.removeItem("user")
                localStorage.removeItem("isLoggedIn")
            }
        }

        setIsLoading(false)
    }, [])

    // Redirigir según el estado de autenticación
    useEffect(() => {
        if (!isLoading) {
            const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password"

            if (!user && !isAuthRoute && pathname !== "/") {
                router.push("/login")
            } else if (user && isAuthRoute) {
                router.push("/swipe")
            }
        }
    }, [user, isLoading, pathname, router])

    const login = async (email: string, password: string): Promise<boolean> => {
        // Simulación de autenticación
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Credenciales de prueba
        if (email === "demo@sportmatch.com" && password === "password") {
            const userData = {
                id: "current-user",
                name: "Tomás",
                email: "demo@sportmatch.com",
            }

            setUser(userData)
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("user", JSON.stringify(userData))
            return true
        }

        return false
    }

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        // Simulación de registro
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const userData = {
            id: "current-user",
            name,
            email,
        }

        setUser(userData)
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("user", JSON.stringify(userData))
        return true
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("user")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
    {!isLoading && children}
    </AuthContext.Provider>
)
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
