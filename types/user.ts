export interface User {
    id: number
    email: string
    username: string           // ← nuevo
    full_name: string          // ← nuevo
    age: number
    location: string
    description: string
    sports: string             // Ej: "fútbol,tenis"
    profile_picture?: string
}
