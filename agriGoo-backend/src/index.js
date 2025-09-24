const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const dashboardRoutes = require('./routes/dashboardRoutes');
const RealtimeService = require('./services/realtimeService');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('AgriGoo API is running');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join dashboard room for real-time updates
  socket.on('join_dashboard', (userId) => {
    socket.join(`dashboard_${userId}`);
    console.log(`User ${userId} joined dashboard room`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Initialize realtime service
const realtimeService = new RealtimeService(io);

// Set up real-time notification emitter (simulated)
const sendRealTimeNotifications = () => {
  // This would typically be triggered by events in your application
  // For demonstration, we'll set up a timer to simulate notifications
  setInterval(() => {
    const notification = {
      id: Date.now().toString(),
      type: 'alert',
      priority: Math.random() > 0.5 ? 'high' : 'medium',
      message: `New alert: ${Math.random() > 0.5 ? 'Disease risk detected' : 'Weather warning'}`,
      read: false,
      actionRequired: Math.random() > 0.7,
      timestamp: new Date()
    };
    
    // Using the realtime service to broadcast notifications
    realtimeService.broadcastNotification(notification);
    console.log('Emitted notification:', notification.message);
  }, 60000); // Every minute
};

// Connect to MongoDB (commented out as we're using mock data for now)
/*
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful database connection
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      sendRealTimeNotifications();
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
*/

// For demonstration without MongoDB
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  sendRealTimeNotifications();
});

module.exports = { app, server, io };