import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      mongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI?.length || 0,
      nodeEnv: process.env.NODE_ENV
    },
    connection: {
      status: 'unknown',
      error: null,
      details: null
    }
  }

  // Test MongoDB connection
  try {
    console.log("Testing MongoDB connection for debug...")
    const { db } = await connectToDatabase()
    
    // Test ping
    await db.admin().ping()
    debugInfo.connection.status = 'success'
    debugInfo.connection.details = 'Connected and pinged successfully'
    
    // Test collection access
    const userCount = await db.collection('users').countDocuments()
    debugInfo.connection.userCount = userCount
    
  } catch (error) {
    console.error("Debug connection error:", error)
    debugInfo.connection.status = 'failed'
    debugInfo.connection.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return NextResponse.json(debugInfo)
}

export async function POST() {
  // Test user creation endpoint
  try {
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      name: "Debug Test User"
    }

    console.log("Testing user creation with:", testUser)
    
    const { db } = await connectToDatabase()
    const result = await db.collection('users').insertOne({
      ...testUser,
      createdAt: new Date(),
      totalFootprint: 0,
      weeklyAverage: 0,
      monthlyTotal: 0,
      lastActiveDate: new Date().toISOString().split("T")[0]
    })

    // Clean up test user
    await db.collection('users').deleteOne({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      message: "User creation test passed",
      testUserId: result.insertedId.toString()
    })
    
  } catch (error) {
    console.error("User creation test failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}
