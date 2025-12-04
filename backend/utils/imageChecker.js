const axios = require('axios');

// Simple image validation (checks file properties)
const validateImage = (file) => {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      isValid: false,
      reason: 'Image size exceeds 5MB'
    };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      reason: 'Invalid image format. Use JPG, PNG, or WebP'
    };
  }
  
  return { isValid: true };
};

// Check if image dimensions are reasonable
const checkImageDimensions = async (fileBuffer) => {
  // This is a basic check - you'd need sharp package for real dimension checking
  // For now, we'll just validate the buffer exists
  if (!fileBuffer || fileBuffer.length === 0) {
    return {
      isValid: false,
      reason: 'Empty or corrupted image file'
    };
  }
  
  return { isValid: true };
};

module.exports = {
  validateImage,
  checkImageDimensions
};