import { NextResponse } from "next/server"
import { mockProfiles } from "@/data/mock-profiles"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const profile = mockProfiles.find((p) => p.id === id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updatedData = await request.json()

    // En una aplicación real, aquí actualizaríamos el perfil en la base de datos
    // Para esta versión simplificada, solo devolvemos los datos actualizados
    const updatedProfile = {
      ...updatedData,
      id,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, profile: updatedProfile })
  } catch (error) {
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 })
  }
}
