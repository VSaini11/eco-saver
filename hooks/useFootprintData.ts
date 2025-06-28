"use client"

import { useState, useEffect } from "react"

interface DailyFootprint {
  _id?: string
  userId: string
  date: string
  transport: number
  electricity: number
  diet: number
  water: number
  total: number
  createdAt?: Date
  updatedAt?: Date
}

export function useFootprintData(userId: string) {
  const [footprints, setFootprints] = useState<DailyFootprint[]>([])
  const [todayFootprint, setTodayFootprint] = useState<DailyFootprint>({
    userId: "",
    date: new Date().toISOString().split("T")[0],
    transport: 0,
    electricity: 0,
    diet: 0,
    water: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTodayFootprint = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/api/footprint?userId=${userId}&today=true`)
      const result = await response.json()

      if (result.success) {
        setTodayFootprint(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch today's footprint data")
      console.error("Error fetching today's footprint:", err)
    }
  }

  const fetchFootprints = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/footprint?userId=${userId}&limit=30`)
      const result = await response.json()

      if (result.success) {
        setFootprints(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Failed to fetch footprint data")
      console.error("Error fetching footprints:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveFootprint = async (footprintData: Omit<DailyFootprint, "_id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/footprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(footprintData),
      })

      const result = await response.json()

      if (result.success) {
        // Update today's footprint in state
        setTodayFootprint(footprintData)
        // Refresh the historical data after saving
        await fetchFootprints()
        return true
      } else {
        setError(result.error)
        return false
      }
    } catch (err) {
      setError("Failed to save footprint data")
      console.error("Error saving footprint:", err)
      return false
    }
  }

  const updateTodayFootprint = (category: keyof Omit<DailyFootprint, "_id" | "userId" | "date" | "total" | "createdAt" | "updatedAt">, value: number) => {
    const updated = { ...todayFootprint, [category]: value }
    updated.total = updated.transport + updated.electricity + updated.diet + updated.water
    setTodayFootprint(updated)
    
    // Auto-save after a short delay
    const timeoutId = setTimeout(() => {
      saveFootprint(updated)
    }, 2000) // Save 2 seconds after the last change
    
    return () => clearTimeout(timeoutId)
  }

  useEffect(() => {
    if (userId) {
      fetchFootprints()
      fetchTodayFootprint()
    }
  }, [userId])

  return {
    footprints,
    todayFootprint,
    loading,
    error,
    saveFootprint,
    updateTodayFootprint,
    refetch: fetchFootprints,
  }
}
