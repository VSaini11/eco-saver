import { MongoClient, type Db, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI as string
const dbName = "ecosaver"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!uri) {
    console.error("MONGODB_URI environment variable is not defined")
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  console.log("Attempting to connect to MongoDB...")
  console.log("Environment:", process.env.NODE_ENV)
  console.log("MongoDB URI format check:", uri.startsWith('mongodb'))
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for production
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority'
    })
    
    console.log("Connecting to MongoDB...")
    await client.connect()
    console.log("Connected to MongoDB successfully")

    // Test the connection
    console.log("Testing database connection...")
    const db = client.db(dbName)
    await db.admin().ping()
    console.log("Database ping successful")

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    
    // Clear cache on error
    cachedClient = null
    cachedDb = null
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('authentication failed')) {
        throw new Error("MongoDB authentication failed. Please check your username and password.")
      } else if (error.message.includes('ENOTFOUND')) {
        throw new Error("MongoDB cluster not found. Please check your connection string.")
      } else if (error.message.includes('serverSelectionTimeoutMS')) {
        throw new Error("Cannot connect to MongoDB cluster. Please check your network access settings.")
      }
    }
    
    throw new Error(`Failed to connect to MongoDB: ${error}`)
  }
}

export interface FootprintEntry {
  _id?: ObjectId
  userId: string
  date: string
  transport: number
  electricity: number
  diet: number
  water: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface User {
  _id?: ObjectId
  email: string
  name: string
  createdAt: Date
  totalFootprint: number
  weeklyAverage: number
  monthlyTotal: number
  lastActiveDate: string
}

// Helper functions for database operations
export async function getTodaysFootprint(userId: string): Promise<FootprintEntry | null> {
  try {
    const { db } = await connectToDatabase()
    const today = new Date().toISOString().split("T")[0]
    
    const footprint = await db.collection("footprints").findOne({ 
      userId, 
      date: today 
    })
    
    return footprint as FootprintEntry | null
  } catch (error) {
    console.error("Error fetching today's footprint:", error)
    return null
  }
}

export async function updateUserStats(userId: string): Promise<void> {
  try {
    const { db } = await connectToDatabase()
    
    // Get last 30 days of footprints
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const footprints = await db.collection("footprints")
      .find({ 
        userId,
        date: { $gte: thirtyDaysAgo.toISOString().split("T")[0] }
      })
      .sort({ date: -1 })
      .toArray()
    
    const totalFootprint = footprints.reduce((sum, fp) => sum + fp.total, 0)
    const weeklyFootprints = footprints.slice(0, 7)
    const weeklyAverage = weeklyFootprints.length > 0 
      ? weeklyFootprints.reduce((sum, fp) => sum + fp.total, 0) / weeklyFootprints.length 
      : 0
    const monthlyTotal = totalFootprint
    
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          totalFootprint,
          weeklyAverage,
          monthlyTotal,
          lastActiveDate: new Date().toISOString().split("T")[0]
        } 
      }
    )
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}
