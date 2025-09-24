/**
 * Data Processing Service for AgriGoo
 * Handles real-time data processing, aggregation, and analysis
 */
const mlService = require('./mlService');
const RealtimeService = require('./realtimeService');

class DataProcessingService {
  constructor(io) {
    this.io = io;
    this.realtimeService = new RealtimeService(io);
    this.dataStreams = new Map();
    this.processingIntervals = new Map();
    this.alertThresholds = {
      temperature: { min: 5, max: 35 },
      humidity: { min: 30, max: 80 },
      soilMoisture: { min: 20, max: 80 },
      rainfall: { min: 0, max: 50 }
    };
  }

  /**
   * Initialize data processing for a farm
   * @param {String} farmId - Farm identifier
   * @param {Object} initialConfig - Initial configuration for processing
   */
  initializeFarmProcessing(farmId, initialConfig = {}) {
    // Create data stream container for this farm if it doesn't exist
    if (!this.dataStreams.has(farmId)) {
      this.dataStreams.set(farmId, {
        sensorData: [],
        weatherData: [],
        imageData: [],
        lastProcessed: Date.now(),
        config: {
          processingInterval: 60000, // 1 minute default
          alertingEnabled: true,
          ...initialConfig
        }
      });

      // Set up periodic processing for this farm
      const interval = setInterval(() => {
        this.processBatchData(farmId);
      }, this.dataStreams.get(farmId).config.processingInterval);
      
      this.processingIntervals.set(farmId, interval);
      
      console.log(`Initialized data processing for farm: ${farmId}`);
    }
    
    return {
      farmId,
      status: 'initialized',
      config: this.dataStreams.get(farmId).config
    };
  }

  /**
   * Stop data processing for a farm
   * @param {String} farmId - Farm identifier
   */
  stopFarmProcessing(farmId) {
    if (this.processingIntervals.has(farmId)) {
      clearInterval(this.processingIntervals.get(farmId));
      this.processingIntervals.delete(farmId);
      console.log(`Stopped data processing for farm: ${farmId}`);
    }
    
    return { farmId, status: 'stopped' };
  }

  /**
   * Process incoming sensor data
   * @param {String} farmId - Farm identifier
   * @param {Object} data - Sensor data
   */
  processSensorData(farmId, data) {
    // Initialize farm processing if not already done
    if (!this.dataStreams.has(farmId)) {
      this.initializeFarmProcessing(farmId);
    }
    
    // Add timestamp if not present
    const processedData = {
      ...data,
      timestamp: data.timestamp || new Date(),
      processed: false
    };
    
    // Add to data stream
    this.dataStreams.get(farmId).sensorData.push(processedData);
    
    // Check for immediate alerts
    this.checkForAlerts(farmId, processedData);
    
    return { status: 'received', dataId: processedData.timestamp };
  }

  /**
   * Process incoming weather data
   * @param {String} farmId - Farm identifier
   * @param {Object} data - Weather data
   */
  processWeatherData(farmId, data) {
    // Initialize farm processing if not already done
    if (!this.dataStreams.has(farmId)) {
      this.initializeFarmProcessing(farmId);
    }
    
    // Add timestamp if not present
    const processedData = {
      ...data,
      timestamp: data.timestamp || new Date(),
      processed: false
    };
    
    // Add to data stream
    this.dataStreams.get(farmId).weatherData.push(processedData);
    
    // Check for immediate weather alerts
    this.checkForWeatherAlerts(farmId, processedData);
    
    return { status: 'received', dataId: processedData.timestamp };
  }

