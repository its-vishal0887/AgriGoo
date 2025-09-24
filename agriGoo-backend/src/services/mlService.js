/**
 * Machine Learning Service for AgriGoo
 * Handles crop disease detection, prediction, and analysis
 */
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

class MLService {
  constructor() {
    this.modelLoaded = false;
    this.model = null;
    this.diseaseClasses = [
      'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
      'Corn_(maize)___Cercospora_leaf_spot', 'Corn_(maize)___Common_rust', 'Corn_(maize)___Northern_Leaf_Blight',
      'Corn_(maize)___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
      'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
      'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
      'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
    ];
  }

  /**
   * Initialize and load the ML model
   */
  async loadModel() {
    try {
      // Check if model is already loaded
      if (this.modelLoaded) {
        return true;
      }

      // Try to load local model if available
      const modelPath = path.join(__dirname, '../../models/plant_disease_model');
      if (fs.existsSync(modelPath)) {
        this.model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
        console.log('Model loaded from local storage');
      } else {
        // If local model not available, use external API
        console.log('Local model not found, will use external API for predictions');
      }
      
      this.modelLoaded = true;
      return true;
    } catch (error) {
      console.error('Error loading ML model:', error);
      return false;
    }
  }

  /**
   * Preprocess image for model input
   * @param {Buffer} imageBuffer - Raw image data
   * @returns {tf.Tensor} Processed tensor ready for prediction
   */
  preprocessImage(imageBuffer) {
    // Convert buffer to tensor
    const tensor = tf.node.decodeImage(imageBuffer, 3);
    
    // Resize to expected size (224x224)
    const resized = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize pixel values to 0-1
    const normalized = resized.div(tf.scalar(255));
    
    // Add batch dimension
    const batched = normalized.expandDims(0);
    
    // Cleanup
    tensor.dispose();
    resized.dispose();
    
    return batched;
  }

