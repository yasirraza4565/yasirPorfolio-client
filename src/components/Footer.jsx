import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';
import './Footer.css';

export default function Footer() {
  const [tagline, setTagline] = useState('Building digital experiences with passion and precision.');

  useEffect(() => {
    getSettings()
      .then(r => { if (r.data.map?.footer_tagline) setTagline(r.data.map.footer_tagline); })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-name">Mohammed <span className="text-gradient">yasir</span></span>
            <span className="footer-dot">.</span>
          </div>
          <p className="footer-tagline">{tagline}</p>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Mohammed Yasir · Crafted with ❤️ and ☕
        </p>
      </div>
    </footer>
  );
}
