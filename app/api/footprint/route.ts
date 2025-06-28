import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, type FootprintEntry, updateUserStats } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const { userId, date, transport, electricity, diet, water } = body
    const total = transport + electricity + diet + water

    const footprintEntry: FootprintEntry = {
      userId,
      date,
      transport,
      electricity,
      diet,
      water,
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Upsert the entry for the specific date
    const result = await db
      .collection("footprints")
      .updateOne({ userId, date }, { $set: footprintEntry }, { upsert: true })

    // Update user statistics
    await updateUserStats(userId)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error saving footprint:", error)
    return NextResponse.json({ success: false, error: "Failed to save footprint" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "30")
    const today = searchParams.get("today") // If true, get today's data specifically

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    if (today === "true") {
      // Get today's specific footprint
      const todayDate = new Date().toISOString().split("T")[0]
      const todayFootprint = await db.collection("footprints").findOne({ userId, date: todayDate })

      return NextResponse.json({
        success: true,
        data: todayFootprint || {
          userId,
          date: todayDate,
          transport: 0,
          electricity: 0,
          diet: 0,
          water: 0,
          total: 0,
        },
      })
    }

    const footprints = await db.collection("footprints").find({ userId }).sort({ date: -1 }).limit(limit).toArray()

    return NextResponse.json({ success: true, data: footprints })
  } catch (error) {
    console.error("Error fetching footprints:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch footprints" }, { status: 500 })
  }
}
