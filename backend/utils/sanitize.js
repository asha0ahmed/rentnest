// Sanitize user input to prevent injection
const sanitizeString = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove special regex characters
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Sanitize object (recursive)
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
};

module.exports = { sanitizeString, sanitizeObject };