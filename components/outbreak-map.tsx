"use client"

import { useEffect, useRef } from "react"

interface OutbreakData {
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

interface OutbreakMapProps {
  data: OutbreakData[]
  showHeatmap?: boolean
  showClusters?: boolean
  onMarkerClick?: (outbreak: OutbreakData) => void
}

export default function OutbreakMap({ data, showHeatmap, showClusters, onMarkerClick }: OutbreakMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // For now, we'll create a simple placeholder map
    // In a real implementation, this would integrate with a mapping library like Leaflet or Google Maps
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" viewBox="0 0 800 600">
              <!-- Simple world map outline -->
              <path d="M100 200 Q200 150 300 200 T500 180 Q600 200 700 220 L700 400 Q600 380 500 400 T300 420 Q200 400 100 380 Z" 
                    fill="rgba(34, 197, 94, 0.3)" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="2"/>
            </svg>
          </div>
          
          <!-- Outbreak markers -->
          ${data
            .map((outbreak, index) => {
              const x = 150 + ((index * 120) % 500)
              const y = 200 + ((index * 80) % 200)
              const severityColor =
                outbreak.severity === "high" ? "#ef4444" : outbreak.severity === "medium" ? "#f59e0b" : "#10b981"

              return `
              <div class="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group" 
                   style="left: ${x}px; top: ${y}px;"
                   onclick="window.selectOutbreak && window.selectOutbreak('${outbreak.id}')">
                <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse" 
                     style="background-color: ${severityColor}"></div>
                <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${outbreak.disease} - ${outbreak.crop}
                </div>
              </div>
            `
            })
            .join("")}
          
          <div class="text-center z-10">
            <h3 class="text-2xl font-bold text-gray-700 mb-2">Interactive Disease Map</h3>
            <p class="text-gray-600 mb-4">Click on markers to view outbreak details</p>
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p class="text-sm text-gray-600 mb-2">Map Features:</p>
              <div class="flex items-center space-x-4 text-xs">
                <div class="flex items-center space-x-1">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Severity</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium</span>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
    // Set up global function for marker clicks
    ;(window as any).selectOutbreak = (id: string) => {
      const outbreak = data.find((d) => d.id === id)
      if (outbreak && onMarkerClick) {
        onMarkerClick(outbreak)
      }
    }

    return () => {
      delete (window as any).selectOutbreak
    }
  }, [data, showHeatmap, showClusters, onMarkerClick])

  return <div ref={mapRef} className="w-full h-full" />
}
