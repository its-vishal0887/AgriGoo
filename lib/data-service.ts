// Data service for real-time sensor data

export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
  timestamp: string;
}

interface ScanUpdateData {
  type: 'soil' | 'crop' | 'weather';
  sensorData?: SensorData;
}

type ScanUpdateCallback = (data: ScanUpdateData) => void;

class DataService {
  private apiEndpoint = "https://api.agrigoo.com/v1/data";
  private token: string | null = null;
  private farmId: string | null = null;
  private callbacks: ScanUpdateCallback[] = [];
  private mockDataInterval: NodeJS.Timeout | null = null;

  public initialize(token: string, farmId: string) {
    this.token = token;
    this.farmId = farmId;
    
    // In a real app, this would connect to a WebSocket or similar
    // For demo purposes, we'll simulate updates
    this.startMockDataUpdates();
  }

  public disconnect() {
    if (this.mockDataInterval) {
      clearInterval(this.mockDataInterval);
      this.mockDataInterval = null;
    }
  }

  public onScanUpdate(callback: ScanUpdateCallback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  public async getSensorData(): Promise<SensorData> {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll return mock data
    return this.getMockSensorData();
  }

  private startMockDataUpdates() {
    this.mockDataInterval = setInterval(() => {
      const updateData: ScanUpdateData = {
        type: 'soil',
        sensorData: this.getMockSensorData()
      };
      
      this.callbacks.forEach(callback => callback(updateData));
    }, 30000); // Update every 30 seconds
  }

  private getMockSensorData(): SensorData {
    return {
      temperature: 22 + Math.random() * 5,
      humidity: 65 + Math.random() * 10,
      soilMoisture: 40 + Math.random() * 15,
      lightLevel: 75 + Math.random() * 20,
      timestamp: new Date().toISOString()
    };
  }
}

export const dataService = new DataService();