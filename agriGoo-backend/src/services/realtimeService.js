/**
 * Real-time notification service for dashboard and farm events
 */
class RealtimeService {
  constructor(io) {
    this.io = io;
  }

  /**
   * Send a notification to a specific user
   * @param {string} userId - User ID
   * @param {Object} notification - Notification object
   */
  sendUserNotification(userId, notification) {
    this.io.to(`dashboard_${userId}`).emit('dashboard_notification', notification);
  }

  /**
   * Send a notification to all users
   * @param {Object} notification - Notification object
   */
  broadcastNotification(notification) {
    this.io.emit('dashboard_notification', notification);
  }

  /**
   * Send a farm health update to a specific user
   * @param {string} userId - User ID
   * @param {Object} healthData - Health data object
   */
  sendFarmHealthUpdate(userId, healthData) {
    this.io.to(`dashboard_${userId}`).emit('farm_health_update', healthData);
  }

  /**
   * Send a weather alert to a specific user
   * @param {string} userId - User ID
   * @param {Object} weatherAlert - Weather alert object
   */
  sendWeatherAlert(userId, weatherAlert) {
    this.io.to(`dashboard_${userId}`).emit('weather_alert', weatherAlert);
  }

  /**
   * Send a disease detection alert to a specific user
   * @param {string} userId - User ID
   * @param {Object} diseaseAlert - Disease alert object
   */
  sendDiseaseAlert(userId, diseaseAlert) {
    this.io.to(`dashboard_${userId}`).emit('disease_alert', diseaseAlert);
  }
  
  /**
   * Send notification to a specific farm
   * @param {string} farmId - The farm ID
   * @param {object} data - Notification data
   */
  sendFarmNotification(farmId, data) {
    this.io.to(farmId).emit('farm-notification', {
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Send outbreak alert to a region
   * @param {string} region - The region ID
   * @param {object} data - Outbreak data
   */
  sendOutbreakAlert(region, data) {
    this.io.to(region).emit('outbreak-alert', {
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Send weather alert to a region
   * @param {string} region - The region ID
   * @param {object} data - Weather alert data
   */
  sendRegionWeatherAlert(region, data) {
    this.io.to(region).emit('weather-notification', {
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Send scan completion update
   * @param {string} farmId - The farm ID
   * @param {object} data - Scan data
   */
  sendScanUpdate(farmId, data) {
    this.io.to(farmId).emit('scan-update', {
      ...data,
      timestamp: new Date()
    });
  }

  /**
   * Send treatment progress update
   * @param {string} farmId - The farm ID
   * @param {object} data - Treatment data
   */
  sendTreatmentUpdate(farmId, data) {
    this.io.to(farmId).emit('treatment-progress', {
      ...data,
      timestamp: new Date()
    });
  }
}

module.exports = RealtimeService;