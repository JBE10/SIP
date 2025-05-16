import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export interface Profile {
  _id?: ObjectId
  name: string
  age: number
  location: string
  bio: string
  sports: string[]
  distance: number
  profilePicture: string
  createdAt?: Date
  updatedAt?: Date
}

export async function getProfiles(): Promise<Profile[]> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

  return db.collection("profiles").find({}).sort({ createdAt: -1 }).toArray() as Promise<Profile[]>
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

  if (ObjectId.isValid(id)) {
    return db.collection("profiles").findOne({ _id: new ObjectId(id) }) as Promise<Profile | null>
  }

  return null
}

export async function createProfile(profileData: Omit<Profile, "_id" | "createdAt" | "updatedAt">): Promise<Profile> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

  const now = new Date()
  const profile = {
    ...profileData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("profiles").insertOne(profile)

  return {
    ...profile,
    _id: result.insertedId,
  }
}

export async function updateProfile(id: string, profileData: Partial<Profile>): Promise<Profile | null> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

  if (!ObjectId.isValid(id)) {
    return null
  }

  const result = await db.collection("profiles").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...profileData,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  return result as unknown as Profile
}
