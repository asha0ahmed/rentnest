const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect, isOwner } = require('../middleware/auth');

// @route   POST /api/properties
// @desc    Create a new property listing (Owner only)
// @access  Private (Owner)
router.post('/', protect, isOwner, async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      location,
      rent,
      features,
      amenities,
      photos,
      contact,
      terms
    } = req.body;

    // Validation
    if (!title || !description || !propertyType || !location || !rent || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create property with owner reference
    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      propertyType,
      location,
      rent,
      features,
      amenities,
      photos,
      contact,
      terms
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
      filter['location.division'] = new RegExp(division, 'i'); // case-insensitive
    }

    if (district) {
      filter['location.district'] = new RegExp(district, 'i');
    }

    if (area) {
      filter['location.area'] = new RegExp(area, 'i');
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
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
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
    
    // Handle invalid ID format
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

    // Check if the property belongs to the logged-in owner
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property'
      });
    }

    // Update property
    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
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

    // Check if the property belongs to the logged-in owner
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

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this property'
      });
    }

    // Toggle availability
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