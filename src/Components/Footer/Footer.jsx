import "./Footer.css";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
         <div className="footer-logo">
           <div className="footer-image"><img
              className="footer-img"
              src="/images/bookverse-logo.png"
              alt="BookVerse"
            /></div><div><h2> BookVerse</h2></div></div>
          <p>
            Discover stories that inspire, educate,
            entertain, and transform your world.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
             <li><Link to="/">Home</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/orders">Orders</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>

          <div className="social-icons">
            <span><div className="icon-image"><img
              className="icon-img"
              src="/images/instagram (1).png"
              alt="BookVerse"
            /></div></span>
            <span><div className="icon-image"><img
              className="icon-img"
              src="/images/facebook.png"
              alt="BookVerse"
            /></div></span>
            <span><div className="icon-image"><img
              className="icon-img"
              src="/images/twitter.png"
              alt="BookVerse"
            /></div></span>
            <span><div className="icon-image"><img
              className="icon-img"
              src="/images/linkedin (1).png"
              alt="BookVerse"
            /></div></span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 BookVerse. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;