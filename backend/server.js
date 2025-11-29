// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

// Create Express app
const app = express();

// Connect to Database
connectDatabase();

// Middleware - These run before your routes

app.use(cors({
  origin: ['https://rentnest-three.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));                              // Allow frontend to connect
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse JSON data from requests

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Rentnest API!',
    status: 'Server is running',
    database: 'Connected',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// 404 handler - route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`💻 Computer: http://localhost:${PORT}`);
  console.log(`📱 Mobile: http://192.168.1.108:${PORT}`);
  console.log(`📝 Auth API: http://192.168.1.108:${PORT}/api/auth`);
  console.log(`🏘️  Properties API: http://192.168.1.108:${PORT}/api/properties`);
});