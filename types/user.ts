export type User = {
    id: number
    name: string
    email: string
    description: string
    sports: string
    profile_picture: string
    age: number
    location: string
    distance?: number // 👈 añadí esto
}
