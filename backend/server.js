// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import database connection
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

// Create Express app
const app = express();

// Connect to Database
connectDatabase();

// Security headers
app.use(helmet());

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

// Rate limiting - General (100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting - Auth (10 login attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiter to all routes
app.use(generalLimiter);

// API Routes
// API Routes (with rate limiting for auth)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// 404 handler - route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (ADD THIS)
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Log for debugging
  
  // Don't expose error details in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(err.status || 500).json({
      success: false,
      message: 'Internal server error'
    });
  }
  
  // Show details in development
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error'
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