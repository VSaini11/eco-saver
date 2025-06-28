"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"

const ELECTRICITY_FACTOR = 0.82 // kg CO₂e per kWh (India average)

interface ElectricityFormProps {
  onUpdate: (value: number) => void
  initialValue?: number
}

export function ElectricityForm({ onUpdate, initialValue = 0 }: ElectricityFormProps) {
  const [usage, setUsage] = useState({
    homeElectricity: 0,
    fanHours: 0,
    laptopHours: 0,
  })

  // Initialize with calculated values if initialValue exists
  useEffect(() => {
    if (initialValue > 0) {
      // For simplicity, assume all usage is home electricity
      const calculatedUsage = Math.round((initialValue / ELECTRICITY_FACTOR) * 100) / 100
      setUsage({
        homeElectricity: calculatedUsage,
        fanHours: 0,
        laptopHours: 0,
      })
    }
  }, [initialValue])

  const updateUsage = (field: string, value: number) => {
    const updated = { ...usage, [field]: value }
    setUsage(updated)

    // Calculate total emissions
    const homeEmissions = updated.homeElectricity * ELECTRICITY_FACTOR
    const fanEmissions = updated.fanHours * 0.075 * ELECTRICITY_FACTOR // 75W fan
    const laptopEmissions = updated.laptopHours * 0.05 * ELECTRICITY_FACTOR // 50W laptop

    const total = homeEmissions + fanEmissions + laptopEmissions
    onUpdate(total)
  }

  return (
    <Card className="gradient-card gradient-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-high-contrast">
          <Zap className="h-5 w-5" />
          Electricity Usage
        </CardTitle>
        <CardDescription className="text-gray-300">Track your daily electricity consumption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="home-electricity" className="text-gray-200">
            Home Electricity (kWh)
          </Label>
          <Input
            id="home-electricity"
            type="number"
            value={usage.homeElectricity}
            onChange={(e) => updateUsage("homeElectricity", Number(e.target.value))}
            placeholder="Daily kWh usage"
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-1">Check your electricity meter or estimate based on appliances</p>
        </div>

        <div>
          <Label htmlFor="fan-hours" className="text-gray-200">
            Fan Usage (hours)
          </Label>
          <Input
            id="fan-hours"
            type="number"
            value={usage.fanHours}
            onChange={(e) => updateUsage("fanHours", Number(e.target.value))}
            placeholder="Hours of fan usage"
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400"
          />
        </div>

        <div>
          <Label htmlFor="laptop-hours" className="text-gray-200">
            Laptop Usage (hours)
          </Label>
          <Input
            id="laptop-hours"
            type="number"
            value={usage.laptopHours}
            onChange={(e) => updateUsage("laptopHours", Number(e.target.value))}
            placeholder="Hours of laptop usage"
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400"
          />
        </div>

        <div className="mt-4 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm p-3 rounded-lg border border-orange-400/30">
          <p className="text-sm text-orange-200">
            <strong>Daily Electricity Footprint:</strong>{" "}
            {(
              usage.homeElectricity * ELECTRICITY_FACTOR +
              usage.fanHours * 0.075 * ELECTRICITY_FACTOR +
              usage.laptopHours * 0.05 * ELECTRICITY_FACTOR
            ).toFixed(2)}{" "}
            kg CO₂e
          </p>
          <p className="text-xs text-orange-300 mt-1">
            {initialValue > 0 ? "✓ Auto-saved from previous entry" : "Changes saved automatically"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
