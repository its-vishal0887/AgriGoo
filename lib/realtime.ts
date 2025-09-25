type WeatherEvent = {
  type: "weather"
  payload: { tempC: number; humidity: number; alert?: string }
}

type OutbreakEvent = {
  type: "outbreak"
  payload: { lat: number; lng: number; disease: string; severity: number; status: "active" | "resolved" }
}

export type RealtimeEvent = WeatherEvent | OutbreakEvent

type Listener = (event: RealtimeEvent) => void

class RealtimeClient {
  private ws: WebSocket | null = null
  private listeners: Set<Listener> = new Set()
  private mockTimers: number[] = []

  addListener(fn: Listener) {
    this.listeners.add(fn)
    return () => this.removeListener(fn)
  }

  removeListener(fn: Listener) {
    this.listeners.delete(fn)
  }

  start() {
    const url = process.env.NEXT_PUBLIC_WS_URL
    if (typeof window !== "undefined" && url) {
      try {
        this.ws = new WebSocket(url)
        this.ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data)
            if (data && data.type) this.emit(data as RealtimeEvent)
          } catch {}
        }
        this.ws.onclose = () => {
          // fallback to mock if disconnected
          this.startMock()
        }
        return
      } catch {
        // ignore and use mock
      }
    }
    this.startMock()
  }

  stop() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.mockTimers.forEach((id) => clearInterval(id))
    this.mockTimers = []
  }

  private startMock() {
    // Weather every 30s
    const w = window.setInterval(() => {
      const tempC = 24 + Math.round((Math.random() - 0.5) * 6)
      const humidity = 50 + Math.round(Math.random() * 40)
      const alert = Math.random() > 0.92 ? "Severe Thunderstorm" : undefined
      this.emit({ type: "weather", payload: { tempC, humidity, alert } })
    }, 30_000)
    // Outbreak every 45s
    const o = window.setInterval(() => {
      const diseases = ["Powdery Mildew", "Leaf Blight", "Rust"]
      const d = diseases[Math.floor(Math.random() * diseases.length)]
      const lat = 18 + Math.random() * 4
      const lng = 73 + Math.random() * 4
      const severity = 1 + Math.floor(Math.random() * 10)
      this.emit({ type: "outbreak", payload: { lat, lng, disease: d, severity, status: "active" } })
    }, 45_000)
    this.mockTimers.push(w, o)
  }

  private emit(event: RealtimeEvent) {
    this.listeners.forEach((fn) => fn(event))
  }
}

export const realtimeClient = new RealtimeClient()


