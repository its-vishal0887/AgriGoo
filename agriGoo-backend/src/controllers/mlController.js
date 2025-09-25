const axios = require('axios');
const FormData = require('form-data');

// Configure ML service URL from environment or use default
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

/**
 * Detect crop disease from image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.detectDisease = async (req, res) => {
  try {
    // Check if image is provided
    if (!req.file && !req.body.image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    let mlResponse;
    
    // If image is uploaded as file
    if (req.file) {
      const formData = new FormData();
      formData.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });
      
      if (req.body.crop_type) {
        formData.append('crop_type', req.body.crop_type);
      }
      
      mlResponse = await axios.post(`${ML_SERVICE_URL}/api/detect`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
    } 
    // If image is provided as base64
    else if (req.body.image) {
      mlResponse = await axios.post(`${ML_SERVICE_URL}/api/detect`, {
        image: req.body.image,
        crop_type: req.body.crop_type
      });
    }

    return res.status(200).json(mlResponse.data);
  } catch (error) {
    console.error('Error detecting disease:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing image',
      error: error.response?.data || error.message
    });
  }
};

/**
 * Get disease outbreaks data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getOutbreaks = async (req, res) => {
  try {
    const { region, crop, days } = req.query;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (crop) params.append('crop', crop);
    if (days) params.append('days', days);
    
    const queryString = params.toString();
    const url = `${ML_SERVICE_URL}/api/outbreaks${queryString ? `?${queryString}` : ''}`;
    
    const response = await axios.get(url);
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching outbreaks:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching outbreak data',
      error: error.response?.data || error.message
    });
  }
};

/**
 * Health check for ML service
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.healthCheck = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);
    return res.status(200).json({ 
      success: true, 
      mlService: response.data.status 
    });
  } catch (error) {
    console.error('ML service health check failed:', error);
    return res.status(503).json({ 
      success: false, 
      mlService: 'unavailable',
      error: error.message
    });
  }
};