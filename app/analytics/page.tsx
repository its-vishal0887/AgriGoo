"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Navigation } from "@/components/navigation"

// Mock data for the dashboard
const weeklyScansData = [
  { day: "Mon", scans: 145 },
  { day: "Tue", scans: 178 },
  { day: "Wed", scans: 203 },
  { day: "Thu", scans: 189 },
  { day: "Fri", scans: 234 },
  { day: "Sat", scans: 167 },
  { day: "Sun", scans: 131 },
]

const diseaseDistributionData = [
  { name: "Blight", value: 35, color: "#dc2626" },
  { name: "Rust", value: 28, color: "#ea580c" },
  { name: "Mildew", value: 18, color: "#ca8a04" },
  { name: "Wilt", value: 12, color: "#16a34a" },
  { name: "Other", value: 7, color: "#6b7280" },
]

const seasonalTrendsData = [
  { month: "Jan", diseases: 45, healthy: 155 },
  { month: "Feb", diseases: 52, healthy: 148 },
  { month: "Mar", diseases: 78, healthy: 122 },
  { month: "Apr", diseases: 95, healthy: 105 },
  { month: "May", diseases: 134, healthy: 66 },
  { month: "Jun", diseases: 167, healthy: 33 },
  { month: "Jul", diseases: 189, healthy: 11 },
  { month: "Aug", diseases: 156, healthy: 44 },
  { month: "Sep", diseases: 123, healthy: 77 },
  { month: "Oct", diseases: 89, healthy: 111 },
  { month: "Nov", diseases: 67, healthy: 133 },
  { month: "Dec", diseases: 54, healthy: 146 },
]

const regionalRiskData = [
  { region: "North America", risk: "Low", value: 15, color: "#16a34a" },
  { region: "South America", risk: "Medium", value: 35, color: "#ca8a04" },
  { region: "Europe", risk: "Low", value: 12, color: "#16a34a" },
  { region: "Asia", risk: "High", value: 45, color: "#dc2626" },
  { region: "Africa", risk: "Medium", value: 28, color: "#ca8a04" },
  { region: "Oceania", risk: "Low", value: 8, color: "#16a34a" },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-lg">Comprehensive insights into your crop health monitoring</p>
        </div>

        {/* Main Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Scans */}
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
              <div className="flex items-center text-emerald-600">
                <span className="text-xs mr-1">↗</span>
                <span className="text-xs font-medium">+12%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-emerald-600">1,247</div>
              <p className="text-xs text-muted-foreground mt-1">+89 from last week</p>
            </CardContent>
          </Card>

          {/* Detection Accuracy */}
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Detection Accuracy</CardTitle>
              <div className="flex items-center text-emerald-600">
                <span className="text-xs mr-1">↗</span>
                <span className="text-xs font-medium">+0.3%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-emerald-600">98.7%</div>
              <p className="text-xs text-muted-foreground mt-1">Industry leading</p>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              <Badge variant="destructive" className="text-xs">
                Urgent
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          {/* Cost Saved */}
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cost Saved</CardTitle>
              <div className="flex items-center text-emerald-600">
                <span className="text-xs mr-1">↗</span>
                <span className="text-xs font-medium">+18%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-emerald-600">$12,450</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Disease Distribution - Pie Chart */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-800">Disease Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Most common diseases detected this month</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diseaseDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diseaseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Scan Activity - Line Chart */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-800">Weekly Scan Activity</CardTitle>
              <p className="text-sm text-muted-foreground">Daily scan volume over the past week</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyScansData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="scans"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regional Risk Map - Horizontal Bar Chart */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-800">Regional Risk Assessment</CardTitle>
              <p className="text-sm text-muted-foreground">Disease risk levels by geographic region</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalRiskData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-sm font-medium text-foreground min-w-[100px]">{region.region}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${region.value}%`,
                            backgroundColor: region.color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge
                        variant={
                          region.risk === "High" ? "destructive" : region.risk === "Medium" ? "secondary" : "default"
                        }
                        className="text-xs"
                      >
                        {region.risk}
                      </Badge>
                      <span className="text-sm text-muted-foreground min-w-[30px]">{region.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Trends - Area Chart */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-emerald-800">Seasonal Disease Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly comparison of healthy vs diseased crops</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={seasonalTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#f9fafb",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="healthy"
                      stackId="1"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.6}
                      name="Healthy Crops"
                    />
                    <Area
                      type="monotone"
                      dataKey="diseases"
                      stackId="1"
                      stroke="#dc2626"
                      fill="#dc2626"
                      fillOpacity={0.6}
                      name="Diseased Crops"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
            Export Report
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 bg-transparent"
          >
            Schedule Report
          </Button>
        </div>
      </div>
    </div>
  )
}
