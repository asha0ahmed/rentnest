import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Perfect Home in Bangladesh
            </h1>
            <p className="hero-subtitle">
              Discover apartments, hostels, and sublets across Bangladesh. 
              Easy, fast, and reliable rental platform.
            </p>
            <div className="hero-buttons">
              <Link to="/properties" className="btn btn-primary btn-lg">
                Browse Properties
              </Link>
              <Link to="/signup" className="btn btn-secondary btn-lg">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>
      

{/* Terms and Conditions Section */}
<section className="terms-section">
  <div className="container">
    <h2 className="section-title">Terms & Conditions</h2>
    <p className="terms-intro">
      Please read these terms carefully before using Rentnest
    </p>
    
    <div className="terms-grid">
      {/* Term 1 */}
      <div className="term-card">
        <div className="term-icon">
          <img src="/term-user-icon.png" alt="User Responsibilities" className="term-icon-img" />
        </div>
        <h3>User Responsibilities</h3>
        <p>
          সব ব্যবহারকারীকে সঠিক তথ্য প্রদান করতে হবে। বাড়ির মালিকদের তাদের তালিকাভুক্ত
          সম্পত্তির তথ্যের যথার্থতার জন্য সম্পূর্ণভাবে দায়ী থাকবেন। ভাড়াটিয়াদের কোনো সিদ্ধান্ত
          নেওয়ার আগে সম্পত্তির বিস্তারিত তথ্য যাচাই করা আবশ্যক।
        </p>
      </div>

      {/* Term 2 */}
      <div className="term-card">
        <div className="term-icon">
          <img src="/extensive-listing-icon.png" alt="Property Listings" className="term-icon-img" />
        </div>
        <h3>Property Listings</h3>
        <p>
          বাড়ির মালিকদের অবশ্যই বিজ্ঞাপিত সম্পত্তির উপর বৈধ অধিকার থাকতে হবে। সব বিজ্ঞাপনে সঠিক
          ছবি, বিবরণ এবং মূল্য উল্লেখ থাকতে হবে। ভুল বা বিভ্রান্তিকর তথ্য দেওয়া সম্পূর্ণভাবে নিষিদ্ধ।
        </p>
      </div>

      {/* Term 3 */}
      <div className="term-card">
        <div className="term-icon">
          <img src="/term-payment-icon.png" alt="Payment & Fees" className="term-icon-img" />
        </div>
        <h3>Payment & Fees</h3>
        <p>
          Rentnest হলো এমন একটি প্ল্যাটফর্ম যা বাড়ির মালিক এবং ভাড়াটিয়াদের সংযুক্ত করে। বাড়ির 
          মালিক ও ভাড়াটিয়ার মধ্যে যেকোনো অর্থনৈতিক চুক্তি বা লেনদেন সম্পূর্ণভাবে তাদের নিজেদের
           দায়িত্বে সম্পন্ন হবে। কোনো অবস্থাতেই আমাদের দায়ী করা যাবে না।
          
        </p>
      </div>

      {/* Term 4 */}
      <div className="term-card">
        <div className="term-icon">
          <img src="/term-privacy-icon.png" alt="Privacy & Security" className="term-icon-img" />
        </div>
        <h3>Privacy & Security</h3>
        <p>
          আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখি। আপনি যখন কোনো বাড়ির মালিক বা ভাড়াটিয়ার সঙ্গে
          যোগাযোগ করতে চান, তখনই কেবল আপনার যোগাযোগের তথ্য শেয়ার করা হয়। আমরা কখনোই 
          আপনার তথ্য বিক্রি করি না।
        </p>
      </div>

      {/* Term 5 */}
      <div className="term-card">
        <div className="term-icon">
          <img src="/term-dispute-icon.png" alt="Disputes & Resolution" className="term-icon-img" />
        </div>
        <h3>Disputes & Resolution</h3>
        <p>
          বাড়ির মালিক এবং ভাড়াটিয়ার মধ্যে কোনো বিরোধ হলে তা তাদের নিজেদের মধ্যে সমাধান করতে
          হবে। Rentnest কেবল একটি প্ল্যাটফর্ম হিসেবে কাজ করে এবং কোনো ধরনের বিরোধ বা সমস্যার 
          জন্য দায়ী নয়।
        </p>
      </div>

      {/* Term 6 */}
      <div className="term-card">
        <div className="term-icon">
          <img src="/term-prohibited-icon.png" alt="Prohibited Activities" className="term-icon-img" />
        </div>
        <h3>Prohibited Activities</h3>
        <p>
          ভুয়া বিজ্ঞাপন, প্রতারণা, হয়রানি বা কোনো অবৈধ কার্যক্রম সম্পূর্ণভাবে নিষিদ্ধ। এই নিয়ম 
          ভঙ্গকারীদের স্থায়ীভাবে নিষিদ্ধ করা হবে এবং প্রয়োজনে সংশ্লিষ্ট কর্তৃপক্ষকে জানানো হবে।
        </p>
      </div>
    </div>

    <div className="terms-footer">
      <p>
        By using Rentnest, you agree to these terms and conditions. 
        Last updated: January 2025
      </p>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Rentnest?</h2>
          
          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/wide-selection-icon.png" alt="Wide Selection" className="feature-icon-img" />
              </div>
              <h3>Wide Selection</h3>
             <p>Browse thousands of verified properties across Bangladesh</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/smart-search-icon.png" alt="Smart Search" className="feature-icon-img" />
              </div>
              <h3>Smart Search</h3>
              <p>Find exactly what you need with powerful filters</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/extensive-listing-icon.png" alt="Extensive Listings" className="feature-icon-img" />
              </div>
              <h3>Extensive Listing</h3>
              <p>A vast collection of properties</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/direct-contact-icon.png" alt="Direct Contact" className="feature-icon-img" />
              </div>
              <h3>Direct Contact</h3>
              <p>Connect directly with property owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up as a tenant or property owner in seconds</p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Search or List</h3>
              <p>Browse properties or list your own rental</p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Connect</h3>
              <p>Contact owners or tenants directly</p>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Move In</h3>
              <p>Complete the deal and move to your new home!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Dream Home?</h2>
            <p>Join thousands of happy tenants and landlords on Rentnest</p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src="/logo.png" alt="Rentnest Logo" className="footer-logo-img" />
              </div>
              <p>Your helpful rental platform in Bangladesh</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/properties">Browse Properties</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Login</Link>
            </div>
            
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: ashaahmed012345@gmail.com</p>
              <p>Phone: +880 1937-553593</p>
              <div className="social-links">
               <a 
                href="https://www.linkedin.com/in/asha-ahmed-16729b375/" 
                target="_blank" 
                 rel="noopener noreferrer"
                className="social-icon linkedin"
                aria-label="LinkedIn"
              >
                <span>in</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 Rentnest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;