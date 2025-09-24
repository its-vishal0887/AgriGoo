/**
 * Data Processing API Routes for AgriGoo
 * Handles endpoints for sensor data, weather data, and real-time processing
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// This router will be initialized with the dataProcessingService in server.js
let dataProcessingService;

// Set the data processing service
const setDataProcessingService = (service) => {
  dataProcessingService = service;
};

/**
 * @route   POST /api/data/sensor
 * @desc    Process incoming sensor data
 * @access  Private
 */
router.post('/sensor', auth, async (req, res) => {
  try {
    const { farmId, data } = req.body;
    
    if (!farmId || !data) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: farmId or data'
      });
    }

    // Process with data service
    const result = dataProcessingService.processSensorData(farmId, data);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing sensor data',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/data/weather
 * @desc    Process incoming weather data
 * @access  Private
 */
router.post('/weather', auth, async (req, res) => {
  try {
    const { farmId, data } = req.body;
    
    if (!farmId || !data) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: farmId or data'
      });
    }

    // Process with data service
    const result = dataProcessingService.processWeatherData(farmId, data);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing weather data:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing weather data',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/data/image-scan
 * @desc    Process image data for disease detection
 * @access  Private
 */
router.post('/image-scan', auth, async (req, res) => {
  try {
    const { farmId, image, location, metadata } = req.body;
    
    if (!farmId || !image) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: farmId or image'
      });
    }

    // Process with data service
    const result = await dataProcessingService.processImageData(farmId, {
      image,
      location,
      metadata
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing image scan:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image scan',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/data/treatment-update
 * @desc    Process treatment updates
 * @access  Private
 */
router.post('/treatment-update', auth, async (req, res) => {
  try {
    const { farmId, treatmentData } = req.body;
    
    if (!farmId || !treatmentData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: farmId or treatmentData'
      });
    }

    // Process with data service
    const result = dataProcessingService.processTreatmentUpdate(farmId, treatmentData);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing treatment update:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing treatment update',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/data/initialize-farm
 * @desc    Initialize data processing for a farm
 * @access  Private
 */
router.post('/initialize-farm', auth, async (req, res) => {
  try {
    const { farmId, config } = req.body;
    
    if (!farmId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: farmId'
      });
    }

    // Initialize farm processing
    const result = dataProcessingService.initializeFarmProcessing(farmId, config || {});

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error initializing farm processing:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing farm processing',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/data/stop-farm
 * @desc    Stop data processing for a farm
 * @access  Private
 */
router.post('/stop-farm', auth, async (req, res) => {
  try {
    const { farmId } = req.body;
    
    if (!farmId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: farmId'
      });
    }

    // Stop farm processing
    const result = dataProcessingService.stopFarmProcessing(farmId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error stopping farm processing:', error);
    res.status(500).json({
      success: false,
      message: 'Error stopping farm processing',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/data/update-thresholds
 * @desc    Update alert thresholds for a farm
 * @access  Private
 */
router.post('/update-thresholds', auth, async (req, res) => {
  try {
    const { farmId, thresholds } = req.body;
    
    if (!farmId || !thresholds) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: farmId or thresholds'
      });
    }

    // Update thresholds
    const result = dataProcessingService.updateAlertThresholds(farmId, thresholds);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error updating alert thresholds:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating alert thresholds',
      error: error.message
    });
  }
});

module.exports = { router, setDataProcessingService };