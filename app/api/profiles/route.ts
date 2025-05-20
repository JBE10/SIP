import { NextResponse } from "next/server"
import { mockProfiles } from "@/data/mock-profiles"

export async function GET() {
  try {
    return NextResponse.json({ profiles: mockProfiles })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching profiles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const profile = await request.json()
    // En una aplicación real, aquí guardaríamos el perfil en la base de datos
    // Para esta versión simplificada, solo devolvemos el perfil con un ID generado
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, profile: newProfile })
  } catch (error) {
    return NextResponse.json({ error: "Error creating profile" }, { status: 500 })
  }
}
