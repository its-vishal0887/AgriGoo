/**
 * ML Service for AgriGoo Frontend
 * Handles interactions with ML API endpoints
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface DetectionResult {
  disease: string;
  confidence: number;
  isHealthy: boolean;
  timestamp: string;
  isMock?: boolean;
  metadata?: {
    farmId?: string;
    location?: { lat: number; lng: number };
    plantType?: string;
    notes?: string;
  };
}

export interface SpreadPrediction {
  disease: string;
  spreadFactor: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  affectedArea: {
    center: { lat: number; lng: number };
    radiusKm: number;
    affectedFarms: number;
  };
  recommendations: string[];
  timestamp: string;
}

export interface SoilHealthAnalysis {
  healthScore: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  deficiencies: string[];
  recommendations: string[];
  timestamp: string;
}

export interface SensorData {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture?: number;
  temperature?: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed?: number;
  location?: { lat: number; lng: number };
}

class MLService {
  private token: string | null = null;

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token;
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
   * Detect disease from image file
   */
  async detectDiseaseFromFile(
    imageFile: File,
    metadata?: {
      farmId?: string;
      location?: { lat: number; lng: number };
      plantType?: string;
      notes?: string;
    }
  ): Promise<DetectionResult> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      if (metadata) {
        if (metadata.farmId) formData.append('farmId', metadata.farmId);
        if (metadata.location) formData.append('location', JSON.stringify(metadata.location));
        if (metadata.plantType) formData.append('plantType', metadata.plantType);
        if (metadata.notes) formData.append('notes', metadata.notes);
      }

      const response = await axios.post(
        `${API_BASE_URL}/ml/detect-disease`,
        formData,
        {
          headers: {
            ...this.getHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error detecting disease from file:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Detect disease from base64 image
   */
  async detectDiseaseFromBase64(
    base64Image: string,
    metadata?: {
      farmId?: string;
      location?: { lat: number; lng: number };
      plantType?: string;
      notes?: string;
    }
  ): Promise<DetectionResult> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ml/detect-disease-base64`,
        {
          image: base64Image,
          metadata,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error detecting disease from base64:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Predict disease spread
   */
  async predictDiseaseSpread(
    disease: string,
    location: { lat: number; lng: number },
    weatherData: WeatherData
  ): Promise<SpreadPrediction> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ml/predict-spread`,
        {
          disease,
          location,
          weatherData,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error predicting disease spread:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Analyze soil health
   */
  async analyzeSoilHealth(sensorData: SensorData): Promise<SoilHealthAnalysis> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/ml/analyze-soil`,
        {
          sensorData,
        },
        {
          headers: this.getHeaders(),
        }
      );

      return response.data.data;
    } catch (error) {
      console.error('Error analyzing soil health:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check ML model status
   */
  async checkModelStatus(): Promise<{ modelLoaded: boolean; modelType: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ml/model-status`, {
        headers: this.getHeaders(),
      });

      return response.data.data;
    } catch (error) {
      console.error('Error checking model status:', error);
      throw this.handleError(error);
    }
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
export const mlService = new MLService();
export default mlService;