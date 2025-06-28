"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car } from "lucide-react"

const TRANSPORT_EMISSIONS = {
  car: 0.192,
  bike: 0.05,
  bus: 0.089,
  train: 0.041,
  flight_short: 0.15,
  flight_long: 0.11,
  walk: 0,
}

interface TransportFormProps {
  onUpdate: (value: number) => void
  initialValue?: number
}

export function TransportForm({ onUpdate, initialValue = 0 }: TransportFormProps) {
  const [entries, setEntries] = useState([{ mode: "car", distance: 0 }])

  // Initialize with calculated entries if initialValue exists
  useEffect(() => {
    if (initialValue > 0) {
      // For simplicity, assume car transport if there's an initial value
      const calculatedDistance = Math.round(initialValue / TRANSPORT_EMISSIONS.car)
      setEntries([{ mode: "car", distance: calculatedDistance }])
    }
  }, [initialValue])

  const addEntry = () => {
    setEntries([...entries, { mode: "car", distance: 0 }])
  }

  const updateEntry = (index: number, field: string, value: string | number) => {
    const updated = [...entries]
    updated[index] = { ...updated[index], [field]: value }
    setEntries(updated)

    const total = updated.reduce((sum, entry) => {
      return sum + TRANSPORT_EMISSIONS[entry.mode as keyof typeof TRANSPORT_EMISSIONS] * Number(entry.distance)
    }, 0)
    onUpdate(total)
  }

  const removeEntry = (index: number) => {
    const updated = entries.filter((_, i) => i !== index)
    setEntries(updated)

    const total = updated.reduce((sum, entry) => {
      return sum + TRANSPORT_EMISSIONS[entry.mode as keyof typeof TRANSPORT_EMISSIONS] * Number(entry.distance)
    }, 0)
    onUpdate(total)
  }

  return (
    <Card className="gradient-card gradient-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-high-contrast">
          <Car className="h-5 w-5" />
          Transportation
        </CardTitle>
        <CardDescription className="text-gray-300">Track your daily travel and commute</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor={`mode-${index}`} className="text-gray-200">
                Transport Mode
              </Label>
              <Select value={entry.mode} onValueChange={(value) => updateEntry(index, "mode", value)}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-purple-400 focus:ring-purple-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="car">Car (Petrol)</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="flight_short">Flight (Short)</SelectItem>
                  <SelectItem value="flight_long">Flight (Long)</SelectItem>
                  <SelectItem value="walk">Walking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor={`distance-${index}`} className="text-gray-200">
                Distance (km)
              </Label>
              <Input
                id={`distance-${index}`}
                type="number"
                value={entry.distance}
                onChange={(e) => updateEntry(index, "distance", Number(e.target.value))}
                placeholder="0"
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            {entries.length > 1 && (
              <button onClick={() => removeEntry(index)} className="px-2 py-1 text-red-400 hover:bg-red-500/20 rounded text-high-contrast">
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addEntry}
          className="btn-primary w-full py-2"
        >
          + Add Transport Mode
        </button>

        <div className="mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-3 rounded-lg border border-purple-400/30">
          <p className="text-sm text-purple-200">
            <strong>Daily Transport Footprint:</strong>{" "}
            {entries
              .reduce((sum, entry) => {
                return sum + TRANSPORT_EMISSIONS[entry.mode as keyof typeof TRANSPORT_EMISSIONS] * Number(entry.distance)
              }, 0)
              .toFixed(2)}{" "}
            kg CO₂e
          </p>
          <p className="text-xs text-purple-300 mt-1">
            {initialValue > 0 ? "✓ Auto-saved from previous entry" : "Changes saved automatically"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
