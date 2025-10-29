const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify if user is logged in
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continue to next middleware/route
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Check if user is an owner
const isOwner = (req, res, next) => {
  if (req.user && req.user.accountType === 'owner') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Only owners can perform this action.'
    });
  }
};

// Check if user is a tenant
const isTenant = (req, res, next) => {
  if (req.user && req.user.accountType === 'tenant') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Only tenants can perform this action.'
    });
  }
};

module.exports = { protect, isOwner, isTenant };