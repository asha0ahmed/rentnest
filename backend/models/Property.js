const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Owner reference
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Property details
  title: {
    type: String,
    required: [true, 'Please provide property title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Please provide property description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  propertyType: {
    type: String,
    required: [true, 'Please select property type'],
    enum: ['apartment', 'hostel', 'sublet', 'room', 'house']
  },
  
  // Location
  location: {
    division: {
      type: String,
      required: [true, 'Please provide division']
    },
    district: {
      type: String,
      required: [true, 'Please provide district']
    },
    area: {
      type: String,
      required: [true, 'Please provide area/locality']
    },
    address: {
      type: String,
      required: [true, 'Please provide full address']
    }
  },
  
  // Pricing
  rent: {
    amount: {
      type: Number,
      required: [true, 'Please provide rent amount']
    },
    currency: {
      type: String,
      default: 'BDT'
    },
    period: {
      type: String,
      enum: ['monthly', 'daily'],
      default: 'monthly'
    }
  },
  
  // Property features
  features: {
    bedrooms: {
      type: Number,
      min: 0
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    size: {
      value: Number,
      unit: {
        type: String,
        enum: ['sqft', 'sqm'],
        default: 'sqft'
      }
    },
    furnished: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished'],
      default: 'unfurnished'
    }
  },
  
  // Amenities
  amenities: [{
    type: String
  }],
  
  // Photos
  photos: [{
    url: String,
    caption: String
  }],
  
  // Contact info
  contact: {
    name: {
      type: String,
      required: [true, 'Please provide contact name']
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone']
    },
    email: String
  },
  
  // Terms and conditions
  terms: {
    minimumStay: String,
    securityDeposit: Number,
    utilitiesIncluded: Boolean,
    petsAllowed: Boolean,
    smokingAllowed: Boolean,
    additionalRules: String
  },
  
  // Status
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', propertySchema);