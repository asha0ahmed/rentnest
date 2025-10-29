const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  
  // Login credentials (can be email OR mobile)
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true, // Allows multiple null values
    validate: {
      validator: function(v) {
        // Only validate if email is provided
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  
  mobile: {
    type: String,
    trim: true,
    sparse: true, // Allows multiple null values
    validate: {
      validator: function(v) {
        // Only validate if mobile is provided
        if (!v) return true;
        // Bangladesh mobile number format (11 digits starting with 01)
        return /^01[0-9]{9}$/.test(v);
      },
      message: 'Please provide a valid Bangladesh mobile number (01XXXXXXXXX)'
    }
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  
  // Account type
  accountType: {
    type: String,
    enum: ['tenant', 'owner'],
    required: [true, 'Please select account type (tenant or owner)']
  },
  
  // Subscription (for tenants)
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  
  // Additional info
  isActive: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validation: User must have either email OR mobile
userSchema.pre('save', function(next) {
  if (!this.email && !this.mobile) {
    next(new Error('Please provide either email or mobile number'));
  } else {
    next();
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash password with bcrypt
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);