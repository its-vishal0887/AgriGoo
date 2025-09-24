"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Dynamically import the map component to avoid SSR issues
const OutbreakMap = dynamic(() => import("@/components/outbreak-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
})

export interface OutbreakData {
  id: string
  lat: number
  lng: number
  disease: string
  severity: "low" | "medium" | "high"
  crop: string
  reportedDate: string
  affectedArea: number
  status: "active" | "contained" | "resolved"
  confidence: number
}

export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showClusters, setShowClusters] = useState(true)
  const [timelineValue, setTimelineValue] = useState([30])
  const [selectedOutbreak, setSelectedOutbreak] = useState<OutbreakData | null>(null)

  // Mock outbreak data
  const outbreakData: OutbreakData[] = useMemo(
    () => [
      {
        id: "1",
        lat: 40.7128,
        lng: -74.006,
        disease: "Early Blight",
        severity: "high",
        crop: "Tomato",
        reportedDate: "2024-01-15",
        affectedArea: 25.5,
        status: "active",
        confidence: 94.2,
      },
      {
        id: "2",
        lat: 34.0522,
        lng: -118.2437,
        disease: "Powdery Mildew",
        severity: "medium",
        crop: "Wheat",
        reportedDate: "2024-01-20",
        affectedArea: 18.3,
        status: "contained",
        confidence: 87.6,
      },
      {
        id: "3",
        lat: 41.8781,
        lng: -87.6298,
        disease: "Rust",
        severity: "low",
        crop: "Corn",
        reportedDate: "2024-01-25",
        affectedArea: 12.1,
        status: "resolved",
        confidence: 91.8,
      },
      {
        id: "4",
        lat: 29.7604,
        lng: -95.3698,
        disease: "Bacterial Spot",
        severity: "high",
        crop: "Pepper",
        reportedDate: "2024-02-01",
        affectedArea: 31.2,
        status: "active",
        confidence: 96.4,
      },
      {
        id: "5",
        lat: 33.4484,
        lng: -112.074,
        disease: "Fusarium Wilt",
        severity: "medium",
        crop: "Cotton",
        reportedDate: "2024-02-05",
        affectedArea: 22.7,
        status: "contained",
        confidence: 89.3,
      },
    ],
    [],
  )

  const diseaseTypes = ["Early Blight", "Powdery Mildew", "Rust", "Bacterial Spot", "Fusarium Wilt"]
  const cropTypes = ["Tomato", "Wheat", "Corn", "Pepper", "Cotton"]
  const severityLevels = ["low", "medium", "high"]
  const statusTypes = ["active", "contained", "resolved"]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-600 bg-red-50 border-red-200"
      case "contained":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const exportMapData = () => {
    const dataStr = JSON.stringify(outbreakData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "outbreak-data.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Disease Outbreak Map</h1>
          <p className="text-muted-foreground">Real-time monitoring and analysis of crop disease outbreaks worldwide</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Map Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Location */}
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium">
                    Search Location
                  </Label>
                  <Input
                    id="search"
                    placeholder="Enter city, region, or coordinates"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Separator />

                {/* Map Display Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Display Options</Label>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Heatmap Overlay</span>
                    <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cluster Markers</span>
                    <Switch checked={showClusters} onCheckedChange={setShowClusters} />
                  </div>
                </div>

                <Separator />

                {/* Timeline Slider */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Historical Timeline</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last {timelineValue[0]} days</span>
                      <span>Today</span>
                    </div>
                    <Slider
                      value={timelineValue}
                      onValueChange={setTimelineValue}
                      max={365}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button onClick={exportMapData} className="w-full bg-transparent" variant="outline">
                  Export Data
                </Button>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Disease Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diseases" />
                    </SelectTrigger>
                    <SelectContent>
                      {diseaseTypes.map((disease) => (
                        <SelectItem key={disease} value={disease}>
                          {disease}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Severity Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getSeverityColor(level)}`} />
                            <span className="capitalize">{level}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Crop Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crops" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Severity Levels</Label>
                  <div className="space-y-1">
                    {severityLevels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(level)}`} />
                        <span className="text-sm capitalize">{level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status Types</Label>
                  <div className="space-y-1">
                    {statusTypes.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full border-2 ${
                            status === "active"
                              ? "border-red-500"
                              : status === "contained"
                                ? "border-yellow-500"
                                : "border-green-500"
                          }`}
                        />
                        <span className="text-sm capitalize">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map and Details */}
          <div className="lg:col-span-3 space-y-4">
            {/* Map Container */}
            <Card>
              <CardContent className="p-0">
                <div className="h-[600px] w-full">
                  <OutbreakMap
                    data={outbreakData}
                    showHeatmap={showHeatmap}
                    showClusters={showClusters}
                    onMarkerClick={setSelectedOutbreak}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Outbreak Details */}
            {selectedOutbreak && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Outbreak Details</span>
                    <Badge className={getStatusColor(selectedOutbreak.status)}>
                      {selectedOutbreak.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Disease</Label>
                        <p className="text-lg font-semibold">{selectedOutbreak.disease}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Crop</Label>
                        <p className="text-base">{selectedOutbreak.crop}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Severity</Label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedOutbreak.severity)}`} />
                          <span className="capitalize">{selectedOutbreak.severity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Affected Area</Label>
                        <p className="text-base">{selectedOutbreak.affectedArea} hectares</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Confidence</Label>
                        <p className="text-base">{selectedOutbreak.confidence}%</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Reported Date</Label>
                        <p className="text-base">{new Date(selectedOutbreak.reportedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Outbreaks</p>
                    <p className="text-2xl font-bold text-red-600">
                      {outbreakData.filter((d) => d.status === "active").length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Contained</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {outbreakData.filter((d) => d.status === "contained").length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {outbreakData.filter((d) => d.status === "resolved").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
