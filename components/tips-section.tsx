"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Leaf, Zap, Car, Droplets } from "lucide-react"

interface TipsSectionProps {
  currentFootprint: {
    transport: number
    electricity: number
    diet: number
    water: number
    total: number
  }
}

export function TipsSection({ currentFootprint }: TipsSectionProps) {
  const getPersonalizedTips = () => {
    const tips = []

    if (currentFootprint.transport > 5) {
      tips.push({
        category: "Transport",
        icon: <Car className="h-4 w-4" />,
        tip: "Consider using public transport or cycling for short trips",
        impact: "Can save up to 3.5 kg CO₂e per day",
        difficulty: "Easy",
      })
    }

    if (currentFootprint.electricity > 3) {
      tips.push({
        category: "Electricity",
        icon: <Zap className="h-4 w-4" />,
        tip: "Switch to LED bulbs and unplug devices when not in use",
        impact: "Can save up to 1.2 kg CO₂e per day",
        difficulty: "Easy",
      })
    }

    if (currentFootprint.diet > 5) {
      tips.push({
        category: "Diet",
        icon: <Leaf className="h-4 w-4" />,
        tip: "Try having one meat-free day per week",
        impact: "Can save up to 2.2 kg CO₂e per day",
        difficulty: "Medium",
      })
    }

    if (currentFootprint.water > 2) {
      tips.push({
        category: "Water",
        icon: <Droplets className="h-4 w-4" />,
        tip: "Take shorter showers and use cold water when possible",
        impact: "Can save up to 1.8 kg CO₂e per day",
        difficulty: "Easy",
      })
    }

    return tips
  }

  const generalTips = [
    {
      category: "Energy",
      icon: <Zap className="h-4 w-4" />,
      tip: "Use a programmable thermostat to optimize heating/cooling",
      impact: "Can save up to 2.0 kg CO₂e per day",
      difficulty: "Medium",
    },
    {
      category: "Transport",
      icon: <Car className="h-4 w-4" />,
      tip: "Combine multiple errands into one trip",
      impact: "Can save up to 1.5 kg CO₂e per day",
      difficulty: "Easy",
    },
    {
      category: "Consumption",
      icon: <Leaf className="h-4 w-4" />,
      tip: "Buy local and seasonal produce when possible",
      impact: "Can save up to 0.8 kg CO₂e per day",
      difficulty: "Easy",
    },
    {
      category: "Waste",
      icon: <Lightbulb className="h-4 w-4" />,
      tip: "Recycle and compost to reduce landfill waste",
      impact: "Can save up to 0.5 kg CO₂e per day",
      difficulty: "Easy",
    },
  ]

  const personalizedTips = getPersonalizedTips()
  const allTips = [...personalizedTips, ...generalTips]

  return (
    <div className="space-y-6">
      {personalizedTips.length > 0 && (
        <Card className="gradient-card gradient-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-high-contrast">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Personalized Tips
            </CardTitle>
            <CardDescription className="text-gray-300">Based on your current footprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {personalizedTips.map((tip, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/40 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-yellow-400">{tip.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-yellow-200 border-yellow-400 bg-black/20">
                          {tip.category}
                        </Badge>
                        <Badge variant={tip.difficulty === "Easy" ? "default" : "secondary"} className="bg-emerald-600 text-white border-emerald-500">
                          {tip.difficulty}
                        </Badge>
                      </div>
                      <p className="font-medium mb-1 text-high-contrast">{tip.tip}</p>
                      <p className="text-sm text-green-300">{tip.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">General Eco Tips</CardTitle>
          <CardDescription className="text-gray-300">Simple ways to reduce your environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {generalTips.map((tip, index) => (
              <div key={index} className="p-4 border rounded-lg bg-black/20 border-white/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="text-green-400">{tip.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-gray-200 border-gray-400 bg-black/20">
                        {tip.category}
                      </Badge>
                      <Badge variant={tip.difficulty === "Easy" ? "default" : "secondary"} className="bg-emerald-600 text-white border-emerald-500">
                        {tip.difficulty}
                      </Badge>
                    </div>
                    <p className="font-medium mb-1 text-high-contrast">{tip.tip}</p>
                    <p className="text-sm text-green-300">{tip.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Quick Facts</CardTitle>
          <CardDescription className="text-gray-300">Did you know?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-lg border border-blue-400/40 backdrop-blur-sm">
              <p className="text-sm text-blue-200 text-shadow">🌍 The average person produces about 16 tons of CO₂ per year</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500/30 to-green-600/30 rounded-lg border border-green-400/40 backdrop-blur-sm">
              <p className="text-sm text-green-200 text-shadow">🚲 Cycling 10km instead of driving saves about 2.5kg of CO₂</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 rounded-lg border border-yellow-400/40 backdrop-blur-sm">
              <p className="text-sm text-yellow-200 text-shadow">💡 LED bulbs use 75% less energy than incandescent bulbs</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500/30 to-purple-600/30 rounded-lg border border-purple-400/40 backdrop-blur-sm">
              <p className="text-sm text-purple-200 text-shadow">
                🥗 A plant-based meal produces 10x less CO₂ than a meat-based meal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
