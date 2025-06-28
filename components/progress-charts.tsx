"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts"

interface DailyFootprint {
  date: string
  transport: number
  electricity: number
  diet: number
  water: number
  total: number
}

interface ProgressChartsProps {
  data: DailyFootprint[]
}

export function ProgressCharts({ data }: ProgressChartsProps) {
  // Debug data
  console.log("Chart data received:", data);
  
  const chartData = data
    .slice(0, 30)
    .reverse()
    .map((item) => {
      const mapped = {
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        // Ensure minimum values for visibility - add 0.1 to any zero values to make bars visible
        transport: Math.max(item.transport || 0, item.transport > 0 ? item.transport : 0.1),
        electricity: Math.max(item.electricity || 0, item.electricity > 0 ? item.electricity : 0.1),
        diet: Math.max(item.diet || 0, item.diet > 0 ? item.diet : 0.1),
        water: Math.max(item.water || 0, item.water > 0 ? item.water : 0.1),
        total: Math.max(item.total || 0, item.total > 0 ? item.total : 0.4),
      };
      console.log("Mapped chart item:", mapped);
      return mapped;
    })

  console.log("Final chartData:", chartData);

  // Enhanced test data with better visibility
  const hasAnyRealData = data.some(item => 
    item.transport > 0 || item.electricity > 0 || item.diet > 0 || item.water > 0
  );
  
  const testChartData = hasAnyRealData ? chartData : [
    {
      date: "Dec 25",
      transport: 2.5,
      electricity: 1.8,
      diet: 3.2,
      water: 1.1,
      total: 8.6,
    },
    {
      date: "Dec 26", 
      transport: 1.8,
      electricity: 2.1,
      diet: 2.8,
      water: 0.9,
      total: 7.6,
    },
    {
      date: "Dec 27",
      transport: 3.1,
      electricity: 1.5,
      diet: 2.4,
      water: 1.3,
      total: 8.3,
    },
  ];

  console.log("Test chart data:", testChartData);

  // Calculate dynamic colors based on usage levels
  const getColorForValue = (value: number, max: number, category: string) => {
    const ratio = value / max;
    
    switch (category) {
      case 'transport':
        // Purple to red gradient based on usage
        if (ratio <= 0.33) return '#8b5cf6'; // Low - Purple
        if (ratio <= 0.66) return '#f59e0b'; // Medium - Orange
        return '#ef4444'; // High - Red
        
      case 'electricity':
        // Yellow to red gradient
        if (ratio <= 0.33) return '#eab308'; // Low - Yellow
        if (ratio <= 0.66) return '#f59e0b'; // Medium - Orange
        return '#dc2626'; // High - Red
        
      case 'diet':
        // Green to red gradient
        if (ratio <= 0.33) return '#22c55e'; // Low - Green
        if (ratio <= 0.66) return '#f59e0b'; // Medium - Orange
        return '#b91c1c'; // High - Red
        
      case 'water':
        // Cyan to red gradient
        if (ratio <= 0.33) return '#06b6d4'; // Low - Cyan
        if (ratio <= 0.66) return '#f59e0b'; // Medium - Orange
        return '#dc2626'; // High - Red
        
      default:
        return '#6b7280'; // Default gray
    }
  };

  // Find max values for each category for color scaling
  const maxValues = {
    transport: Math.max(...testChartData.map(d => d.transport)),
    electricity: Math.max(...testChartData.map(d => d.electricity)),
    diet: Math.max(...testChartData.map(d => d.diet)),
    water: Math.max(...testChartData.map(d => d.water)),
  };

  // Create custom bar components with dynamic colors
  const getDynamicFill = (entry: any, category: string) => {
    const value = entry[category];
    const maxValue = maxValues[category as keyof typeof maxValues];
    return getColorForValue(value, maxValue, category);
  };

  // Enhanced chart data with dynamic colors
  const enhancedChartData = testChartData.map((entry, index) => ({
    ...entry,
    index,
    transportColor: getDynamicFill(entry, 'transport'),
    electricityColor: getDynamicFill(entry, 'electricity'),
    dietColor: getDynamicFill(entry, 'diet'),
    waterColor: getDynamicFill(entry, 'water'),
  }));

  const chartConfig = {
    total: {
      label: "Total",
      color: "#10b981", // emerald-500
    },
    transport: {
      label: "Transport", 
      color: "#8b5cf6", // violet-500
    },
    electricity: {
      label: "Electricity",
      color: "#fbbf24", // amber-400
    },
    diet: {
      label: "Diet",
      color: "#34d399", // emerald-400
    },
    water: {
      label: "Water",
      color: "#22d3ee", // cyan-400
    },
  }

  const hasMinimalData = data.length < 3

  if (data.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="gradient-card gradient-card-hover">
          <CardHeader>
            <CardTitle className="text-high-contrast">Progress Charts</CardTitle>
            <CardDescription className="text-gray-300">
              No data available yet. Start tracking your footprint to see beautiful charts!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p>Your charts will appear here once you start logging your daily carbon footprint.</p>
                <p className="text-sm mt-2">Try entering data in the "Daily Input" tab!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug info for no data */}
      {!hasAnyRealData && (
        <Card className="warning-card gradient-card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="text-lg">🔧</div>
              <div>
                <p className="text-sm warning-text font-medium">
                  Debug Mode: No footprint data found - showing test data for chart visibility
                </p>
                <p className="text-xs text-orange-300 mt-1">
                  Try entering some data in the "Daily Input" forms to see real charts!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning for minimal data */}
      {hasMinimalData && (
        <Card className="warning-card gradient-card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="text-lg">⚠️</div>
              <p className="text-sm warning-text">
                You have limited data ({data.length} {data.length === 1 ? 'day' : 'days'}). 
                Track for a few more days to see meaningful trends in your charts!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card gradient-card-hover">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 text-high-contrast">
                {(testChartData.reduce((sum, day) => sum + day.total, 0) / testChartData.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-300">Avg Daily (kg CO₂e)</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card gradient-card-hover">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 text-high-contrast">
                {Math.min(...testChartData.map(d => d.total)).toFixed(1)}
              </div>
              <div className="text-sm text-gray-300">Best Day (kg CO₂e)</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card gradient-card-hover">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 text-high-contrast">
                {Math.max(...testChartData.map(d => d.total)).toFixed(1)}
              </div>
              <div className="text-sm text-gray-300">Highest Day (kg CO₂e)</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card gradient-card-hover">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 text-high-contrast">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-300">Days Tracked</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Daily Total Footprint</CardTitle>
          <CardDescription className="text-gray-300">Your total carbon footprint over time</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#e5e7eb"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#e5e7eb"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip 
                  cursor={false}
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  }}
                  labelStyle={{ color: '#f3f4f6', fontWeight: 600, marginBottom: '8px' }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(2)} kg CO₂e`,
                    name
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, stroke: "#10b981", strokeWidth: 3, fill: "#fff", filter: "drop-shadow(0 0 6px #10b981)" }}
                  name="Total CO₂e"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Footprint Breakdown</CardTitle>
          <CardDescription className="text-gray-300">Stacked area chart showing category contributions</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={testChartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#e5e7eb"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#e5e7eb"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip 
                  cursor={false}
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  }}
                  labelStyle={{ color: '#f3f4f6', fontWeight: 600, marginBottom: '8px' }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(2)} kg CO₂e`,
                    name
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', color: '#e5e7eb' }}
                  iconType="rect"
                />
                <Area
                  type="monotone"
                  dataKey="transport"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.8}
                  name="Transport"
                />
                <Area
                  type="monotone"
                  dataKey="electricity"
                  stackId="1"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.8}
                  name="Electricity"
                />
                <Area 
                  type="monotone" 
                  dataKey="diet" 
                  stackId="1" 
                  stroke="#34d399" 
                  fill="#34d399"
                  fillOpacity={0.8}
                  name="Diet"
                />
                <Area 
                  type="monotone" 
                  dataKey="water" 
                  stackId="1" 
                  stroke="#22d3ee" 
                  fill="#22d3ee"
                  fillOpacity={0.8}
                  name="Water"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 gradient-card gradient-card-hover">
        <CardHeader>
          <CardTitle className="text-high-contrast">Category Breakdown by Day</CardTitle>
          <CardDescription className="text-gray-300">
            Stacked bar chart showing daily footprint by category
            {chartData.length <= 2 && (
              <span className="block mt-1 text-yellow-400 text-sm">
                📊 Bars are extra wide for better visibility with limited data
              </span>
            )}
            {!hasAnyRealData && (
              <span className="block mt-1 text-orange-400 text-sm">
                🔧 Showing test data - no real footprint data available yet
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={testChartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                barCategoryGap={chartData.length <= 3 ? "20%" : "10%"}
                maxBarSize={chartData.length <= 3 ? 120 : 60}
              >
                <XAxis 
                  dataKey="date" 
                  stroke="#e5e7eb"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#e5e7eb"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}kg`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #4b5563',
                    borderRadius: '8px',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  }}
                  labelStyle={{ color: '#f3f4f6', fontWeight: 600, marginBottom: '8px' }}
                  formatter={(value: any, name: any) => [
                    `${Number(value).toFixed(2)} kg CO₂e`,
                    name
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', color: '#e5e7eb' }}
                  iconType="rect"
                />
                <Bar 
                  dataKey="transport" 
                  stackId="stack"
                  fill="#8b5cf6"
                  stroke="#a855f7"
                  strokeWidth={1}
                  name="Transport"
                  minPointSize={8}
                />
                <Bar 
                  dataKey="electricity" 
                  stackId="stack"
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  name="Electricity"
                  minPointSize={8}
                />
                <Bar 
                  dataKey="diet" 
                  stackId="stack"
                  fill="#34d399"
                  stroke="#10b981"
                  strokeWidth={1}
                  name="Diet"
                  minPointSize={8}
                />
                <Bar 
                  dataKey="water" 
                  stackId="stack"
                  fill="#22d3ee"
                  stroke="#06b6d4"
                  strokeWidth={1}
                  name="Water"
                  radius={[4, 4, 0, 0]}
                  minPointSize={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
