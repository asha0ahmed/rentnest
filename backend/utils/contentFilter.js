const Filter = require('leo-profanity');

// Add custom words to filter
Filter.add([
  // English bad words (already included in leo-profanity)
  
  // Bangla bad words - Add yours here
  'মূর্খ', 'বোকা', 'চোর', 'ভন্ড',
  
  // Add more Bangla bad words as needed
]);

// Scam/Fraud keywords
const scamKeywords = [
  'guaranteed', 'risk free', '100% profit', 'get rich quick',
  'limited time', 'act now', 'click here', 'make money fast',
  'no questions asked', 'cash only', 'wire transfer only',
  'western union', 'moneygram', 'bitcoin only',
  'urgent', 'emergency sale', 'must sell today',
  'free money', 'free cash', 'lottery', 'prize',
  'congratulations you won', 'claim your prize'
];

// Fake property indicators
const fakePropertyKeywords = [
  'too good to be true', 'unbelievable price', 'amazing deal',
  'once in a lifetime', 'below market value', 'heavily discounted',
  'sacrifice sale', 'distress sale', 'foreclosure'
];

// Check for inappropriate content
const checkInappropriateContent = (text) => {
  if (!text || typeof text !== 'string') return { isClean: true };
  
  const lowerText = text.toLowerCase();
  
  // Check for profanity using leo-profanity
  if (Filter.check(text)) {
    return {
      isClean: false,
      reason: 'Contains inappropriate language or bad words'
    };
  }
  
  // Check for scam keywords
  for (const keyword of scamKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return {
        isClean: false,
        reason: `Contains suspicious scam keyword: "${keyword}"`
      };
    }
  }
  
  // Check for fake property indicators
  for (const keyword of fakePropertyKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return {
        isClean: false,
        reason: `Contains fake property indicator: "${keyword}"`
      };
    }
  }
  
  // Check for excessive punctuation (spam indicator)
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  
  if (exclamationCount > 5 || questionCount > 5) {
    return {
      isClean: false,
      reason: 'Excessive punctuation detected (possible spam)'
    };
  }
  
  // Check for all caps (screaming/spam)
  const wordsInCaps = text.match(/\b[A-Z]{4,}\b/g) || [];
  if (wordsInCaps.length > 3) {
    return {
      isClean: false,
      reason: 'Excessive capital letters detected (possible spam)'
    };
  }
  
  // Check for suspicious URLs
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/g;
  const urls = text.match(urlPattern) || [];
  if (urls.length > 2) {
    return {
      isClean: false,
      reason: 'Contains too many URLs (possible spam)'
    };
  }
  
  return { isClean: true };
};

// Check phone number validity
const checkPhoneNumber = (phone) => {
  if (!phone) return { isValid: true };
  
  // Bangladesh phone format: 01XXXXXXXXX (11 digits)
  const bdPhonePattern = /^01[0-9]{9}$/;
  
  if (!bdPhonePattern.test(phone)) {
    return {
      isValid: false,
      reason: 'Invalid Bangladesh phone number format'
    };
  }
  
  // Check for repeated digits (like 01111111111)
  const uniqueDigits = new Set(phone.split(''));
  if (uniqueDigits.size < 4) {
    return {
      isValid: false,
      reason: 'Suspicious phone number pattern (too many repeated digits)'
    };
  }
  
  return { isValid: true };
};

// Check price - minimum 800 BDT only
const checkPriceValidity = (rent, propertyType) => {
  const minRent = 800;  // Minimum 800 BDT
  
  if (rent < minRent) {
    return {
      isValid: false,
      reason: `Rent must be at least ${minRent} BDT`
    };
  }
  
  return { isValid: true };
};
module.exports = {
  checkInappropriateContent,
  checkPhoneNumber,
  checkPriceValidity
};