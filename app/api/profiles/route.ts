import { NextResponse } from "next/server"
import { getProfiles, createProfile } from "@/models/Profile"

export async function GET() {
  try {
    const profiles = await getProfiles()
    return NextResponse.json({ profiles })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const profile = await createProfile(data)
    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}

export default { GET, POST }
