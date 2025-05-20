import { NextResponse } from "next/server"
import { mockMatches, mockProfiles } from "@/data/mock-profiles"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Filtrar matches por userId
    const matches = mockMatches.filter((match) => match.user1Id === userId || match.user2Id === userId)

    // Enriquecer los matches con información de los perfiles
    const enrichedMatches = matches.map((match) => {
      const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id
      const otherUserProfile = mockProfiles.find((profile) => profile.id === otherUserId)

      return {
        ...match,
        otherUser: otherUserProfile || { name: "Usuario desconocido" },
      }
    })

    return NextResponse.json({ matches: enrichedMatches })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching matches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const matchData = await request.json()

    // En una aplicación real, aquí guardaríamos el match en la base de datos
    // Para esta versión simplificada, solo devolvemos el match con un ID generado
    const newMatch = {
      ...matchData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, match: newMatch })
  } catch (error) {
    return NextResponse.json({ error: "Error creating match" }, { status: 500 })
  }
}
