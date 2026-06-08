import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* ── BRAND ── */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-image">
              <img className="footer-img" src="/images/bookverse-logo.png" alt="BookVerse" />
            </div>
            <h2>BookVerse</h2>
          </div>

          <p>
            Discover stories that inspire, educate,
            entertain, and transform your world.
          </p>

          <div className="footer-trust">
            <span className="trust-badge">Secure Payments</span>
            <span className="trust-badge">Free Returns</span>
            <span className="trust-badge">24/7 Support</span>
          </div>
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>

        {/* ── SUPPORT ── */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* ── SOCIAL + NEWSLETTER ── */}
        <div className="footer-section">
          <h4>Follow Us</h4>

          <div className="social-icons">
            <span className="icon-image">
              <img className="icon-img" src="/images/instagram (1).png" alt="Instagram" />
            </span>
            <span className="icon-image">
              <img className="icon-img" src="/images/facebook.png" alt="Facebook" />
            </span>
            <span className="icon-image">
              <img className="icon-img" src="/images/twitter.png" alt="Twitter" />
            </span>
            <span className="icon-image">
              <img className="icon-img" src="/images/linkedin (1).png" alt="LinkedIn" />
            </span>
          </div>

          <div className="footer-newsletter">
            <p>Get new arrivals and offers in your inbox.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Your email" />
              <button type="button">Subscribe</button>
            </div>
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer-base">
        <div className="footer-bottom">
          <span className="footer-bottom-text">© 2026 BookVerse. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
            <a href="/">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;