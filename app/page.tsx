"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, TrendingDown, Users, Lightbulb, User, LogOut } from "lucide-react"
import { TransportForm } from "@/components/transport-form"
import { ElectricityForm } from "@/components/electricity-form"
import { DietForm } from "@/components/diet-form"
import { WaterForm } from "@/components/water-form"
import { ProgressCharts } from "@/components/progress-charts"
import { Leaderboard } from "@/components/leaderboard"
import { TipsSection } from "@/components/tips-section"
import { useUser } from "@/hooks/useUser"
import { useFootprintData } from "@/hooks/useFootprintData"

export default function EcoSaverApp() {
  const { user, loading: userLoading, createOrGetUser, logout } = useUser()
  const { 
    footprints, 
    todayFootprint,
    loading: dataLoading, 
    saveFootprint,
    updateTodayFootprint 
  } = useFootprintData(user?._id || "")
  const [showUserForm, setShowUserForm] = useState(false)
  const [userForm, setUserForm] = useState({ name: "", email: "" })

  useEffect(() => {
    if (!userLoading && !user) {
      setShowUserForm(true)
    }
  }, [user, userLoading])

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = await createOrGetUser(userForm.email, userForm.name)
    if (newUser) {
      setShowUserForm(false)
    }
  }

  const updateFootprint = (category: string, value: number) => {
    updateTodayFootprint(category as any, value)
  }

  const handleLogout = () => {
    logout()
    setShowUserForm(true)
    setUserForm({ name: "", email: "" })
  }

  const saveTodayFootprint = async () => {
    if (!user) return

    const today = new Date().toISOString().split("T")[0]
    const success = await saveFootprint({
      userId: user._id!,
      date: today,
      transport: todayFootprint.transport,
      electricity: todayFootprint.electricity,
      diet: todayFootprint.diet,
      water: todayFootprint.water,
      total: todayFootprint.total,
    })

    if (success) {
      // Data is automatically updated by the hook
      console.log("Footprint saved successfully!")
    }
  }

  const weeklyAverage = footprints.slice(0, 7).reduce((sum, day) => sum + day.total, 0) / Math.min(7, footprints.length) || 0
  const monthlyTotal = user?.monthlyTotal || footprints.slice(0, 30).reduce((sum, day) => sum + day.total, 0)

  if (showUserForm) {
    return (
      <div className="min-h-screen gradient-bg-main flex items-center justify-center p-4">
        <Card className="w-full max-w-md gradient-card gradient-card-hover">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-emerald-400 glow-emerald" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                EcoSaver
              </h1>
            </div>
            <CardTitle className="text-white">Welcome to EcoSaver!</CardTitle>
            <CardDescription className="text-gray-300">
              Let's get started with your carbon footprint tracking journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                  className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-primary text-high-contrast"
              >
                Get Started
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userLoading || dataLoading) {
    return (
      <div className="min-h-screen gradient-bg-main flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-emerald-400 animate-pulse mx-auto mb-4 glow-emerald" />
          <p className="text-white text-lg font-medium">Loading your EcoSaver data...</p>
          <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg-main p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-emerald-400 glow-emerald" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              EcoSaver
            </h1>
          </div>
          <p className="text-lg text-gray-300">Track your carbon footprint and make a difference</p>
          <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4 px-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-center">Welcome, {user?.name}!</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-black/60 text-white border-white/40 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 hover:text-white hover:border-red-500/50 text-sm flex items-center gap-2 font-bold px-4 py-2 backdrop-blur-sm high-contrast-text force-white-text"
            >
              <LogOut className="h-4 w-4 text-white" />
              <span className="text-white font-bold">Logout</span>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-card gradient-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Today's Footprint</CardTitle>
              <Leaf className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-high-contrast">{todayFootprint.total.toFixed(2)} kg</div>
              <p className="text-xs text-gray-300">CO₂ equivalent</p>
            </CardContent>
          </Card>

          <Card className="gradient-card gradient-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Weekly Average</CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-high-contrast">{(weeklyAverage || 0).toFixed(2)} kg</div>
              <p className="text-xs text-gray-300">Per day</p>
            </CardContent>
          </Card>

          <Card className="gradient-card gradient-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Monthly Total</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-high-contrast">{monthlyTotal.toFixed(2)} kg</div>
              <p className="text-xs text-gray-300">This month</p>
            </CardContent>
          </Card>

          <Card className="gradient-card gradient-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-high-contrast">Status</CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <Badge variant={weeklyAverage < 15 ? "default" : weeklyAverage < 25 ? "secondary" : "destructive"}>
                {weeklyAverage < 15 ? "Excellent" : weeklyAverage < 25 ? "Good" : "Needs Work"}
              </Badge>
              <p className="text-xs text-gray-400 mt-1">Environmental impact</p>
            </CardContent>
          </Card>
        </div>

        <div className="tabs-container">
          <Tabs defaultValue="input" className="space-y-6">
            <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
              <TabsList className="inline-flex h-auto p-0 bg-transparent border-none">
                <div className="tabs-list-wrapper">
                  <div className="tabs-grid">
                    <TabsTrigger 
                      value="input" 
                      className="tab-trigger-enhanced"
                    >
                      Daily Input
                    </TabsTrigger>
                    <TabsTrigger 
                      value="progress" 
                      className="tab-trigger-enhanced"
                    >
                      Progress
                    </TabsTrigger>
                    <TabsTrigger 
                      value="leaderboard" 
                      className="tab-trigger-enhanced"
                    >
                      Leaderboard
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tips" 
                      className="tab-trigger-enhanced"
                    >
                      Eco Tips
                    </TabsTrigger>
                  </div>
                </div>
              </TabsList>
            </div>

            <TabsContent value="input" className="tab-content-wrapper">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransportForm 
                  onUpdate={(value) => updateFootprint("transport", value)} 
                  initialValue={todayFootprint.transport}
                />
                <ElectricityForm 
                  onUpdate={(value) => updateFootprint("electricity", value)}
                  initialValue={todayFootprint.electricity}
                />
                <DietForm 
                  onUpdate={(value) => updateFootprint("diet", value)}
                  initialValue={todayFootprint.diet}
                />
                <WaterForm 
                  onUpdate={(value) => updateFootprint("water", value)}
                  initialValue={todayFootprint.water}
                />
              </div>

              <Card className="gradient-card gradient-card-hover mt-6">
                <CardHeader>
                  <CardTitle className="text-high-contrast">Today's Summary</CardTitle>
                  <CardDescription className="text-gray-300">Your carbon footprint breakdown for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-400">{todayFootprint.transport.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Transport</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-400">{todayFootprint.electricity.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Electricity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-400">{todayFootprint.diet.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Diet</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-cyan-400">{todayFootprint.water.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Water</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{todayFootprint.total.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">Total kg CO₂e</div>
                    </div>
                  </div>
                  <Button
                    onClick={saveTodayFootprint}
                    className="w-full btn-primary text-high-contrast"
                    disabled={todayFootprint.total === 0}
                  >
                    Save Today's Footprint
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="tab-content-wrapper">
              <ProgressCharts data={footprints} />
            </TabsContent>

            <TabsContent value="leaderboard" className="tab-content-wrapper">
              <Leaderboard userId={user?._id} />
            </TabsContent>

            <TabsContent value="tips" className="tab-content-wrapper">
              <TipsSection currentFootprint={todayFootprint} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
