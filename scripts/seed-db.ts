import { MongoClient } from "mongodb"
import { mockProfiles } from "@/data/mock-profiles"

// This script seeds the MongoDB database with initial data
async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local")
  }

  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(process.env.MONGODB_DB_NAME || "sportmatch")

    // Check if profiles collection already has data
    const profilesCount = await db.collection("profiles").countDocuments()

    if (profilesCount === 0) {
      console.log("Seeding profiles collection...")

      // Transform mock profiles to MongoDB format
      const profiles = mockProfiles.map((profile) => ({
        name: profile.name,
        age: profile.age,
        location: profile.location,
        bio: profile.bio,
        sports: profile.sports,
        distance: profile.distance,
        profilePicture: profile.profilePicture,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      await db.collection("profiles").insertMany(profiles)
      console.log(`Inserted ${profiles.length} profiles`)
    } else {
      console.log(`Profiles collection already has ${profilesCount} documents. Skipping seed.`)
    }

    console.log("Database seeding completed")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

// Run the seed function
seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
