import React from 'react';
import './Footer.css'; // Adjust the path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-main">
          <h1>K-HUB</h1>
          <p>K-HUB KIET-RCTS</p>
          <div className="social-media">
            <a href="https://www.instagram.com/khub_kiet?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="https://www.linkedin.com/company/khub-kiet/"><FontAwesomeIcon icon={faLinkedinIn} /></a>
            <a href="https://youtube.com/@kiet-hub?si=Zw8VZmz3t504V2ip"><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="/contactus"><FontAwesomeIcon icon={faEnvelope} /></a>
          </div>
        </div>
        <div className="footer-logo">
          <img src='bulbpic.png' alt="KIET Logo" className="animated-logo" />
          
          <h4>KIET GROUP OF INSTITUTIONS <br /> BLOCK-B, GROUND FLOOR MAIN CAMPUS</h4>

          </div>
        <div>
          <ul className="footer-links">
            <h2>🇺​🇸​🇪​🇫​🇺​🇱​ 🇱​🇮​🇳​🇰​🇸​</h2>
            <li><a href="/">Home</a></li>
            <li><a href="/viewproject">Projects</a></li>
            <li><a href="/viewachivements">Achievements</a></li>
            <li><a href="/teams">Teams</a></li>
            <li><a href="/contactus">ContactUs</a></li>
          </ul>
        </div>
      </div>
      <div>
        <p>© 2023 Kiet-hub(K-HUB). All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
