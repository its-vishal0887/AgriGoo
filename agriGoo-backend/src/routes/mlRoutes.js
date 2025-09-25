const express = require('express');
const router = express.Router();
const multer = require('multer');
const mlController = require('../controllers/mlController');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// ML service routes
router.post('/detect', upload.single('image'), mlController.detectDisease);
router.get('/outbreaks', mlController.getOutbreaks);
router.get('/health', mlController.healthCheck);

module.exports = router;