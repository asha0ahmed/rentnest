const jwt = require('jsonwebtoken');

// Generate JWT token for user authentication
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload - user ID
    process.env.JWT_SECRET, // Secret key from .env
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

module.exports = generateToken;