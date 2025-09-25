import dynamic from 'next/dynamic'

// Dynamically import the map component with SSR disabled
const OutbreakMap = dynamic(
  () => import('@/components/outbreak-map'),
  { ssr: false }
)

export default function OutbreakMapPage() {
  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Disease Outbreak Map</h1>
        <p className="text-muted-foreground">
          Track and monitor crop disease outbreaks across regions
        </p>
      </div>
      <OutbreakMap />
    </div>
  )
}