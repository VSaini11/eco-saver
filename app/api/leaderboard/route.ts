import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Calculate weekly averages for all users
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const leaderboard = await db
      .collection("footprints")
      .aggregate([
        {
          $match: {
            date: { $gte: oneWeekAgo.toISOString().split("T")[0] },
          },
        },
        {
          $group: {
            _id: "$userId",
            weeklyAverage: { $avg: "$total" },
            totalEntries: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            userId: "$_id",
            name: { $ifNull: ["$user.name", "Anonymous"] },
            weeklyAverage: { $round: ["$weeklyAverage", 2] },
            totalEntries: 1,
          },
        },
        {
          $sort: { weeklyAverage: 1 },
        },
        {
          $limit: 50,
        },
      ])
      .toArray()

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

    return NextResponse.json({ success: true, data: rankedLeaderboard })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
