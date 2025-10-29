import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add/remove class to body when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src="/logo.png" alt="Rentnest Logo" className="logo-image" />
          </Link>

          {/* Hamburger Icon */}
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Links */}
          <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/properties" className="nav-link" onClick={closeMenu}>Properties</Link>
            
            {isAuthenticated ? (
              <>
                {user?.accountType === 'owner' && (
                  <Link to="/dashboard/owner" className="nav-link" onClick={closeMenu}>
                    My Dashboard
                  </Link>
                )}
                {user?.accountType === 'tenant' && (
                  <Link to="/dashboard/tenant" className="nav-link" onClick={closeMenu}>
                    My Dashboard
                  </Link>
                )}
                
                <div className="user-menu">
                  <span className="user-name">👤 {user?.fullName}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;