import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getNavbar, getLogo } from '../services/api';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const [links, setLinks] = useState([]);
  const [logo, setLogo] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    getNavbar().then(r => setLinks(r.data.data)).catch(() => {});
    getLogo().then(r => setLogo(r.data.data)).catch(() => {});

    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      // Update active section
      const sections = ['home', 'about', 'experience', 'projects', 'achievements', 'courses', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const defaultLinks = [
    { id: 1, label: 'Home', href: '#home' },
    { id: 2, label: 'About', href: '#about' },
    { id: 3, label: 'Experience', href: '#experience' },
    { id: 4, label: 'Projects', href: '#projects' },
    { id: 5, label: 'Achievements', href: '#achievements' },
    { id: 6, label: 'Courses', href: '#courses' },
    { id: 7, label: 'Contact', href: '#contact' },
  ];

  const navLinks = links.filter(l => l.is_active).length > 0
    ? links.filter(l => l.is_active)
    : defaultLinks;

  const handleNavClick = (href) => {
    setOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <nav className="nav-inner container">
        {/* Logo */}
        <a href="#home" className="nav-logo" onClick={() => handleNavClick('#home')}>
          {logo ? (
            <img src={logo.path} alt="Logo" />
          ) : (
            <span className="logo-text">
              <span className="logo-yasir">yasir</span><span className="dot">.</span>
            </span>
          )}
        </a>

        {/* Links */}
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.id}>
              <a
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={toggleTheme} aria-label="Toggle theme" style={{ color: 'var(--clr-text)', display: 'flex', alignItems: 'center', padding: '6px' }}>
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <a href="/admin" className="btn btn-primary btn-sm nav-cta">Admin</a>
          </li>
        </ul>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>
    </header>
  );
}
