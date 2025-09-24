"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/components/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend, BarChart, Bar } from "recharts"
import { toast } from "sonner"

type DayForecast = { day: string; temp: number; humidity: number; rain: number; wind: number; risk: "Low" | "Medium" | "High" | "Very High" }

function computeRisk(temp: number, humidity: number, rain: number, wind: number): DayForecast["risk"] {
  const score = (humidity / 100) * 0.4 + (Math.min(Math.max((temp - 18) / 12, 0), 1)) * 0.3 + (Math.min(rain / 20, 1)) * 0.2 + (Math.min(wind / 30, 1)) * 0.1
  if (score > 0.8) return "Very High"
  if (score > 0.6) return "High"
  if (score > 0.4) return "Medium"
  return "Low"
}

export default function ClimateForecast() {
  const { selectedRegion, pushAlert, setUserPref } = useDashboard()
  const [days, setDays] = useState<DayForecast[]>([])
  const [historical, setHistorical] = useState<Array<{ month: string; outbreaks: number; temp: number; humidity: number }>>([])

  useEffect(() => {
    const next7: DayForecast[] = Array.from({ length: 7 }).map((_, i) => {
      const temp = 26 + Math.sin(i) * 4
      const humidity = 55 + (i % 3) * 10
      const rain = i % 2 === 0 ? 5 + i : 2
      const wind = 8 + (i % 4)
      return { day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i % 7], temp, humidity, rain, wind, risk: computeRisk(temp, humidity, rain, wind) }
    })
    setDays(next7)

    const hist = Array.from({ length: 12 }).map((_, i) => ({ month: new Date(2025, i, 1).toLocaleString("default", { month: "short" }), outbreaks: Math.round(10 + Math.sin(i / 2) * 6 + (i % 3)), temp: 20 + Math.sin(i / 2) * 6, humidity: 60 - Math.cos(i / 2) * 10 }))
    setHistorical(hist)
  }, [])

  const current = useMemo(() => days[0], [days])

  const fourteenDayProjection = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({ day: `D+${i+1}`, spread: Math.max(0, 5 + Math.sin(i / 2) * 3 + i * 0.4) }))
  }, [])

  function riskBadge(r: DayForecast["risk"]) {
    if (r === "Very High") return <Badge className="bg-red-100 text-red-800">Very High</Badge>
    if (r === "High") return <Badge className="bg-amber-100 text-amber-800">High</Badge>
    if (r === "Medium") return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
    return <Badge className="bg-green-100 text-green-800">Low</Badge>
  }

  useEffect(() => {
    if (!current) return
    if (current.risk === "High" || current.risk === "Very High") {
      pushAlert({ type: current.risk === "Very High" ? "danger" : "warning", message: `High risk forecast for ${selectedRegion ? `selected region` : `your area`}: ${current.risk}` })
      toast(`${current.risk} Climate Risk`, { description: "Forecast indicates elevated disease spread risk.", important: true })
    }
    // persist current risk level for tab indicator
    setUserPref("climateRisk", current?.risk ?? "Low")
  }, [current, pushAlert, selectedRegion])

  return (
    <div className="space-y-4">
      {/* Current conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Conditions {selectedRegion ? `(Region ${selectedRegion.lat.toFixed(2)}, ${selectedRegion.lng.toFixed(2)})` : ""}</CardTitle>
          <CardDescription>Live weather and risk summary</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3 rounded-md border"><div className="text-muted-foreground text-xs">Temperature</div><div className="font-medium">{current?.temp.toFixed(1)}°C</div></div>
          <div className="p-3 rounded-md border"><div className="text-muted-foreground text-xs">Humidity</div><div className="font-medium">{current?.humidity}%</div></div>
          <div className="p-3 rounded-md border"><div className="text-muted-foreground text-xs">Rain</div><div className="font-medium">{current?.rain} mm</div></div>
          <div className="p-3 rounded-md border"><div className="text-muted-foreground text-xs">Wind</div><div className="font-medium">{current?.wind} km/h</div></div>
          <div className="p-3 rounded-md border col-span-2 md:col-span-4 flex items-center justify-between"><div className="text-sm">Current Risk Level</div>{current && riskBadge(current.risk)}</div>
        </CardContent>
      </Card>

      {/* 7-day forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Weather Forecast</CardTitle>
          <CardDescription>Daily temperature and humidity</CardDescription>
        </CardHeader>
        <CardContent style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={days} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 45]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line name="Temp (°C)" yAxisId="left" type="monotone" dataKey="temp" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line name="Humidity (%)" yAxisId="right" type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Risk factors and 14-day spread projection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors</CardTitle>
            <CardDescription>Temperature, Humidity, Rainfall, Wind</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={days} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="hum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="#22c55e" fillOpacity={1} fill="url(#temp)" name="Temp (°C)" />
                <Area type="monotone" dataKey="rain" stroke="#06b6d4" fill="#06b6d422" name="Rain (mm)" />
                <Area type="monotone" dataKey="wind" stroke="#f97316" fill="#f9731622" name="Wind (km/h)" />
                <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fillOpacity={1} fill="url(#hum)" name="Humidity (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predicted Spread (14 days)</CardTitle>
            <CardDescription>Affected area projection</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fourteenDayProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spread" fill="#ef4444" name="Projected area (ha)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Preventive actions */}
      <Card>
        <CardHeader>
          <CardTitle>Preventive Actions</CardTitle>
          <CardDescription>Alerts, timing, and cost-benefit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="p-3 rounded-md bg-amber-50 border border-amber-100">High Risk Alert: Powdery Mildew expected in 3 days</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md border">
              <div className="text-xs text-muted-foreground">Recommended Treatment</div>
              <div className="font-medium">Bio-fungicide (Bacillus subtilis)</div>
              <div className="text-xs text-muted-foreground">Optimal timing: 2 days before rain</div>
            </div>
            <div className="p-3 rounded-md border">
              <div className="text-xs text-muted-foreground">Application Window</div>
              <div className="font-medium">Early morning, 5–7 AM</div>
              <div className="text-xs text-muted-foreground">Low wind, moderate humidity</div>
            </div>
            <div className="p-3 rounded-md border">
              <div className="text-xs text-muted-foreground">Cost-Benefit</div>
              <div className="font-medium">₹1,200 cost → ~₹9,500 yield protected</div>
              <div className="text-xs text-green-700">ROI ≈ 7.9x</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical and seasonal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Historical Climate Patterns</CardTitle>
            <CardDescription>12 months trend</CardDescription>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historical}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="outbreaks" stroke="#ef4444" name="Outbreaks" />
                <Line dataKey="temp" stroke="#22c55e" name="Temp (°C)" />
                <Line dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Early Warning Indicators</CardTitle>
            <CardDescription>Seasonal risk signals</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 text-sm">
            <div className="p-3 rounded-md border flex items-center justify-between"><span>Temp/Humidity correlation</span><Badge variant="secondary">Strong</Badge></div>
            <div className="p-3 rounded-md border flex items-center justify-between"><span>Govt. data sync</span><Badge variant="secondary">OK</Badge></div>
            <div className="p-3 rounded-md border flex items-center justify-between"><span>Farmer reports</span><Badge variant="secondary">Increasing</Badge></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


