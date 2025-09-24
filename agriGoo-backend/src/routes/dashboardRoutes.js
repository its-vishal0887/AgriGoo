const express = require('express');
const router = express.Router();
const { 
  getDashboardOverview, 
  getDashboardAnalytics, 
  getDashboardNotifications 
} = require('../controllers/dashboardController');

// Dashboard routes
router.get('/overview', getDashboardOverview);
router.get('/analytics', getDashboardAnalytics);
router.get('/notifications', getDashboardNotifications);

module.exports = router;