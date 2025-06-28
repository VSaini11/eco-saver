"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Utensils } from "lucide-react"

const DIET_EMISSIONS = {
  vegan: 2.5,
  vegetarian: 3.0,
  mixed: 5.0,
  heavy_meat: 7.2,
}

interface DietFormProps {
  onUpdate: (value: number) => void
  initialValue?: number
}

export function DietForm({ onUpdate, initialValue = 0 }: DietFormProps) {
  const [dietType, setDietType] = useState("mixed")

  // Set initial diet type based on initialValue
  useEffect(() => {
    if (initialValue > 0) {
      const foundType = Object.entries(DIET_EMISSIONS).find(([_, value]) => value === initialValue)
      if (foundType) {
        setDietType(foundType[0])
      }
    }
  }, [initialValue])

  const updateDiet = (value: string) => {
    setDietType(value)
    onUpdate(DIET_EMISSIONS[value as keyof typeof DIET_EMISSIONS])
  }

  return (
    <Card className="gradient-card gradient-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-high-contrast">
          <Utensils className="h-5 w-5" />
          Diet
        </CardTitle>
        <CardDescription className="text-gray-300">Your daily dietary carbon footprint</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={dietType} onValueChange={updateDiet}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegan" id="vegan" className="border-white/40 text-emerald-400" />
            <Label htmlFor="vegan" className="flex-1 text-gray-200">
              <div>
                <div className="font-medium text-high-contrast">Vegan</div>
                <div className="text-sm text-gray-400">2.5 kg CO₂e/day</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegetarian" id="vegetarian" className="border-white/40 text-emerald-400" />
            <Label htmlFor="vegetarian" className="flex-1 text-gray-200">
              <div>
                <div className="font-medium text-high-contrast">Vegetarian</div>
                <div className="text-sm text-gray-400">3.0 kg CO₂e/day</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="mixed" className="border-white/40 text-emerald-400" />
            <Label htmlFor="mixed" className="flex-1 text-gray-200">
              <div>
                <div className="font-medium text-high-contrast">Mixed Diet</div>
                <div className="text-sm text-gray-400">5.0 kg CO₂e/day</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="heavy_meat" id="heavy_meat" className="border-white/40 text-emerald-400" />
            <Label htmlFor="heavy_meat" className="flex-1 text-gray-200">
              <div>
                <div className="font-medium text-high-contrast">Heavy Meat Eater</div>
                <div className="text-sm text-gray-400">7.2 kg CO₂e/day</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <div className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-3 rounded-lg border border-green-400/30">
          <p className="text-sm text-green-200">
            <strong>Daily Diet Footprint:</strong> {DIET_EMISSIONS[dietType as keyof typeof DIET_EMISSIONS]} kg CO₂e
          </p>
          <p className="text-xs text-green-300 mt-1">
            {initialValue > 0 ? "✓ Auto-saved from previous entry" : "Changes saved automatically"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
