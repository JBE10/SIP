import { NextResponse } from "next/server"
import { getProfileById } from "@/models/Profile"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const profile = await getProfileById(id)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export default { GET }
