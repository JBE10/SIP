import { NextResponse } from "next/server"
import { mockMessages } from "@/data/mock-profiles"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    if (!matchId) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 })
    }

    // Filtrar mensajes por matchId
    const messages = mockMessages.filter((message) => message.matchId === matchId)

    // Ordenar mensajes por timestamp
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const messageData = await request.json()

    // En una aplicación real, aquí guardaríamos el mensaje en la base de datos
    // Para esta versión simplificada, solo devolvemos el mensaje con un ID generado
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    }

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    return NextResponse.json({ error: "Error creating message" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")
    const userId = searchParams.get("userId")

    if (!matchId || !userId) {
      return NextResponse.json({ error: "Match ID and User ID are required" }, { status: 400 })
    }

    // En una aplicación real, aquí actualizaríamos los mensajes en la base de datos
    // Para esta versión simplificada, solo devolvemos un mensaje de éxito

    return NextResponse.json({ success: true, modified_count: 1 })
  } catch (error) {
    return NextResponse.json({ error: "Error marking messages as read" }, { status: 500 })
  }
}
