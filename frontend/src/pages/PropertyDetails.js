import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await propertyAPI.getPropertyById(id);
      setProperty(response.data.data.property);
    } catch (err) {
      setError('Failed to load property details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="error-container">
        <div className="container">
          <div className="alert alert-error">{error || 'Property not found'}</div>
          <Link to="/properties" className="btn btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.photos && property.photos.length > 0
    ? property.photos
    : [{ url: 'https://via.placeholder.com/800x600?text=No+Image', caption: 'No image available' }];

  return (
    <div className="property-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/properties">Properties</Link>
          <span>/</span>
          <span>{property.title}</span>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={images[currentImageIndex].url} alt={images[currentImageIndex].caption || property.title} />
            
            {images.length > 1 && (
              <>
                <button
                  className="nav-btn prev-btn"
                  onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                >
                  ‹
                </button>
                <button
                  className="nav-btn next-btn"
                  onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.caption || `Image ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="details-grid">
          {/* Main Content */}
          <div className="main-content">
            {/* Title & Price */}
            <div className="title-section">
              <div>
                <h1>{property.title}</h1>
                <p className="location">
                  📍 {property.location.address}, {property.location.area}, {property.location.district}
                </p>
              </div>
              <div className="price-tag">
                <span className="price">৳{property.rent.amount.toLocaleString()}</span>
                <span className="period">/{property.rent.period}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="quick-info">
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">{property.propertyType}</span>
              </div>
              {property.features.bedrooms && (
                <div className="info-item">
                  <span className="info-label">Bedrooms</span>
                  <span className="info-value">🛏️ {property.features.bedrooms}</span>
                </div>
              )}
              {property.features.bathrooms && (
                <div className="info-item">
                  <span className="info-label">Bathrooms</span>
                  <span className="info-value">🚿 {property.features.bathrooms}</span>
                </div>
              )}
              {property.features.size?.value && (
                <div className="info-item">
                  <span className="info-label">Size</span>
                  <span className="info-value">📏 {property.features.size.value} {property.features.size.unit}</span>
                </div>
              )}
              {property.features.furnished && (
                <div className="info-item">
                  <span className="info-label">Furnished</span>
                  <span className="info-value">{property.features.furnished}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="section">
              <h2>Description</h2>
              <p className="description">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="section">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      ✓ {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            {property.terms && (
              <div className="section">
                <h2>Terms & Conditions</h2>
                <div className="terms-grid">
                  {property.terms.minimumStay && (
                    <div className="term-item">
                      <strong>Minimum Stay:</strong> {property.terms.minimumStay}
                    </div>
                  )}
                  {property.terms.securityDeposit && (
                    <div className="term-item">
                      <strong>Security Deposit:</strong> ৳{property.terms.securityDeposit.toLocaleString()}
                    </div>
                  )}
                  <div className="term-item">
                    <strong>Utilities:</strong> {property.terms.utilitiesIncluded ? 'Included' : 'Not Included'}
                  </div>
                  <div className="term-item">
                    <strong>Pets:</strong> {property.terms.petsAllowed ? 'Allowed' : 'Not Allowed'}
                  </div>
                  <div className="term-item">
                    <strong>Smoking:</strong> {property.terms.smokingAllowed ? 'Allowed' : 'Not Allowed'}
                  </div>
                </div>
                {property.terms.additionalRules && (
                  <div className="additional-rules">
                    <strong>Additional Rules:</strong>
                    <p>{property.terms.additionalRules}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Contact Info */}
          <div className="sidebar">
            <div className="contact-card">
              <h3>Contact Owner</h3>
              
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Name:</span>
                  <span className="contact-value">{property.contact.name}</span>
                </div>
                
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href={`tel:${property.contact.phone}`} className="contact-value phone-link">
                    📞 {property.contact.phone}
                  </a>
                </div>
                
                {property.contact.email && (
                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <a href={`mailto:${property.contact.email}`} className="contact-value email-link">
                      ✉️ {property.contact.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="availability-status">
                {property.isAvailable ? (
                  <span className="status-available">✓ Available Now</span>
                ) : (
                  <span className="status-unavailable">✗ Not Available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;