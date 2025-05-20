import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface Match {
  _id?: ObjectId
  user1Id: string
  user2Id: string
  timestamp: Date
  hasChat: boolean
  createdAt?: Date
  updatedAt?: Date
}

export async function getMatchesByUserId(userId: string): Promise<Match[]> {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

    return db
      .collection("matches")
      .find({
        $or: [{ user1Id: userId }, { user2Id: userId }],
      })
      .sort({ createdAt: -1 })
      .toArray() as Promise<Match[]>
  } catch (error) {
    console.error("Error in getMatchesByUserId:", error)
    return []
  }
}

export async function createMatch(matchData: Omit<Match, "_id" | "createdAt" | "updatedAt">): Promise<Match> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

  const now = new Date()
  const match = {
    ...matchData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("matches").insertOne(match)

  return {
    ...match,
    _id: result.insertedId,
  }
}

export async function getMatchById(id: string): Promise<Match | null> {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

    if (ObjectId.isValid(id)) {
      return db.collection("matches").findOne({ _id: new ObjectId(id) }) as Promise<Match | null>
    }

    return null
  } catch (error) {
    console.error("Error in getMatchById:", error)
    return null
  }
}
