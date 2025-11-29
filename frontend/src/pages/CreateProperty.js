import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './PropertyForm.css';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    division: 'Dhaka',
    district: '',
    area: '',
    address: '',
    rentAmount: '',
    rentPeriod: 'monthly',
    bedrooms: '',
    bathrooms: '',
    sizeValue: '',
    sizeUnit: 'sqft',
    furnished: 'unfurnished',
    amenities: '',
    images: [],
    imagePreviews: [],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    minimumStay: '',
    securityDeposit: '',
    utilitiesIncluded: false,
    petsAllowed: false,
    smokingAllowed: false,
    additionalRules: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreviews: [...prev.imagePreviews, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
      imagePreviews: formData.imagePreviews.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      alert('Please select at least one image');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const uploadFormData = new FormData();
      
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('propertyType', formData.propertyType);
      
      uploadFormData.append('location', JSON.stringify({
        division: formData.division,
        district: formData.district,
        area: formData.area,
        address: formData.address
      }));
      
      uploadFormData.append('rent', JSON.stringify({
        amount: Number(formData.rentAmount),
        period: formData.rentPeriod
      }));
      
      uploadFormData.append('features', JSON.stringify({
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        size: formData.sizeValue ? {
          value: Number(formData.sizeValue),
          unit: formData.sizeUnit
        } : undefined,
        furnished: formData.furnished
      }));
      
      uploadFormData.append('amenities', JSON.stringify(
        formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : []
      ));
      
      uploadFormData.append('contact', JSON.stringify({
        name: formData.contactName,
        phone: formData.contactPhone,
        email: formData.contactEmail || undefined
      }));
      
      uploadFormData.append('terms', JSON.stringify({
        minimumStay: formData.minimumStay || undefined,
        securityDeposit: formData.securityDeposit ? Number(formData.securityDeposit) : undefined,
        utilitiesIncluded: formData.utilitiesIncluded,
        petsAllowed: formData.petsAllowed,
        smokingAllowed: formData.smokingAllowed,
        additionalRules: formData.additionalRules || undefined
      }));
      
      formData.images.forEach(image => {
        uploadFormData.append('images', image);
      });
      
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/properties`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      alert('Property created successfully!');
      navigate('/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-form-page">
      <div className="container">
        <div className="form-header">
          <h1>Add New Property</h1>
          <p>Fill in the details to list your property</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="property-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label className="form-label">Property Title(বাসার শিরোনাম)*</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="যেমন: খুলনার মধ্যে সুন্দর ফ্যামিলি বাসা/হোস্টেল/সাবলেট/ফ্লাট  Beautiful Apartment in Khulna"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description(বর্ণনা) *</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="আপনার বাসার বিস্তারিত বর্ণনা দিন..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Property Type(বাসার ধরন) *</label>
                <select
                  name="propertyType"
                  className="form-select"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="apartment">Apartment(ফ্লাট)</option>
                  <option value="hostel">Hostel(হোস্টেল/মেস)</option>
                  <option value="sublet">Sublet(সাবলেট)</option>
                  <option value="room">Room(রুম)</option>
                  <option value="house">House(বাড়ি)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h2>Location</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Division(বিভাগ) *</label>
                <select
                  name="division"
                  className="form-select"
                  value={formData.division}
                  onChange={handleChange}
                  required
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chattogram">Chattogram</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District(জেলা) *</label>
                <input
                  type="text"
                  name="district"
                  className="form-input"
                  placeholder="Example:Dhaka"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Area/Locality(এরিয়া) *</label>
                <input
                  type="text"
                  name="area"
                  className="form-input"
                  placeholder="Example: Dhanmondi, Gulshan"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Address(বিস্তারিত ঠিকানা) *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="Example: Road 27, House 15, Dhanmondi, Dhaka 1209"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Rent Details */}
          <div className="form-section">
            <h2>Rent Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Rent Amount-বিস্তারিত ঠিকানা (BDT) *</label>
                <input
                  type="number"
                  name="rentAmount"
                  className="form-input"
                  placeholder="Example: 25000"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Period *</label>
                <select
                  name="rentPeriod"
                  className="form-select"
                  value={formData.rentPeriod}
                  onChange={handleChange}
                >
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="form-section">
            <h2>Property Features</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  className="form-input"
                  placeholder="e.g., 2"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  className="form-input"
                  placeholder="e.g., 2"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Size</label>
                <input
                  type="number"
                  name="sizeValue"
                  className="form-input"
                  placeholder="e.g., 1200"
                  value={formData.sizeValue}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <select
                  name="sizeUnit"
                  className="form-select"
                  value={formData.sizeUnit}
                  onChange={handleChange}
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Furnished Status</label>
              <select
                name="furnished"
                className="form-select"
                value={formData.furnished}
                onChange={handleChange}
              >
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <h2>Amenities</h2>
            
            <div className="form-group">
              <label className="form-label">Amenities-সুযোগ সুবিধা (comma-separated)</label>
              <input
                type="text"
                name="amenities"
                className="form-input"
                placeholder="Example: WiFi, Parking, Security, Generator, Lift......."
                value={formData.amenities}
                onChange={handleChange}
              />
              <small className="form-hint">Separate multiple amenities with commas</small>
            </div>
          </div>

          {/* Photos */}
          <div className="form-section">
            <h2>Photos</h2>
            
            <div className="form-group">
              <label className="form-label">Upload Property Photos (Max 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
                style={{ padding: '12px' }}
              />
              <small className="form-hint">
                Select up to 5 images. Supported formats: JPG, PNG, GIF
              </small>
            </div>

            {/* Image Previews */}
            {formData.imagePreviews.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '12px',
                marginTop: '16px'
              }}>
                {formData.imagePreviews.map((preview, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    aspectRatio: '1'
                  }}>
                    <img src={preview} alt={`Preview ${index}`} style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h2>Contact Information</h2>
            
            <div className="form-group">
              <label className="form-label">Contact Name(আপনার নাম) *</label>
              <input
                type="text"
                name="contactName"
                className="form-input"
                placeholder="আপনার নাম"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number(মোবাইল নাম্বার) *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-input"
                  placeholder="01712345678"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email-ইমেইল (Optional)</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="form-input"
                  placeholder="your@email.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-section">
            <h2>Terms & Conditions</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Minimum Stay</label>
                <input
                  type="text"
                  name="minimumStay"
                  className="form-input"
                  placeholder="e.g., 6 months, 1 year"
                  value={formData.minimumStay}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Deposit (BDT)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  className="form-input"
                  placeholder="e.g., 50000"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="utilitiesIncluded"
                  checked={formData.utilitiesIncluded}
                  onChange={handleChange}
                />
                <span>Utilities Included</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="petsAllowed"
                  checked={formData.petsAllowed}
                  onChange={handleChange}
                />
                <span>Pets Allowed</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="smokingAllowed"
                  checked={formData.smokingAllowed}
                  onChange={handleChange}
                />
                <span>Smoking Allowed</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Rules</label>
              <textarea
                name="additionalRules"
                className="form-textarea"
                placeholder="Any additional rules or conditions for tenants..."
                value={formData.additionalRules}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard/owner')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Property...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProperty;