"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useDashboard } from "@/components/dashboard-context"
import type { LatLngExpression } from "leaflet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import Leaflet components only on client side
let MapContainer: any;
let TileLayer: any;
let CircleMarker: any;
let Circle: any;
let Polygon: any;
let LayersControl: any;
let LayerGroup: any;
let useMapEvents: any;

// Only import Leaflet on the client side
if (typeof window !== 'undefined') {
  require("leaflet/dist/leaflet.css");
  const leaflet = require('react-leaflet');
  MapContainer = leaflet.MapContainer;
  TileLayer = leaflet.TileLayer;
  CircleMarker = leaflet.CircleMarker;
  Circle = leaflet.Circle;
  Polygon = leaflet.Polygon;
  LayersControl = leaflet.LayersControl;
  LayerGroup = leaflet.LayerGroup;
  useMapEvents = leaflet.useMapEvents;
}

type Severity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type Outbreak = {
  id: string
  position: LatLngExpression
  disease: string
  crop: string
  severity: Severity
  status: "active" | "resolved"
  timestamp: number
}

const initialOutbreaks: Outbreak[] = [
  { id: "a1", position: [19.076, 72.8777], disease: "Leaf Blight", crop: "Tomato", severity: 7, status: "active", timestamp: Date.now() - 60_000 },
  { id: "b2", position: [18.5204, 73.8567], disease: "Powdery Mildew", crop: "Grapes", severity: 4, status: "active", timestamp: Date.now() - 5 * 60_000 },
  { id: "c3", position: [17.385, 78.4867], disease: "Rust", crop: "Wheat", severity: 9, status: "active", timestamp: Date.now() - 15 * 60_000 },
  { id: "d4", position: [12.9716, 77.5946], disease: "Leaf Spot", crop: "Chili", severity: 3, status: "resolved", timestamp: Date.now() - 24 * 60 * 60_000 },
]

function severityColor(sev: Severity | number, status: Outbreak["status"]) {
  if (status === "resolved") return "#16a34a" // green
  if (sev >= 8) return "#ef4444" // red
  if (sev >= 5) return "#f59e0b" // orange
  return "#facc15" // yellow
}