  /**
   * Detect disease from plant image
   * @param {Buffer|string} image - Image buffer or base64 string
   * @returns {Object} Detection results with disease and confidence
   */
  async detectDisease(image) {
    try {
      // Convert base64 to buffer if needed
      let imageBuffer = image;
      if (typeof image === 'string' && image.includes('base64')) {
        imageBuffer = Buffer.from(image.split(',')[1], 'base64');
      }

      // If model is loaded locally, use it
      if (this.model) {
        await this.loadModel();
        
        // Preprocess image
        const tensor = this.preprocessImage(imageBuffer);
        
        // Run prediction
        const predictions = await this.model.predict(tensor);
        const results = await predictions.data();
        
        // Get top prediction
        let maxIndex = 0;
        let maxConfidence = 0;
        
        for (let i = 0; i < results.length; i++) {
          if (results[i] > maxConfidence) {
            maxConfidence = results[i];
            maxIndex = i;
          }
        }
        
        // Cleanup
        tensor.dispose();
        predictions.dispose();
        
        return {
          disease: this.diseaseClasses[maxIndex],
          confidence: maxConfidence,
          isHealthy: this.diseaseClasses[maxIndex].includes('healthy'),
          timestamp: new Date()
        };
      } else {
        // Use external AI service
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'https://api.agrigoo-ai.com/predict';
        
        // Convert buffer to base64 for API
        const base64Image = imageBuffer.toString('base64');
        
        // Call external API
        const response = await axios.post(aiServiceUrl, {
          image: base64Image
        });
        
        return {
          ...response.data,
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Error detecting disease:', error);
      
      // Return mock data for demo/development
      return this.getMockDetection();
    }
  }

  /**
   * Generate mock detection for testing/development
   * @returns {Object} Mock detection result
   */
  getMockDetection() {
    const diseases = [
      { name: 'Tomato___Late_blight', confidence: 0.92, isHealthy: false },
      { name: 'Potato___Early_blight', confidence: 0.88, isHealthy: false },
      { name: 'Apple___Cedar_apple_rust', confidence: 0.79, isHealthy: false },
      { name: 'Tomato___healthy', confidence: 0.95, isHealthy: true },
      { name: 'Corn_(maize)___Common_rust', confidence: 0.85, isHealthy: false }
    ];
    
    const selected = diseases[Math.floor(Math.random() * diseases.length)];
    
    return {
      disease: selected.name,
      confidence: selected.confidence,
      isHealthy: selected.isHealthy,
      timestamp: new Date(),
      isMock: true
    };
  }

  /**
   * Predict disease spread in a region
   * @param {Object} params - Parameters for prediction
   * @returns {Object} Prediction results
   */
  async predictDiseaseSpread(params) {
    try {
      const { disease, location, weatherData } = params;
      
      // In a real implementation, this would use a trained model
      // For now, we'll return mock predictions
      
      const spreadFactor = this.calculateSpreadFactor(disease, weatherData);
      const riskLevel = this.calculateRiskLevel(spreadFactor);
      const affectedArea = this.estimateAffectedArea(spreadFactor, location);
      
      return {
        disease,
        spreadFactor,
        riskLevel,
        affectedArea,
        recommendations: this.getRecommendations(disease, riskLevel),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error predicting disease spread:', error);
      return null;
    }
  }

  /**
   * Calculate disease spread factor based on weather
   * @private
   */
  calculateSpreadFactor(disease, weatherData) {
    // Mock implementation - in reality would use a trained model
    const { humidity, temperature, rainfall } = weatherData;
    
    // Different diseases thrive in different conditions
    let factor = 0;
    
    if (disease.includes('blight')) {
      // Blights thrive in humid, warm conditions
      factor = (humidity * 0.6) + (temperature * 0.3) + (rainfall * 0.1);
    } else if (disease.includes('rust')) {
      // Rusts need moisture and moderate temps
      factor = (humidity * 0.4) + (rainfall * 0.4) + (temperature * 0.2);
    } else {
      // Generic calculation
      factor = (humidity * 0.4) + (temperature * 0.4) + (rainfall * 0.2);
    }
    
    // Normalize to 0-100
    return Math.min(100, Math.max(0, factor));
  }

  /**
   * Calculate risk level from spread factor
   * @private
   */
  calculateRiskLevel(spreadFactor) {
    if (spreadFactor < 30) return 'Low';
    if (spreadFactor < 60) return 'Medium';
    if (spreadFactor < 80) return 'High';
    return 'Severe';
  }

  /**
   * Estimate affected area based on spread factor
   * @private
   */
  estimateAffectedArea(spreadFactor, location) {
    // Mock implementation
    const baseRadius = 2; // km
    const maxRadius = 20; // km
    
    const radius = baseRadius + ((maxRadius - baseRadius) * (spreadFactor / 100));
    
    return {
      center: location,
      radiusKm: radius,
      affectedFarms: Math.floor(5 + (spreadFactor / 10))
    };
  }

  /**
   * Get recommendations based on disease and risk
   * @private
   */
  getRecommendations(disease, riskLevel) {
    const recommendations = {
      'Low': [
        'Monitor crops regularly',
        'Ensure proper spacing between plants',
        'Consider preventative fungicide application'
      ],
      'Medium': [
        'Apply appropriate fungicide/treatment',
        'Increase monitoring frequency',
        'Remove any infected plants',
        'Improve air circulation'
      ],
      'High': [
        'Immediate treatment application required',
        'Isolate affected areas',
        'Consider crop rotation for next season',
        'Implement strict sanitation protocols'
      ],
      'Severe': [
        'Urgent treatment required',
        'Consider removing severely affected crops',
        'Notify neighboring farms',
        'Implement containment measures',
        'Consult with agricultural extension services'
      ]
    };
    
    return recommendations[riskLevel] || recommendations['Medium'];
  }

  /**
   * Analyze soil health from sensor data
   * @param {Object} sensorData - Soil sensor readings
   * @returns {Object} Soil health analysis
   */
  analyzeSoilHealth(sensorData) {
    const { pH, nitrogen, phosphorus, potassium, moisture, temperature } = sensorData;
    
    // Calculate overall health score (0-100)
    let healthScore = 0;
    
    // pH factor (ideal range 6.0-7.0)
    const pHFactor = 100 - (Math.abs(pH - 6.5) * 20);
    
    // NPK factor
    const npkFactor = ((nitrogen / 100) + (phosphorus / 100) + (potassium / 100)) * 33.3;
    
    // Moisture factor (ideal 40-60%)
    const moistureFactor = 100 - (Math.abs(moisture - 50) * 2);
    
    // Temperature factor
    const tempFactor = temperature > 10 && temperature < 30 ? 100 : (100 - (Math.abs(temperature - 20) * 5));
    
    // Weighted average
    healthScore = (pHFactor * 0.3) + (npkFactor * 0.3) + (moistureFactor * 0.25) + (tempFactor * 0.15);
    healthScore = Math.min(100, Math.max(0, healthScore));
    
    // Determine deficiencies
    const deficiencies = [];
    if (nitrogen < 50) deficiencies.push('Nitrogen');
    if (phosphorus < 50) deficiencies.push('Phosphorus');
    if (potassium < 50) deficiencies.push('Potassium');
    if (pH < 5.5) deficiencies.push('pH (too acidic)');
    if (pH > 7.5) deficiencies.push('pH (too alkaline)');
    
    // Generate recommendations
    const recommendations = this.getSoilRecommendations(sensorData, deficiencies);
    
    return {
      healthScore: Math.round(healthScore),
      status: this.getSoilHealthStatus(healthScore),
      deficiencies,
      recommendations,
      timestamp: new Date()
    };
  }

  /**
   * Get soil health status based on score
   * @private
   */
  getSoilHealthStatus(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }

  /**
   * Generate soil health recommendations
   * @private
   */
  getSoilRecommendations(sensorData, deficiencies) {
    const recommendations = [];
    
    // Basic recommendations
    recommendations.push('Regular soil testing every 1-2 years');
    
    // Specific recommendations based on deficiencies
    if (deficiencies.includes('Nitrogen')) {
      recommendations.push('Apply nitrogen-rich fertilizer');
      recommendations.push('Consider planting nitrogen-fixing cover crops');
    }
    
    if (deficiencies.includes('Phosphorus')) {
      recommendations.push('Apply phosphate fertilizer');
      recommendations.push('Add bone meal or rock phosphate for organic options');
    }
    
    if (deficiencies.includes('Potassium')) {
      recommendations.push('Apply potassium-rich fertilizer');
      recommendations.push('Add wood ash or greensand for organic options');
    }
    
    if (deficiencies.includes('pH (too acidic)')) {
      recommendations.push('Apply agricultural lime to raise pH');
      recommendations.push('Consider adding wood ash');
    }
    
    if (deficiencies.includes('pH (too alkaline)')) {
      recommendations.push('Add sulfur or aluminum sulfate to lower pH');
      recommendations.push('Consider organic matter like pine needles or peat moss');
    }
    
    // Moisture recommendations
    if (sensorData.moisture < 30) {
      recommendations.push('Increase irrigation frequency');
      recommendations.push('Add organic matter to improve water retention');
    } else if (sensorData.moisture > 70) {
      recommendations.push('Improve drainage');
      recommendations.push('Reduce irrigation frequency');
    }
    
    return recommendations;
  }
}

module.exports = new MLService();