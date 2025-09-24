"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Separator } from "@/components/ui/separator"
import { LineChart, BarChart3, TrendingUp, DollarSign, Calendar, Map, PieChart, ArrowUpRight, ArrowDownRight, Bus, ShieldAlert } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function LiveMarketPage() {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [rows, setRows] = useState([
    { crop: "Wheat", price: 2240, change: +2.4, bestRegion: "Punjab", action: "Sell" },
    { crop: "Rice", price: 3850, change: +1.2, bestRegion: "Haryana", action: "Hold" },
    { crop: "Pulses", price: 6120, change: -0.8, bestRegion: "Madhya Pradesh", action: "Sell" },
    { crop: "Maize", price: 1890, change: +0.6, bestRegion: "Bihar", action: "Hold" },
  ])

  // Auto-refresh every 5 minutes (simulated random tiny changes)
  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const delta = (Math.random() - 0.5) * 0.6
          const change = Math.round((r.change + delta) * 10) / 10
          const price = Math.max(100, Math.round((r.price * (1 + delta / 100)) / 10) * 10)
          return { ...r, change, price }
        }),
      )
      setLastRefresh(new Date())
    }, 300000)
    return () => clearInterval(id)
  }, [])

  const ticker = useMemo(() => rows.map((r) => ({ label: r.crop, price: r.price, change: r.change })), [rows])

  // Transport and best market calc
  const [fromState, setFromState] = useState("Punjab")
  const [distanceKm, setDistanceKm] = useState(150)
  const [costPerKm, setCostPerKm] = useState(12)
  const transportCost = useMemo(() => Math.max(0, Math.round(distanceKm * costPerKm)), [distanceKm, costPerKm])
  const bestMarket = useMemo(() => {
    return rows.reduce((best, r) => {
      const effective = r.price - transportCost
      if (!best || effective > best.effective) return { crop: r.crop, region: r.bestRegion, effective }
      return best
    }, null as null | { crop: string; region: string; effective: number })
  }, [rows, transportCost])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/15 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Live Market Prices & Intelligence</h1>
          <p className="text-lg text-primary/80 max-w-3xl mx-auto">
            Real-time crop prices, regional analysis, and smart selling recommendations
          </p>
          <div className="mt-6">
            <Button asChild>
              <a href="#live-prices">Check Live Prices</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Forecast Display */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7-Day Risk Forecast</h2>
          <ForecastDisplay />
        </section>

        {/* Outbreak Map */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Disease Outbreak Map</h2>
          <OutbreakMap />
        </section>

        {/* 2. LIVE PRICE DASHBOARD */}
        <section id="live-prices" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Live Price Dashboard</h2>
            <span className="text-sm text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          </div>

          {/* Ticker */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex overflow-x-auto no-scrollbar divide-x">
                {ticker.map((t) => (
                  <div key={t.label} className="min-w-48 px-4 py-3 flex items-center gap-3">
                    <span className="font-medium">{t.label}</span>
                    <span className="text-sm">₹{t.price.toLocaleString()}</span>
                    <span className={`text-sm ${t.change >= 0 ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                      {t.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {t.change}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Market Snapshot</CardTitle>
              <CardDescription>Auto-refreshes every 5 minutes</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Crop</th>
                    <th className="py-2">Current Price</th>
                    <th className="py-2">Today&apos;s Change</th>
                    <th className="py-2">Best Region</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.crop} className="border-b last:border-0">
                      <td className="py-3 font-medium">{r.crop}</td>
                      <td className="py-3">₹{r.price.toLocaleString()}/quintal</td>
                      <td className={`py-3 ${r.change >= 0 ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                        {r.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {r.change}%
                      </td>
                      <td className="py-3">{r.bestRegion}</td>
                      <td className="py-3">
                        <Button size="sm" className="h-8">{r.action}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* 3. REGIONAL MARKET COMPARISON */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Regional Market Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>India Price Heatmap</CardTitle>
                <CardDescription>Live price intensity across states (placeholder)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <Map className="h-16 w-16 text-primary/40" />
                  <span className="ml-2 text-gray-500">Map visualization coming soon</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State-wise Differences</CardTitle>
                <CardDescription>Top regions vs national average</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[{ s: "Punjab", d: "+4%" }, { s: "Haryana", d: "+3%" }, { s: "MP", d: "+2%" }, { s: "Bihar", d: "+1%" }].map((row) => (
                  <div key={row.s} className="flex items-center justify-between text-sm">
                    <span>{row.s}</span>
                    <span className="text-green-600">{row.d}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transportation Cost Calculator</CardTitle>
                <CardDescription>Estimate logistics cost</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">From State</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md" value={fromState} onChange={(e) => setFromState(e.target.value)}>
                    {['Punjab','Haryana','Madhya Pradesh','Bihar','UP','Rajasthan'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Distance (km)</label>
                    <input type="number" className="w-full p-2 border border-gray-300 rounded-md" value={distanceKm} onChange={(e) => setDistanceKm(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Cost per km (₹)</label>
                    <input type="number" className="w-full p-2 border border-gray-300 rounded-md" value={costPerKm} onChange={(e) => setCostPerKm(Number(e.target.value))} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bus className="h-4 w-4 text-primary" />
                  Estimated Transport Cost: <span className="font-medium">₹{transportCost.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Market for Your Location</CardTitle>
                <CardDescription>Based on effective net price</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {bestMarket ? (
                  <div className="text-sm">
                    <div>Crop: <span className="font-medium">{bestMarket.crop}</span></div>
                    <div>Region: <span className="font-medium">{bestMarket.region}</span></div>
                    <div>Effective Price after transport: <span className="font-medium">₹{bestMarket.effective.toLocaleString()}</span></div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Provide transport details to compute best market.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. PRICE TRENDS & PREDICTIONS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Price Trends & Predictions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Price Movements</CardTitle>
                <CardDescription>Updated intraday movements (placeholder)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-primary/40" />
                  <span className="ml-2 text-gray-500">Live chart coming soon</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7-day Forecast</CardTitle>
                <CardDescription>AI-assisted projection (placeholder)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"].map((d, i) => (
                  <div key={d} className="flex items-center justify-between">
                    <span>{d}</span>
                    <span className="text-green-600">+{(i+1)*0.5}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Demand-Supply</CardTitle>
                <CardDescription>Current indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Demand</span><span className="text-green-600">High</span></div>
                <div className="flex justify-between"><span>Supply</span><span className="text-amber-600">Moderate</span></div>
                <div className="flex justify-between"><span>Volatility</span><span className="text-green-600">Low</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Trend</CardTitle>
                <CardDescription>Historical seasonality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-primary/40" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Signals</CardTitle>
                <CardDescription>Policy/weather alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-amber-500" /> Monsoon delay risk: Medium</div>
                <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" /> Export policy change: High</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. SELLING RECOMMENDATIONS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Selling Recommendations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Time to Sell</CardTitle>
                <CardDescription>AI alerts (placeholder)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  Wheat: Sell in next 7-10 days (+8-12%)
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  Rice: Monitor—forecast +5-9% in 3-4 weeks
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profit Margin Calculator</CardTitle>
                <CardDescription>Estimate profit with current live prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Select Crop</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        {rows.map((r) => (
                          <option key={r.crop} value={r.crop}>{r.crop}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Production Quantity (quintals)</label>
                      <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter quantity" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Production Cost (₹/quintal)</label>
                      <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter cost" />
                    </div>
                    <Button className="w-full">Calculate Profit</Button>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <h3 className="text-lg font-semibold text-primary mb-4">Profit Analysis</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span>Current Live Market Price:</span><span className="font-medium">₹{rows[0].price.toLocaleString()}/quintal</span></div>
                      <div className="flex justify-between"><span>Profit per Quintal:</span><span className="font-medium text-green-600">₹390</span></div>
                      <Separator />
                      <div className="flex justify-between"><span>Total Profit (example):</span><span className="font-medium text-green-600">₹39,000</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Risk Assessment</CardTitle>
                <CardDescription>Volatility and policy overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Volatility</span><span className="text-green-600">Low</span></div>
                <div className="flex justify-between"><span>Policy Risk</span><span className="text-red-600">High</span></div>
                <div className="flex justify-between"><span>Logistics</span><span className="text-amber-600">Moderate</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Competitor Price Monitoring</CardTitle>
                <CardDescription>Compare prevailing rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <PieChart className="h-10 w-10 text-primary/40" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
// ForecastDisplay Component
function ForecastDisplay() {
  const [location, setLocation] = useState<string>("Jintur")
  const [loading, setLoading] = useState<boolean>(false)
  const [forecast, setForecast] = useState<null | { riskLevel: "Low" | "Moderate" | "High"; reason: string }>(null)

  function mockForecastLogic(loc: string): Promise<{ riskLevel: "Low" | "Moderate" | "High"; reason: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const city = loc.trim().toLowerCase()
        let riskLevel: "Low" | "Moderate" | "High" = "Low"
        let reason = "Stable market with favorable conditions."
        if (["mumbai", "pune", "nagpur"].includes(city)) {
          riskLevel = "High"
          reason = "High demand volatility and price pressure expected."
        } else if (city === "jintur") {
          riskLevel = "Moderate"
          reason = "Seasonal fluctuations may impact prices moderately."
        }
        resolve({ riskLevel, reason })
      }, 1500)
    })
  }

  async function handleGetForecast() {
    setLoading(true)
    const data = await mockForecastLogic(location)
    setForecast(data)
    setLoading(false)
  }

  const badgeClasses = forecast?.riskLevel === "High"
    ? "bg-red-100 text-red-700 border-red-200"
    : forecast?.riskLevel === "Moderate"
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-green-100 text-green-700 border-green-200"

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Location-based Risk Forecast</CardTitle>
        <CardDescription>Enter a location to simulate a risk forecast</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location (e.g., Jintur)"
          />
          <Button onClick={handleGetForecast} disabled={loading}>
            {loading ? "Loading forecast..." : "Get Forecast"}
          </Button>
        </div>

        {forecast && (
          <div className={`rounded-md border p-4 ${badgeClasses}`}>
            <div className="text-sm">
              <div className="font-semibold">Risk Level: {forecast.riskLevel}</div>
              <div className="mt-1 text-sm/relaxed">{forecast.reason}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// OutbreakMap Component
function OutbreakMap() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])
  // Statewide mock outbreaks across Maharashtra (spread beyond a few cities)
  const [outbreaks] = useState<Array<{
    id: number
    lat: number
    lng: number
    disease: string
    reportedAt: string
  }>>([
    { id: 1, lat: 19.61, lng: 76.69, disease: "Wheat Rust", reportedAt: "2025-09-10" }, // Jintur (Parbhani)
    { id: 2, lat: 18.52, lng: 73.85, disease: "Powdery Mildew", reportedAt: "2025-09-12" }, // Pune
    { id: 3, lat: 19.07, lng: 72.87, disease: "Leaf Blight", reportedAt: "2025-09-13" }, // Mumbai
    { id: 4, lat: 21.14, lng: 79.08, disease: "Stem Rust", reportedAt: "2025-09-14" }, // Nagpur
    { id: 5, lat: 20.00, lng: 73.78, disease: "Bacterial Leaf Spot", reportedAt: "2025-09-11" }, // Nashik belt
    { id: 6, lat: 19.88, lng: 75.33, disease: "Late Blight", reportedAt: "2025-09-12" }, // Aurangabad region
    { id: 7, lat: 18.97, lng: 75.75, disease: "Downy Mildew", reportedAt: "2025-09-13" }, // Beed region
    { id: 8, lat: 17.68, lng: 75.91, disease: "Smut", reportedAt: "2025-09-15" }, // Solapur belt
    { id: 9, lat: 21.00, lng: 75.56, disease: "Rust", reportedAt: "2025-09-16" }, // Jalgaon region
    { id: 10, lat: 19.26, lng: 74.65, disease: "Wilt", reportedAt: "2025-09-17" }, // Ahmednagar region
  ])

  // Maharashtra bounds and center
  const center: [number, number] = [19.75, 75.71]
  const maharashtraBounds: [[number, number], [number, number]] = [[15.6, 72.6], [22.2, 80.9]]

  function FitToMaharashtra() {
    const map = useMap()
    useEffect(() => {
      map.fitBounds(maharashtraBounds, { padding: [20, 20] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return null
  }

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden border border-border">
      {!isClient ? (
        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Loading map…</div>
      ) : (
        <MapContainer center={center} zoom={7} scrollWheelZoom className="w-full h-full">
          <FitToMaharashtra />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Rectangle bounds={maharashtraBounds as any} pathOptions={{ color: '#22c55e', weight: 1, opacity: 0.4 }} />
          {outbreaks.map((o) => (
            <Marker key={o.id} position={[o.lat, o.lng]}>
              <Popup>
                <div className="text-sm">
                  <div className="font-medium">{o.disease}</div>
                  <div className="text-xs text-muted-foreground">Reported: {new Date(o.reportedAt).toLocaleDateString()}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}
