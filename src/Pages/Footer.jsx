import React from 'react';
import '../Css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h2>About Us</h2>
            <p>Your Clothing Store is dedicated to providing high-quality clothing for all occasions.</p>
          </div>
          <div className="footer-section links">
            <h2>Quick Links</h2>
            <ul>
              <li><a href="/Home">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Feedback</a></li>
            </ul>
          </div>
          <div className="footer-section contact">
            <h2>Contact Us</h2>
            <p>Email: poojacollection@gmail.com</p>
            <p>Phone: +91***********</p>
          </div>
        </div>
        <p className="footer-bottom">&copy; 2024 Pooja Collection</p>
      </div>
    </footer>
  );
}

export default Footer;
