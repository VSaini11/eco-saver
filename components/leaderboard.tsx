"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  userId: string
  name: string
  weeklyAverage: number
  rank: number
  totalEntries: number
}

interface LeaderboardProps {
  userId?: string
}

export function Leaderboard({ userId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/leaderboard")
      const result = await response.json()

      if (result.success) {
        setLeaderboard(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch leaderboard")
      console.error("Error fetching leaderboard:", err)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />
      case 3:
        return <Award className="h-5 w-5 text-amber-500" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>
    }
  }

  const userEntry = leaderboard.find((entry) => entry.userId === userId)

  if (loading) {
    return (
      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Global Leaderboard</CardTitle>
          <CardDescription className="text-gray-300">Loading leaderboard...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Global Leaderboard</CardTitle>
          <CardDescription className="text-red-400">Error: {error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Global Leaderboard</CardTitle>
          <CardDescription className="text-gray-300">Weekly average carbon footprint (kg CO₂e per day)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((user, index) => (
              <div
                key={user.userId}
                className={`flex items-center justify-between p-3 rounded-lg border backdrop-blur-sm ${
                  user.userId === userId 
                    ? "bg-gradient-to-r from-blue-500/30 to-blue-600/30 border-blue-400/50" 
                    : "bg-black/20 border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(user.rank)}
                  <div>
                    <div className={`font-medium text-high-contrast ${user.userId === userId ? "text-blue-200" : ""}`}>
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-300">{user.weeklyAverage} kg CO₂e/day</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-200 border-gray-400 bg-black/20">
                    {user.totalEntries} days tracked
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-card gradient-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-high-contrast">Your Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{userEntry?.rank || "N/A"}</div>
            <p className="text-sm text-gray-300">Out of {leaderboard.length} users</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-high-contrast">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{userEntry?.weeklyAverage?.toFixed(1) || "N/A"}</div>
            <p className="text-sm text-gray-300">kg CO₂e/day avg</p>
          </CardContent>
        </Card>

        <Card className="gradient-card gradient-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-high-contrast">Days Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">{userEntry?.totalEntries || 0}</div>
            <p className="text-sm text-gray-300">this period</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
