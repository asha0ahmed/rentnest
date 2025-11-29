import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { propertyAPI } from '../services/api';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProperties();
    // eslint-disable-next-line
  }, []);

  const fetchMyProperties = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await propertyAPI.getMyProperties();
      setProperties(response.data.data.properties);
    } catch (err) {
      setError('Failed to load your properties.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await propertyAPI.deleteProperty(id);
      alert('Property deleted successfully!');
      fetchMyProperties(); // Refresh list
    } catch (err) {
      alert('Failed to delete property. Please try again.');
      console.error(err);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await propertyAPI.toggleAvailability(id);
      alert(`Property marked as ${currentStatus ? 'unavailable' : 'available'}!`);
      fetchMyProperties(); // Refresh list
    } catch (err) {
      alert('Failed to update availability. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="owner-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>My Properties Dashboard</h1>
            <p>Welcome back, {user?.fullName}! </p>
          </div>
          <Link to="/properties/create" className="btn btn-primary">
            + Add New Property<br/>বাসা ভাড়ার বিজ্ঞাপন দিন
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{properties.length}</h3>
              <p>Total Properties</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{properties.filter(p => p.isAvailable).length}</h3>
              <p>Available</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-info">
              <h3>{properties.filter(p => !p.isAvailable).length}</h3>
              <p>Unavailable</p>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="properties-section">
          <h2>Your Properties ({properties.length})</h2>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your properties...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No Properties Yet</h3>
              <p>Start by adding your first property!</p>
              <Link to="/properties/create" className="btn btn-primary">
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="owner-properties-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onDelete={handleDelete}
                  onToggle={handleToggleAvailability}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Property Card Component for Owner
const PropertyCard = ({ property, onDelete, onToggle }) => {
  const photoUrl = property.photos && property.photos.length > 0
    ? property.photos[0].url
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="owner-property-card">
      <div className="property-image">
        <img src={photoUrl} alt={property.title} />
        <div className={`availability-badge ${property.isAvailable ? 'available' : 'unavailable'}`}>
          {property.isAvailable ? '✓ Available' : '✗ Unavailable'}
        </div>
      </div>

      <div className="property-content">
        <h3>{property.title}</h3>
        <p className="property-location">
          📍 {property.location.area}, {property.location.district}
        </p>
        
        <div className="property-meta">
          <span className="property-type">{property.propertyType}</span>
          <span className="property-rent">৳{property.rent.amount.toLocaleString()}/{property.rent.period}</span>
        </div>

        <div className="property-stats">
          {property.features.bedrooms && <span>🛏️ {property.features.bedrooms} Bed</span>}
          {property.features.bathrooms && <span>🚿 {property.features.bathrooms} Bath</span>}
          {property.features.size?.value && (
            <span>📏 {property.features.size.value} {property.features.size.unit}</span>
          )}
        </div>

        <div className="property-actions">
          <Link to={`/properties/${property._id}`} className="btn-action btn-view">
            👁️ View
          </Link>
          <Link to={`/properties/edit/${property._id}`} className="btn-action btn-edit">
            ✏️ Edit
          </Link>
          <button
            className={`btn-action ${property.isAvailable ? 'btn-toggle-off' : 'btn-toggle-on'}`}
            onClick={() => onToggle(property._id, property.isAvailable)}
          >
            {property.isAvailable ? '🔴 ভাড়া হয়ে গিয়েছে' : '🟢 Mark Available'}
          </button>
          <button
            className="btn-action btn-delete"
            onClick={() => onDelete(property._id, property.title)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;