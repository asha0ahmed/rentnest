const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const Property = require('../models/Property');
const { protect, isOwner } = require('../middleware/auth');
const { checkInappropriateContent, checkPhoneNumber, checkPriceValidity } = require('../utils/contentFilter');
const { validateImage, checkImageDimensions } = require('../utils/imageChecker');
const { sanitizeString } = require('../utils/sanitize');

// Multer setup - store in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB per file
});

// @route   POST /api/properties
// @desc    Create a new property listing with images (Owner only)
// @access  Private (Owner)
router.post('/', protect, isOwner, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      location,
      rent,
      features,
      amenities,
      contact,
      terms
    } = req.body;

    // ========== CONTENT FILTERING -==========
    
    // Check title for inappropriate content
    const titleCheck = checkInappropriateContent(title);
    if (!titleCheck.isClean) {
      return res.status(400).json({
        success: false,
        message: `Title rejected: ${titleCheck.reason}`
      });
    }
    
    // Check description for inappropriate content
    const descCheck = checkInappropriateContent(description);
    if (!descCheck.isClean) {
      return res.status(400).json({
        success: false,
        message: `Description rejected: ${descCheck.reason}`
      });
    }
    
    // ========== END CONTENT FILTERING ==========

    // Parse JSON strings from FormData
    const parsedLocation = JSON.parse(location);
    const parsedRent = JSON.parse(rent);
    const parsedFeatures = JSON.parse(features);
    const parsedAmenities = JSON.parse(amenities);
    const parsedContact = JSON.parse(contact);
    const parsedTerms = JSON.parse(terms);

    // ========== ADDITIONAL VALIDATIONS  ==========
    
    // Check phone number
    const phoneCheck = checkPhoneNumber(parsedContact.phone);
    if (!phoneCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: `Phone number rejected: ${phoneCheck.reason}`
      });
    }
    
    // Check price validity
    const priceCheck = checkPriceValidity(parsedRent.amount, propertyType);
    if (!priceCheck.isValid) {
      return res.status(400).json({
        success: false,
        message: `Price rejected: ${priceCheck.reason}`
      });
    }
    
    // ========== END ADDITIONAL VALIDATIONS ==========

    // Validation
    if (!title || !description || !propertyType || !parsedLocation || !parsedRent || !parsedContact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    // Basic image validation
if (req.files && req.files.length > 0) {
  // Validate first
  for (const file of req.files) {
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size must be less than 5MB'
      });
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only JPG, PNG, and WebP images are allowed'
      });
    }
  }
}

// Upload images to Cloudinary
const uploadedPhotos = [];

if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'rentnest/properties',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      uploadedPhotos.push({
        url: result.secure_url,
        caption: ''
      });
      
    } catch (error) {
      console.error('Image upload error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to upload image. Please try again.'
      });
    }
  }
}

    // Create property
    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      propertyType,
      location: parsedLocation,
      rent: parsedRent,
      features: parsedFeatures,
      amenities: parsedAmenities,
      photos: uploadedPhotos,
      contact: parsedContact,
      terms: parsedTerms
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/properties
// @desc    Get all properties with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Extract query parameters for filtering
    const {
      propertyType,
      division,
      district,
      area,
      minRent,
      maxRent,
      bedrooms,
      furnished,
      search,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    let filter = { isAvailable: true };

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (division) {
      const safeDivision = sanitizeString(division);
      filter['location.division'] = new RegExp(`^${safeDivision}$`, 'i');
    }

    if (district) {
      const safeDistrict = sanitizeString(district);
      filter['location.district'] = new RegExp(`^${safeDistrict}$`, 'i');
    }

    if (area) {
      const safeArea = sanitizeString(area);
      filter['location.area'] = new RegExp(`^${safeArea}$`, 'i');
    }

    if (minRent || maxRent) {
      filter['rent.amount'] = {};
      if (minRent) filter['rent.amount'].$gte = Number(minRent);
      if (maxRent) filter['rent.amount'].$lte = Number(maxRent);
    }

    if (bedrooms) {
      filter['features.bedrooms'] = Number(bedrooms);
    }

    if (furnished) {
      filter['features.furnished'] = furnished;
    }

    // Search in title and description
    if (search) {
      const safeSearch = sanitizeString(search);
      filter.$or = [
      { title: new RegExp(safeSearch, 'i') },
      { description: new RegExp(safeSearch, 'i') }
     ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get properties with owner info
    const properties = await Property.find(filter)
      .populate('owner', 'fullName email mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: { properties }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/properties/my-properties
// @desc    Get all properties of logged-in owner
// @access  Private (Owner)
router.get('/my-properties', protect, isOwner, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: { properties }
    });

  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'fullName email mobile accountType');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Get property error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property (Owner only - own property)
// @access  Private (Owner)
router.put('/:id', protect, isOwner, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property'
      });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property (Owner only - own property)
// @access  Private (Owner)
router.delete('/:id', protect, isOwner, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/properties/:id/toggle-availability
// @desc    Toggle property availability (Owner only)
// @access  Private (Owner)
router.patch('/:id/toggle-availability', protect, isOwner, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property'
      });
    }

    property.isAvailable = !property.isAvailable;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property marked as ${property.isAvailable ? 'available' : 'unavailable'}`,
      data: { property }
    });

  } catch (error) {
    console.error('Toggle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;