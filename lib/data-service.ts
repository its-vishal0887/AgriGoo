/**
 * Data Processing Service for AgriGoo Frontend
 * Handles real-time data processing and API interactions
 */

import axios from 'axios';
import { RealtimeClient } from './realtime';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SensorData {
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  soilTemperature?: number;
  pH?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  timestamp?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed?: number;
  location?: { lat: number; lng: number };
  timestamp?: string;
}

export interface TreatmentData {
  treatmentId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  type: string;
  progress?: number;
  startTime?: string;
  endTime?: string;
  notes?: string;
  timestamp?: string;
}

export interface AlertThresholds {
  temperature?: { min: number; max: number };
  humidity?: { min: number; max: number };
  soilMoisture?: { min: number; max: number };
  rainfall?: { min: number; max: number };
}

class DataService {
  private token: string | null = null;
  private realtimeClient: RealtimeClient;
  private farmId: string | null = null;
  private regionId: string | null = null;

  constructor() {
    this.realtimeClient = new RealtimeClient();
  }

  /**
   * Initialize the data service with user credentials
   */
  initialize(token: string, farmId?: string, regionId?: string) {
    this.token = token;
    
    if (farmId) {
      this.setFarmId(farmId);
    }
    
    if (regionId) {
      this.setRegionId(regionId);
    }
    
    // Start realtime connection
    this.realtimeClient.start();
    
    return this;
  }

  /**
   * Set farm ID and join farm room
   */
  setFarmId(farmId: string) {
    this.farmId = farmId;
    
    // Join farm room for real-time updates
    if (this.realtimeClient.isConnected()) {
      this.realtimeClient.joinFarm(farmId);
    }
    
    return this;
  }

  /**
   * Set region ID and join region room
   */
  setRegionId(regionId: string) {
    this.regionId = regionId;
    
    // Join region room for real-time updates
    if (this.realtimeClient.isConnected()) {
      this.realtimeClient.joinRegion(regionId);
    }
    
    return this;
  }

  /**
   * Get authentication headers
   */
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: this.token ? `Bearer ${this.token}` : '',
    };
  }

  /**
   * Initialize data processing for a farm
   */
  async initializeFarmProcessing(config?: any) {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/initialize-farm`,
        {
          farmId: this.farmId,
          config,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error initializing farm processing:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Stop data processing for a farm
   */
  async stopFarmProcessing() {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/stop-farm`,
        {
          farmId: this.farmId,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error stopping farm processing:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send sensor data to the server
   */
  async sendSensorData(data: SensorData) {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/sensor`,
        {
          farmId: this.farmId,
          data: {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error sending sensor data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send weather data to the server
   */
  async sendWeatherData(data: WeatherData) {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/weather`,
        {
          farmId: this.farmId,
          data: {
            ...data,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error sending weather data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send image for disease detection scan
   */
  async sendImageScan(imageBase64: string, location?: { lat: number; lng: number }, metadata?: any) {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/image-scan`,
        {
          farmId: this.farmId,
          image: imageBase64,
          location,
          metadata,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error sending image scan:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send treatment update
   */
  async sendTreatmentUpdate(treatmentData: TreatmentData) {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/treatment-update`,
        {
          farmId: this.farmId,
          treatmentData: {
            ...treatmentData,
            timestamp: treatmentData.timestamp || new Date().toISOString(),
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error sending treatment update:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update alert thresholds
   */
  async updateAlertThresholds(thresholds: AlertThresholds) {
    if (!this.farmId) {
      throw new Error('Farm ID not set');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/data/update-thresholds`,
        {
          farmId: this.farmId,
          thresholds,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error updating alert thresholds:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Report outbreak via realtime
   */
  reportOutbreak(data: {
    disease: string;
    severity: number;
    location: { lat: number; lng: number };
    notes?: string;
  }) {
    if (!this.regionId) {
      console.warn('Region ID not set, outbreak report may not be properly routed');
    }

    this.realtimeClient.reportOutbreak({
      ...data,
      region: this.regionId || 'unknown',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Subscribe to outbreak alerts
   */
  onOutbreakAlert(callback: (data: any) => void) {
    this.realtimeClient.onOutbreakAlert(callback);
    return this;
  }

  /**
   * Subscribe to weather notifications
   */
  onWeatherAlert(callback: (data: any) => void) {
    this.realtimeClient.onWeatherAlert(callback);
    return this;
  }

  /**
   * Subscribe to scan updates
   */
  onScanUpdate(callback: (data: any) => void) {
    this.realtimeClient.onScanUpdate(callback);
    return this;
  }

  /**
   * Subscribe to treatment progress
   */
  onTreatmentProgress(callback: (data: any) => void) {
    this.realtimeClient.onTreatmentProgress(callback);
    return this;
  }

  /**
   * Disconnect realtime client
   */
  disconnect() {
    this.realtimeClient.stop();
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data.message || 'Server error';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server. Please check your connection.');
    } else {
      // Error setting up request
      return new Error('Error setting up request: ' + error.message);
    }
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;