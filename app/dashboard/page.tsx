"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { AgriGooLogo } from "@/components/agrigoo-logo"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, User, Bell, Activity, ShieldAlert, CloudSun, Map, Sprout, ChevronRight, History, Image as ImageIcon } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("diagnosis")
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  function simulateAnalysis() {
    setUploading(true)
    setAnalysisProgress(0)
    const id = setInterval(() => {
      setAnalysisProgress((p) => {
        if (p >= 100) {
          clearInterval(id)
          setUploading(false)
          return 100
        }
        return p + 10
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AgriGooLogo size="md" />
            <div>
              <h1 className="text-2xl font-bold">AgriGoo Dashboard</h1>
              <p className="text-sm text-muted-foreground">Complete crop health management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Farm Health Score</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-bold text-primary">92</span>
              <Activity className="h-6 w-6 text-primary/50" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-bold text-amber-600">3</span>
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Today's Scans</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-3xl font-bold text-green-600">18</span>
              <Sprout className="h-6 w-6 text-green-500" />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <aside className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full"><Upload className="h-4 w-4 mr-2" /> New Scan</Button>
                <Button variant="outline" className="w-full"><Map className="h-4 w-4 mr-2" /> View Outbreaks</Button>
                <Button variant="outline" className="w-full"><CloudSun className="h-4 w-4 mr-2" /> Check Climate</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Farm Overview</CardTitle>
                <CardDescription>Acres: 45 • Plots: 6</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Soil Health</span><Badge>Good</Badge></div>
                <div className="flex justify-between"><span>Irrigation</span><Badge variant="secondary">Optimal</Badge></div>
                <div className="flex justify-between"><span>Pest Pressure</span><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Moderate</Badge></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Action required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 rounded-md bg-amber-50 border border-amber-100">Powdery mildew risk rising in Plot 2</div>
                <div className="p-3 rounded-md bg-red-50 border border-red-100">Leaf blight detected in tomato bed</div>
              </CardContent>
            </Card>
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Main Console</CardTitle>
                <CardDescription>Analyze, monitor, and plan</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="diagnosis" onValueChange={(v) => setActiveTab(v)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="diagnosis">🌿 Plant Diagnosis</TabsTrigger>
                    <TabsTrigger value="outbreak">🗺️ Outbreak Map</TabsTrigger>
                    <TabsTrigger value="climate">🌤️ Climate Forecast</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: PLANT DIAGNOSIS */}
                  <TabsContent value="diagnosis" className="space-y-6">
                    {/* Upload zone */}
                    <div className="rounded-lg border-2 border-dashed p-8 text-center hover:bg-accent/30 transition">
                      <ImageIcon className="mx-auto h-10 w-10 text-primary/50" />
                      <p className="mt-2 text-sm text-muted-foreground">Drag and drop plant images here, or click to upload</p>
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <Input type="file" accept="image/*" className="max-w-xs" />
                        <Button onClick={simulateAnalysis} disabled={uploading}>Analyze</Button>
                      </div>
                    </div>

                    {/* Analysis progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span>AI Analysis Progress</span>
                        <span>{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} />
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Diagnosis Results</CardTitle>
                          <CardDescription>Top detections with confidence</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between"><span>Powdery Mildew</span><Badge className="bg-green-100 text-green-800">92%</Badge></div>
                          <div className="flex justify-between"><span>Leaf Blight</span><Badge className="bg-amber-100 text-amber-800">61%</Badge></div>
                          <div className="flex justify-between"><span>Rust</span><Badge className="bg-red-100 text-red-800">28%</Badge></div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Treatment Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div>• Apply sulfur-based fungicide in early morning</div>
                          <div>• Improve air circulation and avoid overhead irrigation</div>
                          <div>• Monitor infected area for 72 hours</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Scan History</CardTitle>
                          <CardDescription>Recent analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex items-center justify-between"><span>Today, 10:24</span><Badge variant="secondary">Powdery Mildew</Badge></div>
                          <div className="flex items-center justify-between"><span>Yesterday, 18:05</span><Badge variant="secondary">Leaf Spot</Badge></div>
                          <div className="flex items-center justify-between"><span>Mon, 14:17</span><Badge variant="secondary">Rust</Badge></div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* TAB 2: OUTBREAK MAP */}
                  <TabsContent value="outbreak" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Outbreak Map</CardTitle>
                          <CardDescription>Clusters and heatmap (placeholders)</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-96 bg-gray-100 rounded-md flex items-center justify-center">Map Placeholder</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Disease" />
                            <Input type="date" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Severity" />
                            <Input placeholder="Region" />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Apply</Button>
                            <Button size="sm" variant="outline">Reset</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* TAB 3: CLIMATE FORECAST */}
                  <TabsContent value="climate" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Next 7 Days</CardTitle>
                        <CardDescription>Weather & disease spread prediction (placeholders)</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 text-sm">
                          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                            <div key={d} className="flex items-center justify-between">
                              <span>{d}</span>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary">32°C</Badge>
                                <Badge className="bg-amber-100 text-amber-800">Moderate Risk</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="p-3 rounded-md bg-green-50 border border-green-100">Preventive spray recommended on Wed</div>
                          <div className="p-3 rounded-md bg-blue-50 border border-blue-100">High humidity may increase mildew risk</div>
                          <div className="p-3 rounded-md bg-amber-50 border border-amber-100">Avoid overhead irrigation this weekend</div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}


