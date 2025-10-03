
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    temperature: 22 + Math.random() * 5,
    humidity: 65 + Math.random() * 10,
    soilMoisture: 40 + Math.random() * 15,
    lightLevel: 75 + Math.random() * 20,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
