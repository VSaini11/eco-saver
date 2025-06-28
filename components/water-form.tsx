"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplets } from "lucide-react"

interface WaterFormProps {
  onUpdate: (value: number) => void
  initialValue?: number
}

export function WaterForm({ onUpdate, initialValue = 0 }: WaterFormProps) {
  const [usage, setUsage] = useState({
    showerMinutes: 0,
    clothesLoads: 0,
  })

  // Initialize with calculated values if initialValue exists
  useEffect(() => {
    if (initialValue > 0) {
      // For simplicity, assume all usage is shower time
      const calculatedMinutes = Math.round(initialValue / 0.6)
      setUsage({
        showerMinutes: calculatedMinutes,
        clothesLoads: 0,
      })
    }
  }, [initialValue])

  const updateUsage = (field: string, value: number) => {
    const updated = { ...usage, [field]: value }
    setUsage(updated)

    // Calculate emissions
    const showerEmissions = updated.showerMinutes * 0.6 // 0.6 kg CO₂e per minute
    const clothesEmissions = updated.clothesLoads * 0.7 // 0.7 kg CO₂e per load

    const total = showerEmissions + clothesEmissions
    onUpdate(total)
  }

  return (
    <Card className="gradient-card gradient-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-high-contrast">
          <Droplets className="h-5 w-5" />
          Water Usage
        </CardTitle>
        <CardDescription className="text-gray-300">Your daily water consumption carbon footprint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="shower-minutes" className="text-gray-200">
            Shower Time (minutes)
          </Label>
          <Input
            id="shower-minutes"
            type="number"
            value={usage.showerMinutes}
            onChange={(e) => updateUsage("showerMinutes", Number(e.target.value))}
            placeholder="Daily shower time"
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
          />
          <p className="text-xs text-gray-400 mt-1">Hot water heating contributes to carbon emissions</p>
        </div>

        <div>
          <Label htmlFor="clothes-loads" className="text-gray-200">
            Laundry Loads
          </Label>
          <Input
            id="clothes-loads"
            type="number"
            value={usage.clothesLoads}
            onChange={(e) => updateUsage("clothesLoads", Number(e.target.value))}
            placeholder="Number of loads washed"
            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
          />
          <p className="text-xs text-gray-400 mt-1">Washing machines use energy for heating water</p>
        </div>

        <div className="mt-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/30">
          <p className="text-sm text-cyan-200">
            <strong>Daily Water Footprint:</strong> {(usage.showerMinutes * 0.6 + usage.clothesLoads * 0.7).toFixed(2)} kg CO₂e
          </p>
          <p className="text-xs text-cyan-300 mt-1">
            {initialValue > 0 ? "✓ Auto-saved from previous entry" : "Changes saved automatically"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
