"use client"

import { useState, useEffect } from "react"

interface User {
  _id?: string
  email: string
  name: string
  createdAt?: Date
  totalFootprint: number
  weeklyAverage: number
  monthlyTotal: number
  lastActiveDate: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const createOrGetUser = async (email: string, name: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.data)
        localStorage.setItem("ecosaver-user", JSON.stringify(result.data))
        return result.data
      } else {
        setError(result.error)
        return null
      }
    } catch (err) {
      setError("Failed to create or get user")
      console.error("Error with user:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserByEmail = async (email: string) => {
    try {
      const response = await fetch(`/api/users?email=${email}`)
      const result = await response.json()

      if (result.success) {
        setUser(result.data)
        localStorage.setItem("ecosaver-user", JSON.stringify(result.data))
        return result.data
      } else {
        return null
      }
    } catch (err) {
      console.error("Error fetching user:", err)
      return null
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ecosaver-user")
    setError(null)
  }

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem("ecosaver-user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (err) {
        console.error("Error parsing saved user:", err)
      }
    }
    setLoading(false)
  }, [])

  return {
    user,
    loading,
    error,
    createOrGetUser,
    getUserByEmail,
    setUser,
    logout,
  }
}
