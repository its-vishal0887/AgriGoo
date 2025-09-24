/**
 * ML API Routes for AgriGoo
 * Handles endpoints for disease detection, predictions, and data analysis
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mlService = require('../services/mlService');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * @route   POST /api/ml/detect-disease
 * @desc    Detect disease from plant image
 * @access  Private
 */
router.post('/detect-disease', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    // Read the uploaded file
    const imageBuffer = fs.readFileSync(req.file.path);
    
    // Optional metadata from request body
    const metadata = {
      farmId: req.body.farmId,
      location: req.body.location ? JSON.parse(req.body.location) : null,
      plantType: req.body.plantType,
      notes: req.body.notes
    };

    // Process with ML service
    const result = await mlService.detectDisease(imageBuffer);
    
    // Add metadata to result
    const response = {
      ...result,
      metadata,
      imagePath: req.file.path
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in disease detection:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ml/detect-disease-base64
 * @desc    Detect disease from base64 encoded image
 * @access  Private
 */
router.post('/detect-disease-base64', auth, async (req, res) => {
  try {
    const { image, metadata } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image data provided' 
      });
    }

    // Process with ML service
    const result = await mlService.detectDisease(image);
    
    // Add metadata to result
    const response = {
      ...result,
      metadata
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error in disease detection:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ml/predict-spread
 * @desc    Predict disease spread based on detected disease and conditions
 * @access  Private
 */
router.post('/predict-spread', auth, async (req, res) => {
  try {
    const { disease, location, weatherData } = req.body;
    
    if (!disease || !location || !weatherData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: disease, location, or weatherData'
      });
    }

    // Process with ML service
    const prediction = await mlService.predictDiseaseSpread({
      disease,
      location,
      weatherData
    });

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error in disease spread prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Error predicting disease spread',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/ml/analyze-soil
 * @desc    Analyze soil health from sensor data
 * @access  Private
 */
router.post('/analyze-soil', auth, async (req, res) => {
  try {
    const { sensorData } = req.body;
    
    if (!sensorData || !sensorData.pH || !sensorData.nitrogen || 
        !sensorData.phosphorus || !sensorData.potassium) {
      return res.status(400).json({
        success: false,
        message: 'Missing required soil sensor data'
      });
    }

    // Process with ML service
    const analysis = mlService.analyzeSoilHealth(sensorData);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error in soil health analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing soil health',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/ml/model-status
 * @desc    Check ML model loading status
 * @access  Private
 */
router.get('/model-status', auth, async (req, res) => {
  try {
    const modelLoaded = await mlService.loadModel();
    
    res.json({
      success: true,
      data: {
        modelLoaded,
        modelType: modelLoaded ? 'local' : 'external API'
      }
    });
  } catch (error) {
    console.error('Error checking model status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking model status',
      error: error.message
    });
  }
});

module.exports = router;