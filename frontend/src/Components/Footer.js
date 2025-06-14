import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p><FaEnvelope /> daserushikesh@gmail.com</p>
            <p><FaEnvelope /> prathameshbembre01@gmail.com</p>
            <p><FaPhone /> +91 94044 65593</p>
            <p><FaPhone /> +91 90226 54357</p>
            <p><FaMapMarkerAlt /> Nanded, Maharashtra, India</p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/news">News</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-links">
            <a href="https://github.com/Bembre" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="linkedin.com/in/bembre" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>

        
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Alumni Association. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 