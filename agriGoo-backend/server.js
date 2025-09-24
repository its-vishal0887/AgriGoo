const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

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
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Connect to database
connectDB();

// Initialize data processing service
const DataProcessingService = require('./src/services/dataProcessingService');
const dataProcessingService = new DataProcessingService(io);

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/detection', require('./src/routes/detection'));
app.use('/api/outbreaks', require('./src/routes/outbreaks'));
app.use('/api/weather', require('./src/routes/weather'));
app.use('/api/soil', require('./src/routes/soil'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/ml', require('./src/routes/mlRoutes'));

// Set up data routes with the processing service
const { router: dataRoutes, setDataProcessingService } = require('./src/routes/dataRoutes');
setDataProcessingService(dataProcessingService);
app.use('/api/data', dataRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('AgriGoo API is running');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join dashboard room for real-time updates
  socket.on('join_dashboard', (userId) => {
    socket.join(`dashboard_${userId}`);
    console.log(`User ${userId} joined dashboard room`);
  });
  
  // Join user to their farm room
  socket.on('join-farm', (farmId) => {
    socket.join(farmId);
    console.log(`User joined farm room: ${farmId}`);
  });

  // Handle new outbreak reports
  socket.on('new-outbreak', (data) => {
    io.to(data.region).emit('outbreak-alert', data);
    console.log(`New outbreak reported in region: ${data.region}`);
  });
  
  // Handle scan completion
  socket.on('scan-complete', (data) => {
    io.to(data.farmId).emit('scan-update', data);
    console.log(`Scan completed for farm: ${data.farmId}`);
  });
  
  // Handle weather alerts
  socket.on('weather-alert', (data) => {
    io.to(data.region).emit('weather-notification', data);
    console.log(`Weather alert for region: ${data.region}`);
  });
  
  // Handle treatment progress
  socket.on('treatment-update', (data) => {
    io.to(data.farmId).emit('treatment-progress', data);
    console.log(`Treatment update for farm: ${data.farmId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };