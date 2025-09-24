"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useEffect } from "react"
import { realtimeClient, type RealtimeEvent } from "@/lib/realtime"

export type OutbreakItem = {
  id: string
  lat: number
  lng: number
  disease: string
  crop?: string
  severity: number
  status: "active" | "resolved"
  timestamp: number
}

export type AlertItem = {
  id: string
  type: "info" | "warning" | "danger"
  message: string
  timestamp: number
}

type Region = { lat: number; lng: number; radiusKm?: number } | null

type DashboardContextType = {
  outbreaks: OutbreakItem[]
  addOutbreak: (o: Omit<OutbreakItem, "id" | "timestamp">) => void
  updateOutbreak: (id: string, patch: Partial<OutbreakItem>) => void

  selectedRegion: Region
  setSelectedRegion: (r: Region) => void

  alerts: AlertItem[]
  pushAlert: (a: Omit<AlertItem, "id" | "timestamp">) => void

  recommendations: string[]
  setRecommendations: (items: string[]) => void

  userPrefs: Record<string, unknown>
  setUserPref: (key: string, value: unknown) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [outbreaks, setOutbreaks] = useState<OutbreakItem[]>([])
  const [selectedRegion, setSelectedRegion] = useState<Region>(null)
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [userPrefs, setUserPrefs] = useState<Record<string, unknown>>({})

  const addOutbreak = useCallback((o: Omit<OutbreakItem, "id" | "timestamp">) => {
    setOutbreaks((prev) => [{ ...o, id: Math.random().toString(36).slice(2), timestamp: Date.now() }, ...prev].slice(0, 200))
  }, [])

  const updateOutbreak = useCallback((id: string, patch: Partial<OutbreakItem>) => {
    setOutbreaks((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }, [])

  const pushAlert = useCallback((a: Omit<AlertItem, "id" | "timestamp">) => {
    setAlerts((prev) => [{ ...a, id: Math.random().toString(36).slice(2), timestamp: Date.now() }, ...prev].slice(0, 50))
  }, [])

  const setUserPref = useCallback((key: string, value: unknown) => {
    setUserPrefs((prev) => ({ ...prev, [key]: value }))
  }, [])

  // start realtime listeners
  useEffect(() => {
    realtimeClient.start()
    const off = realtimeClient.addListener((event: RealtimeEvent) => {
      if (event.type === "weather") {
        if (event.payload.alert) {
          pushAlert({ type: "warning", message: `Weather alert: ${event.payload.alert}` })
        }
        setUserPrefs((prev) => ({ ...prev, liveTempC: event.payload.tempC, liveHumidity: event.payload.humidity }))
      }
      if (event.type === "outbreak") {
        addOutbreak({ lat: event.payload.lat, lng: event.payload.lng, disease: event.payload.disease, severity: event.payload.severity, status: event.payload.status })
      }
    })
    return () => {
      off()
      realtimeClient.stop()
    }
  }, [addOutbreak, pushAlert])

  const value = useMemo(
    () => ({ outbreaks, addOutbreak, updateOutbreak, selectedRegion, setSelectedRegion, alerts, pushAlert, recommendations, setRecommendations, userPrefs, setUserPref }),
    [outbreaks, addOutbreak, updateOutbreak, selectedRegion, alerts, pushAlert, recommendations, userPrefs, setUserPref],
  )

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}


