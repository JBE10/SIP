import { NextResponse } from "next/server"
import { getMatchesByUserId, createMatch } from "@/models/Match"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const matches = await getMatchesByUserId(userId)
    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const match = await createMatch(data)
    return NextResponse.json({ success: true, match })
  } catch (error) {
    console.error("Error creating match:", error)
    return NextResponse.json({ error: "Failed to create match" }, { status: 500 })
  }
}

export default { GET, POST }
