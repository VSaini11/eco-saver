import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, type User } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  console.log("POST /api/users called")
  console.log("Environment:", process.env.NODE_ENV)
  console.log("MongoDB URI exists:", !!process.env.MONGODB_URI)
  console.log("Request headers origin:", request.headers.get('origin'))
  
  try {
    console.log("Attempting to connect to database...")
    const { db } = await connectToDatabase()
    console.log("Database connection successful")
    
    const body = await request.json()
    console.log("Request body:", body)

    const { email, name } = body

    if (!email || !name) {
      console.log("Missing email or name")
      return NextResponse.json({ 
        success: false, 
        error: "Email and name are required",
        debug: { receivedEmail: !!email, receivedName: !!name }
      }, { status: 400 })
    }

    // Check if user already exists
    console.log("Checking for existing user:", email)
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      console.log("User already exists:", existingUser.email)
      return NextResponse.json({ 
        success: true, 
        data: { ...existingUser, _id: existingUser._id.toString() },
        debug: { action: "existing_user_returned" }
      })
    }

    const newUser: User = {
      email,
      name,
      createdAt: new Date(),
      totalFootprint: 0,
      weeklyAverage: 0,
      monthlyTotal: 0,
      lastActiveDate: new Date().toISOString().split("T")[0]
    }

    console.log("Creating new user:", newUser)
    const result = await db.collection("users").insertOne(newUser)
    console.log("User created with ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      data: { ...newUser, _id: result.insertedId.toString() },
      debug: { action: "new_user_created", insertedId: result.insertedId.toString() }
    })
  } catch (error) {
    console.error("Detailed error creating user:", error)
    
    // More specific error messages
    let errorMessage = "Failed to create user"
    let debugInfo: any = {
      nodeEnv: process.env.NODE_ENV,
      mongoUriExists: !!process.env.MONGODB_URI
    }
    
    if (error instanceof Error) {
      debugInfo.errorMessage = error.message
      debugInfo.errorStack = process.env.NODE_ENV === 'development' ? error.stack : undefined
      
      if (error.message.includes('ECONNREFUSED')) {
        errorMessage = "Database connection failed. Please check your MongoDB Atlas configuration."
      } else if (error.message.includes('authentication failed')) {
        errorMessage = "Database authentication failed. Please check your credentials."
      } else if (error.message.includes('MONGODB_URI')) {
        errorMessage = "MongoDB URI is not configured properly."
      } else if (error.message.includes('serverSelectionTimeoutMS')) {
        errorMessage = "Cannot connect to MongoDB cluster. Check network access settings."
      } else {
        errorMessage = `Database error: ${error.message}`
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      debug: debugInfo
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      data: { ...user, _id: user._id.toString() }
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}
