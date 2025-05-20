import type { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface Message {
  _id?: ObjectId
  matchId: string
  senderId: string
  receiverId: string
  text: string
  timestamp: Date
  read: boolean
  createdAt?: Date
  updatedAt?: Date
}

export async function getMessagesByMatchId(matchId: string): Promise<Message[]> {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

    return db.collection("messages").find({ matchId }).sort({ timestamp: 1 }).toArray() as Promise<Message[]>
  } catch (error) {
    console.error("Error in getMessagesByMatchId:", error)
    return []
  }
}

export async function createMessage(messageData: Omit<Message, "_id" | "createdAt" | "updatedAt">): Promise<Message> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

  const now = new Date()
  const message = {
    ...messageData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("messages").insertOne(message)

  return {
    ...message,
    _id: result.insertedId,
  }
}

export async function markMessagesAsRead(matchId: string, userId: string): Promise<void> {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

    await db.collection("messages").updateMany(
      {
        matchId,
        receiverId: userId,
        read: false,
      },
      {
        $set: {
          read: true,
          updatedAt: new Date(),
        },
      },
    )
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error)
  }
}
