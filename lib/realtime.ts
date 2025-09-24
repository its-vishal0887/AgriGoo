import { io, Socket } from 'socket.io-client';

type WeatherEvent = {
  type: "weather"
  payload: { tempC: number; humidity: number; alert?: string }
}

type OutbreakEvent = {
  type: "outbreak"
  payload: { lat: number; lng: number; disease: string; severity: number; status: "active" | "resolved" }
}

type ScanEvent = {
  type: "scan"
  payload: { farmId: string; status: "complete" | "in_progress"; results?: any }
}

type TreatmentEvent = {
  type: "treatment"
  payload: { farmId: string; progress: number; treatment: string }
}

export type RealtimeEvent = WeatherEvent | OutbreakEvent | ScanEvent | TreatmentEvent

type Listener = (event: RealtimeEvent) => void

class RealtimeClient {
  private socket: Socket | null = null
  private listeners: Set<Listener> = new Set()
  private mockTimers: number[] = []
  private connected: boolean = false

  addListener(fn: Listener) {
    this.listeners.add(fn)
    return () => this.removeListener(fn)
  }

  removeListener(fn: Listener) {
    this.listeners.delete(fn)
  }

  start() {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    
    if (typeof window !== "undefined") {
      try {
        this.socket = io(url, {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });
        
        this.socket.on('connect', () => {
          console.log('Connected to Socket.IO server');
          this.connected = true;
          
          // Clear mock timers if we were using them
          this.mockTimers.forEach((id) => clearInterval(id));
          this.mockTimers = [];
        });
        
        // Join farm room if farmId is available
        const farmId = localStorage.getItem('farmId');
        if (farmId) {
          this.joinFarm(farmId);
        }
        
        // Join region room if region is available
        const region = localStorage.getItem('region');
        if (region) {
          this.joinRegion(region);
        }
        
        // Listen for events
        this.socket.on('outbreak-alert', (data) => {
          this.emit({
            type: 'outbreak',
            payload: {
              lat: data.lat,
              lng: data.lng,
              disease: data.disease,
              severity: data.severity,
              status: data.status || 'active'
            }
          });
        });
        
        this.socket.on('weather-notification', (data) => {
          this.emit({
            type: 'weather',
            payload: {
              tempC: data.tempC,
              humidity: data.humidity,
              alert: data.alert
            }
          });
        });
        
        this.socket.on('scan-update', (data) => {
          this.emit({
            type: 'scan',
            payload: {
              farmId: data.farmId,
              status: data.status,
              results: data.results
            }
          });
        });
        
        this.socket.on('treatment-progress', (data) => {
          this.emit({
            type: 'treatment',
            payload: {
              farmId: data.farmId,
              progress: data.progress,
              treatment: data.treatment
            }
          });
        });
        
        this.socket.on('disconnect', () => {
          console.log('Disconnected from Socket.IO server');
          this.connected = false;
          
          // Fall back to mock if disconnected
          this.startMock();
        });
        
        return;
      } catch (error) {
        console.error('Socket connection error:', error);
        // Fall back to mock
      }
    }
    this.startMock();
  }

  stop() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
    this.mockTimers.forEach((id) => clearInterval(id));
    this.mockTimers = [];
  }
  
  joinFarm(farmId: string) {
    if (this.socket && this.connected) {
      this.socket.emit('join-farm', farmId);
      localStorage.setItem('farmId', farmId);
    }
  }
  
  joinRegion(region: string) {
    if (this.socket && this.connected) {
      this.socket.emit('join-region', region);
      localStorage.setItem('region', region);
    }
  }
  
  reportOutbreak(data: { region: string; lat: number; lng: number; disease: string; severity: number }) {
    if (this.socket && this.connected) {
      this.socket.emit('new-outbreak', data);
    }
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
    // Scan updates every 60s
    const s = window.setInterval(() => {
      const farmId = localStorage.getItem('farmId') || 'farm-123';
      this.emit({ 
        type: "scan", 
        payload: { 
          farmId, 
          status: "complete",
          results: {
            healthScore: Math.floor(Math.random() * 100),
            detectedIssues: Math.random() > 0.7 ? ["Leaf spots", "Discoloration"] : []
          }
        } 
      })
    }, 60_000)
    // Treatment updates every 75s
    const t = window.setInterval(() => {
      const farmId = localStorage.getItem('farmId') || 'farm-123';
      const treatments = ["Fungicide Application", "Organic Spray", "Crop Rotation"];
      const treatment = treatments[Math.floor(Math.random() * treatments.length)];
      this.emit({ 
        type: "treatment", 
        payload: { 
          farmId, 
          progress: Math.floor(Math.random() * 100),
          treatment
        } 
      })
    }, 75_000)
    this.mockTimers.push(w, o, s, t)
  }

  private emit(event: RealtimeEvent) {
    this.listeners.forEach((fn) => fn(event))
  }
}

export const realtimeClient = new RealtimeClient()


