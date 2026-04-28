import { useState, useEffect, useRef } from 'react';
import { getAbout, getSettings, getSocial, getImageUrl } from '../services/api';
import { FiGithub, FiLinkedin, FiDownload, FiArrowDown } from 'react-icons/fi';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Hero.css';

export default function Hero() {
  const [about, setAbout] = useState(null);
  const [settings, setSettings] = useState({});
  const [socials, setSocials] = useState([]);
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [countersStarted, setCountersStarted] = useState(false);
  const timerRef = useRef(null);
  const heroRef = useRef(null);

  // Typing words from settings
  const typingWords = settings.hero_typing_words
    ? settings.hero_typing_words.split(',').map(w => w.trim())
    : ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Creative Coder'];

  useEffect(() => {
    getAbout().then(r => setAbout(r.data.data)).catch(() => {});
    getSettings().then(r => setSettings(r.data.map || {})).catch(() => {});
    getSocial().then(r => setSocials(r.data.data)).catch(() => {});
  }, []);

  // Typewriter
  useEffect(() => {
    if (!typingWords.length) return;
    const word = typingWords[wordIdx % typingWords.length];
    if (typing) {
      if (displayed.length < word.length) {
        timerRef.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        timerRef.current = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timerRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      } else {
        setWordIdx(i => (i + 1) % typingWords.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [displayed, typing, wordIdx, typingWords.length]);

  // Counter animation for stat numbers
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersStarted(true); },
      { threshold: 0.3 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: settings.hero_stat_projects || '15+', label: 'Projects Done' },
    { value: settings.hero_stat_years || '2+', label: 'Years Exp.' },
    { value: settings.hero_stat_technologies || '10+', label: 'Technologies' },
  ];

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Animated Background */}
      <div className="hero-bg">
        <div className="hero-orb orb1" />
        <div className="hero-orb orb2" />
        <div className="hero-orb orb3" />
        <div className="hero-grid" />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`hero-particle particle-${i + 1}`} />
        ))}
      </div>

      <div className="container hero-content">
        {/* Text Side */}
        <div className="hero-text">
          <div className="hero-greeting hero-anim" style={{ animationDelay: '0s' }}>
            <span className="greeting-dot" />
            <span>{settings.hero_greeting || 'Available for opportunities'}</span>
          </div>

          <h1 className="hero-name hero-anim" style={{ animationDelay: '0.1s' }}>
            Hi, I'm{' '}
            <span className="text-gradient">
              {about?.name || settings.site_owner_name || 'Mohammed Yasir'}
            </span>
          </h1>

          <div className="hero-role hero-anim" style={{ animationDelay: '0.2s' }}>
            <span className="role-static">I'm a </span>
            <span className="role-typed">
              {displayed}<span className="cursor">|</span>
            </span>
          </div>

          <p className="hero-bio hero-anim" style={{ animationDelay: '0.3s' }}>
            {about?.bio || 'Passionate about crafting elegant web experiences with modern technologies. Turning complex problems into simple, beautiful solutions.'}
          </p>

          <div className="hero-actions hero-anim" style={{ animationDelay: '0.4s' }}>
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-outline">Let's Talk</a>
          </div>

          <div className="hero-socials hero-anim" style={{ animationDelay: '0.5s' }}>
            <a href={settings.github_url || 'https://github.com'} target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <FiGithub size={20} />
            </a>
            <a href={socials.find(s => s.platform === 'LinkedIn')?.url || settings.linkedin_url || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
              <FiLinkedin size={20} />
            </a>
            {about?.resume_link && (
              <a href={about.resume_link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                <FiDownload size={16} /> Resume
              </a>
            )}
          </div>
        </div>

        {/* Visual Side */}
        <div className="hero-visual hero-anim" style={{ animationDelay: '0.3s' }}>
          <div className="avatar-wrapper animate-float">
            <div className="avatar-glow" />
            {about?.profile_image ? (
              <img src={getImageUrl(about.profile_image)} alt={about.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <span>MY</span>
              </div>
            )}
            <div className="avatar-ring ring1" />
            <div className="avatar-ring ring2" />
            {/* Orbiting dot */}
            <div className="orbit-dot" />
          </div>

          {/* Stat cards */}
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card stat${i + 1} glass-card ${countersStarted ? 'stat-in' : ''}`}>
              <span className="stat-number">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a href="#about" className="scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <FiArrowDown size={14} style={{ marginTop: '4px' }} />
      </a>
    </section>
  );
}
