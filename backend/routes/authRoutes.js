const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { body, validationResult } = require('express-validator');

// @route   POST /api/auth/signup
// @desc    Register a new user (Tenant or Owner)
// @access  Public
router.post('/signup', [
  // Validation rules
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('accountType')
    .isIn(['tenant', 'owner'])
    .withMessage('Account type must be tenant or owner'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  body('mobile')
    .optional()
    .matches(/^01[0-9]{9}$/)
    .withMessage('Invalid Bangladesh mobile number')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  try {
    const { fullName, email, mobile, password, accountType } = req.body;

    // Validation: Check required fields
    if (!fullName || !password || !accountType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, password, and account type'
      });
    }

    // Validation: Must provide email OR mobile
    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either email or mobile number'
      });
    }

    // Check if user already exists
    let existingUser;
    if (email) {
      existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
    }
    if (mobile) {
      existingUser = await User.findOne({ mobile });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this mobile number already exists'
        });
      }
    }

    // Create new user
    const user = await User.create({
      fullName,
      email: email || undefined,
      mobile: mobile || undefined,
      password,
      accountType
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          accountType: user.accountType,
          subscription: user.subscription
        },
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during signup'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (with email/mobile + password)
// @access  Public
router.post('/login', [
  // Validation rules
  body('emailOrMobile')
    .trim()
    .notEmpty()
    .withMessage('Email or mobile number is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  try {
    const { emailOrMobile, password } = req.body;

    // Validation
    if (!emailOrMobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/mobile and password'
      });
    }

    // Find user by email or mobile
    let user;
    
    // Check if input is email (contains @) or mobile
    if (emailOrMobile.includes('@')) {
      user = await User.findOne({ email: emailOrMobile }).select('+password');
    } else {
      user = await User.findOne({ mobile: emailOrMobile }).select('+password');
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          accountType: user.accountType,
          subscription: user.subscription
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user info
// @access  Private (requires authentication)
const { protect } = require('../middleware/auth');

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          accountType: user.accountType,
          subscription: user.subscription,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;