function ClickToDraw({ onPoint }: { onPoint: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPoint(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function OutbreakMap() {
  const { outbreaks: ctxOutbreaks, addOutbreak, setSelectedRegion } = useDashboard()
  const [localOutbreaks, setLocalOutbreaks] = useState<Outbreak[]>(initialOutbreaks)
  const [selected, setSelected] = useState<Outbreak | null>(null)
  const [diseases, setDiseases] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30")
  const [severity, setSeverity] = useState<number>(5)
  const [crop, setCrop] = useState<string>("")
  const [radiusKm, setRadiusKm] = useState<number>(20)
  const [radiusCenter, setRadiusCenter] = useState<LatLngExpression | null>(null)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [drawing, setDrawing] = useState<boolean>(false)
  const [boundaryPoints, setBoundaryPoints] = useState<Array<[number, number]>>([])
  const [isMounted, setIsMounted] = useState(false)

  // Fetch outbreak data from API and simulate real-time updates
  useEffect(() => {
    // Only run on client-side to avoid 'window is not defined' error
    if (typeof window === 'undefined') return;
    
    // Set initial outbreaks immediately to ensure we have data
    setLocalOutbreaks(initialOutbreaks);
    
    // Fetch initial outbreak data from API
    const fetchOutbreaks = async () => {
      try {
        console.log("Fetching outbreak data from API...");
        const response = await fetch('/api/ml/outbreaks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.outbreaks && Array.isArray(data.outbreaks)) {
            // Map API data to local format
            const apiOutbreaks = data.outbreaks.map((o: any) => ({
              id: o.id || Math.random().toString(36).slice(2),
              position: [o.lat, o.lng],
              disease: o.disease,
              crop: o.crop || "Unknown",
              severity: (o.severity || 5) as Severity,
              status: o.status || "active",
              timestamp: o.timestamp || Date.now(),
            }));
            console.log("Successfully fetched outbreak data:", apiOutbreaks.length, "outbreaks");
            if (apiOutbreaks.length > 0) {
              setLocalOutbreaks(apiOutbreaks);
            }
          }
        } else {
          console.warn("API returned non-OK response:", response.status);
          // Keep using initialOutbreaks (already set)
        }
      } catch (error) {
        console.error("Error fetching outbreak data:", error);
        // Continue with mock data (already set)
      }
    };

    // Initial fetch
    fetchOutbreaks();

    // Simulate live updates every 5 minutes (fast cycle 20s for demo)
    const jitter = (v: number) => v + (Math.random() - 0.5) * 0.05
    const id = setInterval(() => {
      setLocalOutbreaks((prev) => {
        const updated = prev.map((o) =>
          o.status === "active"
            ? { ...o, position: [jitter((o.position as [number, number])[0]), jitter((o.position as [number, number])[1])], timestamp: Date.now() }
            : o,
        )
        if (Math.random() > 0.6) {
          updated.push({
            id: Math.random().toString(36).slice(2),
            position: [jitter(19), jitter(73)],
            disease: ["Leaf Blight", "Powdery Mildew", "Rust"][Math.floor(Math.random() * 3)],
            crop: ["Tomato", "Grapes", "Wheat"][Math.floor(Math.random() * 3)],
            severity: (1 + Math.floor(Math.random() * 10)) as Severity,
            status: "active",
            timestamp: Date.now(),
          })
        }
        return updated.slice(-60)
      })
    }, 20_000)
    return () => clearInterval(id)
  }, [])

  // Merge context outbreaks into local display
  const combined = useMemo(() => {
    const mappedCtx: Outbreak[] = ctxOutbreaks.map((o) => ({ id: o.id, position: [o.lat, o.lng], disease: o.disease, crop: o.crop ?? "", severity: Math.max(1, Math.min(10, Math.round(o.severity))), status: o.status, timestamp: o.timestamp }))
    return [...mappedCtx, ...localOutbreaks]
  }, [ctxOutbreaks, localOutbreaks])

  const filtered = useMemo(() => {
    const cutoffMs = Number(dateRange) * 24 * 60 * 60 * 1000
    const now = Date.now()
    return combined.filter((o) => {
      const diseaseOk = diseases.length === 0 || diseases.includes(o.disease)
      const timeOk = now - o.timestamp <= cutoffMs
      const sevOk = o.severity >= severity
      const cropOk = !crop || crop === "all" || o.crop === crop
      let radiusOk = true
      if (radiusCenter) {
        const [clat, clng] = radiusCenter as [number, number]
        const [olat, olng] = o.position as [number, number]
        const R = 6371
        const dLat = ((olat - clat) * Math.PI) / 180
        const dLng = ((olng - clng) * Math.PI) / 180
        const a = Math.sin(dLat / 2) ** 2 + Math.cos((clat * Math.PI) / 180) * Math.cos((olat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const dist = R * c
        radiusOk = dist <= radiusKm
      }
      return diseaseOk && timeOk && sevOk && cropOk && radiusOk
    })
  }, [combined, diseases, dateRange, severity, crop, radiusCenter, radiusKm])

  const center: LatLngExpression = useMemo(() => [18.5204, 73.8567], [])
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* LEFT CONTROL PANEL */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine visible outbreaks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Disease types</div>
              <div className="flex flex-wrap gap-1">
                {["Leaf Blight", "Powdery Mildew", "Rust", "Leaf Spot"].map((d) => (
                  <Badge
                    key={d}
                    variant={diseases.includes(d) ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() =>
                      setDiseases((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
                    }
                  >
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Date range</div>
              <div className="flex gap-2">
                {["7", "30", "90"].map((d) => (
                  <Button key={d} size="sm" variant={dateRange === d ? "default" : "outline"} onClick={() => setDateRange(d as any)}>
                    Last {d}d
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1"><span>Severity</span><span>{severity}</span></div>
              <Slider value={[severity]} onValueChange={(v) => setSeverity(v[0] ?? 5)} min={1} max={10} step={1} />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Crop type</div>
              <Select value={crop || "all"} onValueChange={setCrop}>
                <SelectTrigger><SelectValue placeholder="All crops" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Tomato">Tomato</SelectItem>
                  <SelectItem value="Grapes">Grapes</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                  <SelectItem value="Chili">Chili</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Radius search (km)</div>
              <div className="flex items-center gap-2">
                <Input placeholder="lat, lng" onBlur={(e) => {
                  const [lat, lng] = e.target.value.split(",").map((x) => parseFloat(x.trim()))
                  if (!Number.isNaN(lat) && !Number.isNaN(lng)) setRadiusCenter([lat, lng])
                }} />
                <Input type="number" className="w-24" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value) || 0)} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setShowHeatmap((s) => !s)}>{showHeatmap ? "Hide" : "Show"} Heatmap</Button>
              <Button size="sm" variant={drawing ? "default" : "outline"} onClick={() => setDrawing((d) => !d)}>{drawing ? "Finish" : "Draw"} Boundary</Button>
              <Button size="sm" variant="outline" onClick={() => setBoundaryPoints([])}>Reset</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAP */}
      <div className="lg:col-span-3">
        <div className="h-[600px] w-full rounded-md overflow-hidden border">
          {isMounted && (
            <MapContainer center={center} zoom={6} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Terrain">
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    attribution="Imagery &copy; Esri"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay checked name="Outbreaks">
                  <LayerGroup>
                    {filtered.map((o) => (
                      <CircleMarker
                        key={o.id}
                        center={o.position}
                        radius={8}
                        pathOptions={{ color: severityColor(o.severity, o.status), fillOpacity: 0.8 }}
                        eventHandlers={{ click: () => { setSelected(o); setSelectedRegion({ lat: (o.position as [number, number])[0], lng: (o.position as [number, number])[1], radiusKm: 25 }) } }}
                      />
                    ))}
                  </LayerGroup>
                </LayersControl.Overlay>

                {showHeatmap && (
                  <LayersControl.Overlay checked name="Heatmap">
                    <LayerGroup>
                      {filtered.map((o) => (
                        <Circle key={`h-${o.id}`} center={o.position} radius={o.severity * 1000} pathOptions={{ color: severityColor(o.severity, o.status), opacity: 0.15, weight: 1, fillOpacity: 0.1 }} />
                      ))}
                    </LayerGroup>
                  </LayersControl.Overlay>
                )}
              </LayersControl>

              {radiusCenter && (
                <Circle center={radiusCenter} radius={radiusKm * 1000} pathOptions={{ color: "#3b82f6", opacity: 0.5 }} />
              )}

              {boundaryPoints.length > 2 && (
                <Polygon positions={boundaryPoints} pathOptions={{ color: "#22c55e", weight: 2, fillOpacity: 0.05 }} />
              )}

              {drawing && (
                <ClickToDraw onPoint={(lat, lng) => setBoundaryPoints((pts) => [...pts, [lat, lng]])} />
              )}
            </MapContainer>
          )}
        </div>
      </div>

      {/* RIGHT DATA DISPLAY */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Selected outbreak</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {selected ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{selected.disease}</div>
                    <div className="text-muted-foreground">{selected.crop}</div>
                  </div>
                  <Badge style={{ backgroundColor: severityColor(selected.severity, selected.status), color: "#111" }}>
                    Sev {selected.severity}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">Updated {new Date(selected.timestamp).toLocaleString()}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-md border">
                    <div className="text-xs text-muted-foreground">Affected area</div>
                    <div className="font-medium">{(selected.severity * 2).toFixed(1)} ha</div>
                  </div>
                  <div className="p-2 rounded-md border">
                    <div className="text-xs text-muted-foreground">Nearby farms</div>
                    <div className="font-medium">{Math.max(1, Math.round(selected.severity / 2))}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Containment</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Isolate affected plot</li>
                    <li>Remove infected leaves</li>
                    <li>Schedule targeted spray</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground">Click a marker to view details.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OutbreakMap


