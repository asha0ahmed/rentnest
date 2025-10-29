import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import './Properties.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    division: '',
    district: '',
    minRent: '',
    maxRent: '',
    bedrooms: ''
  });

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query params from filters
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.division) params.division = filters.division;
      if (filters.district) params.district = filters.district;
      if (filters.minRent) params.minRent = filters.minRent;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;

      const response = await propertyAPI.getAllProperties(params);
      setProperties(response.data.data.properties);
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
 useEffect(() => {
  fetchProperties();
  // eslint-disable-next-line
}, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Handle search/filter submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      propertyType: '',
      division: '',
      district: '',
      minRent: '',
      maxRent: '',
      bedrooms: ''
    });
    // Fetch all properties again
    setTimeout(() => fetchProperties(), 100);
  };

  return (
    <div className="properties-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>Browse Properties</h1>
          <p>Find your perfect rental home in Bangladesh</p>
        </div>

        {/* Search & Filter Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            {/* Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                name="search"
                className="form-input search-input"
                placeholder="🔍 Search by title, location, or description..."
                value={filters.search}
                onChange={handleFilterChange}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="filters-grid">
              {/* Property Type */}
              <select
                name="propertyType"
                className="form-select"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">All Property Types</option>
                <option value="apartment">Apartment</option>
                <option value="hostel">Hostel</option>
                <option value="sublet">Sublet</option>
                <option value="room">Room</option>
                <option value="house">House</option>
              </select>

              {/* Division */}
              <select
                name="division"
                className="form-select"
                value={filters.division}
                onChange={handleFilterChange}
              >
                <option value="">All Divisions</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barishal">Barishal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>

              {/* Min Rent */}
              <input
                type="number"
                name="minRent"
                className="form-input"
                placeholder="Min Rent (BDT)"
                value={filters.minRent}
                onChange={handleFilterChange}
              />

              {/* Max Rent */}
              <input
                type="number"
                name="maxRent"
                className="form-input"
                placeholder="Max Rent (BDT)"
                value={filters.maxRent}
                onChange={handleFilterChange}
              />

              {/* Bedrooms */}
              <select
                name="bedrooms"
                className="form-select"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>

              {/* Clear Filters Button */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="results-section">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No properties found</h3>
              <p>Try adjusting your search filters</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                View All Properties
              </button>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h3>{properties.length} Properties Found</h3>
              </div>

              <div className="properties-grid">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }) => {
  // Get first photo or use placeholder
  const photoUrl = property.photos && property.photos.length > 0
    ? property.photos[0].url
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link to={`/properties/${property._id}`} className="property-card">
      <div className="property-image">
        <img src={photoUrl} alt={property.title} />
        <div className="property-badge">
          {property.propertyType}
        </div>
      </div>

      <div className="property-info">
        <h3 className="property-title">{property.title}</h3>

        <div className="property-location">
          📍 {property.location.area}, {property.location.district}
        </div>

        <div className="property-features">
          {property.features.bedrooms && (
            <span>🛏️ {property.features.bedrooms} Bed</span>
          )}
          {property.features.bathrooms && (
            <span>🚿 {property.features.bathrooms} Bath</span>
          )}
          {property.features.size?.value && (
            <span>📏 {property.features.size.value} {property.features.size.unit}</span>
          )}
        </div>

        <div className="property-footer">
          <div className="property-rent">
            <span className="rent-amount">
              ৳{property.rent.amount.toLocaleString()}
            </span>
            <span className="rent-period">/{property.rent.period}</span>
          </div>

          {property.isAvailable ? (
            <span className="badge badge-success">Available</span>
          ) : (
            <span className="badge badge-danger">Not Available</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Properties;