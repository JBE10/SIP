import { NextResponse } from "next/server"
import { getMessagesByMatchId, createMessage, markMessagesAsRead } from "@/models/Message"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    if (!matchId) {
      return NextResponse.json({ error: "Match ID is required" }, { status: 400 })
    }

    const messages = await getMessagesByMatchId(matchId)
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const message = await createMessage(data)
    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
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

    await markMessagesAsRead(matchId, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 })
  }
}

export default { GET, POST, PATCH }
