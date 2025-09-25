"use client"

import dynamic from 'next/dynamic'

// Dynamically import the map component with no SSR to avoid leaflet issues
const OutbreakMap = dynamic(() => import("@/components/outbreak-map"), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center border rounded-md">Loading map...</div>
})

export default function OutbreakMapPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Outbreak Map</h1>
        <p className="text-muted-foreground">
          Real-time visualization of crop disease outbreaks across regions.
        </p>
      </div>
      <OutbreakMap />
    </div>
  )
}