  /**
   * Process incoming image data for disease detection
   * @param {String} farmId - Farm identifier
   * @param {Object} data - Image data with buffer or base64
   */
  async processImageData(farmId, data) {
    // Initialize farm processing if not already done
    if (!this.dataStreams.has(farmId)) {
      this.initializeFarmProcessing(farmId);
    }
    
    try {
      // Add to data stream first
      const processedData = {
        ...data,
        timestamp: data.timestamp || new Date(),
        processed: false,
        scanId: `scan-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      };
      
      this.dataStreams.get(farmId).imageData.push(processedData);
      
      // Notify that scan has started
      this.realtimeService.sendScanUpdate(farmId, {
        scanId: processedData.scanId,
        status: 'processing',
        progress: 0,
        message: 'Starting image analysis',
        timestamp: new Date()
      });
      
      // Process with ML service (non-blocking)
      this.processScanAsync(farmId, processedData);
      
      return { 
        status: 'processing', 
        scanId: processedData.scanId,
        message: 'Image scan initiated'
      };
    } catch (error) {
      console.error(`Error processing image data for farm ${farmId}:`, error);
      return { 
        status: 'error', 
        message: 'Failed to process image data',
        error: error.message
      };
    }
  }

  /**
   * Process scan asynchronously and send updates
   * @private
   */
  async processScanAsync(farmId, imageData) {
    try {
      // Update progress
      this.realtimeService.sendScanUpdate(farmId, {
        scanId: imageData.scanId,
        status: 'processing',
        progress: 30,
        message: 'Analyzing image patterns',
        timestamp: new Date()
      });
      
      // Short delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update progress
      this.realtimeService.sendScanUpdate(farmId, {
        scanId: imageData.scanId,
        status: 'processing',
        progress: 60,
        message: 'Running disease detection model',
        timestamp: new Date()
      });
      
      // Process with ML service
      const detectionResult = await mlService.detectDisease(imageData.image);
      
      // Update progress
      this.realtimeService.sendScanUpdate(farmId, {
        scanId: imageData.scanId,
        status: 'completed',
        progress: 100,
        message: 'Analysis complete',
        result: detectionResult,
        timestamp: new Date()
      });
      
      // If disease detected, send alert
      if (detectionResult && !detectionResult.isHealthy) {
        this.handleDiseaseDetection(farmId, detectionResult, imageData);
      }
      
      // Mark as processed
      const farmData = this.dataStreams.get(farmId);
      const imageIndex = farmData.imageData.findIndex(img => img.scanId === imageData.scanId);
      if (imageIndex !== -1) {
        farmData.imageData[imageIndex].processed = true;
        farmData.imageData[imageIndex].result = detectionResult;
      }
      
    } catch (error) {
      console.error(`Error in async scan processing for farm ${farmId}:`, error);
      
      // Send error update
      this.realtimeService.sendScanUpdate(farmId, {
        scanId: imageData.scanId,
        status: 'error',
        progress: 0,
        message: 'Error analyzing image',
        error: error.message,
        timestamp: new Date()
      });
    }
  }

  /**
   * Handle disease detection result
   * @private
   */
  async handleDiseaseDetection(farmId, detectionResult, imageData) {
    try {
      // Get location from image metadata or farm data
      const location = imageData.location || { lat: 0, lng: 0 }; // Default or get from farm settings
      
      // Get latest weather data for this farm
      const farmData = this.dataStreams.get(farmId);
      const latestWeather = farmData.weatherData.length > 0 
        ? farmData.weatherData[farmData.weatherData.length - 1] 
        : { temperature: 25, humidity: 60, rainfall: 0 };
      
      // Predict disease spread
      const spreadPrediction = await mlService.predictDiseaseSpread({
        disease: detectionResult.disease,
        location,
        weatherData: latestWeather
      });
      
      // Send outbreak alert with prediction
      this.realtimeService.sendOutbreakAlert(farmId, {
        disease: detectionResult.disease,
        confidence: detectionResult.confidence,
        location,
        prediction: spreadPrediction,
        scanId: imageData.scanId,
        timestamp: new Date()
      });
      
    } catch (error) {
      console.error(`Error handling disease detection for farm ${farmId}:`, error);
    }
  }

  /**
   * Process batch data periodically
   * @private
   */
  processBatchData(farmId) {
    if (!this.dataStreams.has(farmId)) return;
    
    const farmData = this.dataStreams.get(farmId);
    const now = Date.now();
    
    // Process only data that hasn't been processed yet
    const newSensorData = farmData.sensorData.filter(data => !data.processed);
    const newWeatherData = farmData.weatherData.filter(data => !data.processed);
    
    if (newSensorData.length > 0 || newWeatherData.length > 0) {
      // Perform batch analysis
      this.analyzeBatchData(farmId, newSensorData, newWeatherData);
      
      // Mark data as processed
      newSensorData.forEach(data => { data.processed = true; });
      newWeatherData.forEach(data => { data.processed = true; });
      
      // Update last processed timestamp
      farmData.lastProcessed = now;
    }
    
    // Clean up old data (keep last 24 hours)
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    farmData.sensorData = farmData.sensorData.filter(data => 
      new Date(data.timestamp).getTime() > oneDayAgo
    );
    farmData.weatherData = farmData.weatherData.filter(data => 
      new Date(data.timestamp).getTime() > oneDayAgo
    );
    farmData.imageData = farmData.imageData.filter(data => 
      new Date(data.timestamp).getTime() > oneDayAgo
    );
  }

  /**
   * Analyze batch data for trends and insights
   * @private
   */
  analyzeBatchData(farmId, sensorData, weatherData) {
    if (sensorData.length === 0 && weatherData.length === 0) return;
    
    // Combine latest data for soil health analysis
    if (sensorData.length > 0) {
      const latestSensor = sensorData[sensorData.length - 1];
      
      // If we have complete soil data, analyze soil health
      if (latestSensor.pH && latestSensor.nitrogen && 
          latestSensor.phosphorus && latestSensor.potassium) {
        
        const soilHealth = mlService.analyzeSoilHealth({
          pH: latestSensor.pH,
          nitrogen: latestSensor.nitrogen,
          phosphorus: latestSensor.phosphorus,
          potassium: latestSensor.potassium,
          moisture: latestSensor.soilMoisture || 50,
          temperature: latestSensor.soilTemperature || 20
        });
        
        // Send soil health update
        this.realtimeService.sendFarmNotification(farmId, {
          type: 'soil_health',
          data: soilHealth,
          timestamp: new Date()
        });
      }
    }
    
    // Analyze weather trends if we have enough data
    if (weatherData.length >= 3) {
      this.analyzeWeatherTrends(farmId, weatherData);
    }
  }

  /**
   * Analyze weather trends for potential issues
   * @private
   */
  analyzeWeatherTrends(farmId, weatherData) {
    // Sort by timestamp
    const sortedData = [...weatherData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Check for rapid changes
    if (sortedData.length >= 3) {
      const latest = sortedData[sortedData.length - 1];
      const previous = sortedData[sortedData.length - 2];
      
      // Check for rapid temperature drop (could indicate frost)
      if (latest.temperature < previous.temperature - 5) {
        this.realtimeService.sendWeatherAlert(farmId, {
          type: 'frost_risk',
          message: 'Rapid temperature drop detected. Potential frost risk.',
          current: latest.temperature,
          previous: previous.temperature,
          difference: previous.temperature - latest.temperature,
          timestamp: new Date()
        });
      }
      
      // Check for rapid humidity increase (could indicate disease-favorable conditions)
      if (latest.humidity > previous.humidity + 15 && latest.humidity > 80) {
        this.realtimeService.sendWeatherAlert(farmId, {
          type: 'disease_risk',
          message: 'Rapid humidity increase detected. Conditions favorable for disease development.',
          current: latest.humidity,
          previous: previous.humidity,
          difference: latest.humidity - previous.humidity,
          timestamp: new Date()
        });
      }
      
      // Check for heavy rainfall
      if (latest.rainfall > 20) {
        this.realtimeService.sendWeatherAlert(farmId, {
          type: 'heavy_rainfall',
          message: 'Heavy rainfall detected. Check for flooding and drainage issues.',
          rainfall: latest.rainfall,
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * Check for immediate alerts from sensor data
   * @private
   */
  checkForAlerts(farmId, sensorData) {
    const alerts = [];
    
    // Check each sensor value against thresholds
    if (sensorData.temperature !== undefined) {
      if (sensorData.temperature < this.alertThresholds.temperature.min) {
        alerts.push({
          type: 'low_temperature',
          message: `Temperature below minimum threshold: ${sensorData.temperature}°C`,
          value: sensorData.temperature,
          threshold: this.alertThresholds.temperature.min
        });
      } else if (sensorData.temperature > this.alertThresholds.temperature.max) {
        alerts.push({
          type: 'high_temperature',
          message: `Temperature above maximum threshold: ${sensorData.temperature}°C`,
          value: sensorData.temperature,
          threshold: this.alertThresholds.temperature.max
        });
      }
    }
    
    if (sensorData.humidity !== undefined) {
      if (sensorData.humidity < this.alertThresholds.humidity.min) {
        alerts.push({
          type: 'low_humidity',
          message: `Humidity below minimum threshold: ${sensorData.humidity}%`,
          value: sensorData.humidity,
          threshold: this.alertThresholds.humidity.min
        });
      } else if (sensorData.humidity > this.alertThresholds.humidity.max) {
        alerts.push({
          type: 'high_humidity',
          message: `Humidity above maximum threshold: ${sensorData.humidity}%`,
          value: sensorData.humidity,
          threshold: this.alertThresholds.humidity.max
        });
      }
    }
    
    if (sensorData.soilMoisture !== undefined) {
      if (sensorData.soilMoisture < this.alertThresholds.soilMoisture.min) {
        alerts.push({
          type: 'low_soil_moisture',
          message: `Soil moisture below minimum threshold: ${sensorData.soilMoisture}%`,
          value: sensorData.soilMoisture,
          threshold: this.alertThresholds.soilMoisture.min
        });
      } else if (sensorData.soilMoisture > this.alertThresholds.soilMoisture.max) {
        alerts.push({
          type: 'high_soil_moisture',
          message: `Soil moisture above maximum threshold: ${sensorData.soilMoisture}%`,
          value: sensorData.soilMoisture,
          threshold: this.alertThresholds.soilMoisture.max
        });
      }
    }
    
    // Send alerts if any
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        this.realtimeService.sendFarmNotification(farmId, {
          ...alert,
          timestamp: new Date()
        });
      });
    }
  }

  /**
   * Check for immediate weather alerts
   * @private
   */
  checkForWeatherAlerts(farmId, weatherData) {
    const alerts = [];
    
    // Check for extreme weather conditions
    if (weatherData.temperature !== undefined) {
      if (weatherData.temperature < 0) {
        alerts.push({
          type: 'freezing_temperature',
          message: `Freezing temperature detected: ${weatherData.temperature}°C`,
          value: weatherData.temperature
        });
      } else if (weatherData.temperature > 35) {
        alerts.push({
          type: 'extreme_heat',
          message: `Extreme heat detected: ${weatherData.temperature}°C`,
          value: weatherData.temperature
        });
      }
    }
    
    if (weatherData.rainfall !== undefined && weatherData.rainfall > 30) {
      alerts.push({
        type: 'heavy_rainfall',
        message: `Heavy rainfall detected: ${weatherData.rainfall}mm`,
        value: weatherData.rainfall
      });
    }
    
    if (weatherData.windSpeed !== undefined && weatherData.windSpeed > 50) {
      alerts.push({
        type: 'high_wind',
        message: `High wind speed detected: ${weatherData.windSpeed}km/h`,
        value: weatherData.windSpeed
      });
    }
    
    // Send weather alerts if any
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        this.realtimeService.sendWeatherAlert(farmId, {
          ...alert,
          timestamp: new Date()
        });
      });
    }
  }

  /**
   * Update alert thresholds for a farm
   * @param {String} farmId - Farm identifier
   * @param {Object} thresholds - New threshold values
   */
  updateAlertThresholds(farmId, thresholds) {
    if (!this.dataStreams.has(farmId)) {
      this.initializeFarmProcessing(farmId);
    }
    
    // Create farm-specific thresholds if not already set
    if (!this.dataStreams.get(farmId).alertThresholds) {
      this.dataStreams.get(farmId).alertThresholds = { ...this.alertThresholds };
    }
    
    // Update thresholds
    Object.assign(this.dataStreams.get(farmId).alertThresholds, thresholds);
    
    return {
      farmId,
      status: 'updated',
      thresholds: this.dataStreams.get(farmId).alertThresholds
    };
  }

  /**
   * Process treatment updates
   * @param {String} farmId - Farm identifier
   * @param {Object} treatmentData - Treatment data
   */
  processTreatmentUpdate(farmId, treatmentData) {
    // Validate treatment data
    if (!treatmentData.treatmentId || !treatmentData.status) {
      return {
        status: 'error',
        message: 'Invalid treatment data. Required: treatmentId and status'
      };
    }
    
    // Add timestamp if not present
    const processedData = {
      ...treatmentData,
      timestamp: treatmentData.timestamp || new Date()
    };
    
    // Send treatment update via realtime service
    this.realtimeService.sendTreatmentUpdate(farmId, processedData);
    
    return {
      status: 'processed',
      treatmentId: processedData.treatmentId
    };
  }
}

module.exports = DataProcessingService;