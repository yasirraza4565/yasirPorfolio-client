import { useState, useEffect } from 'react';
import { getAbout, getImageUrl } from '../services/api';
import { FiCode, FiLayout, FiDatabase, FiGlobe, FiFileText } from 'react-icons/fi';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './About.css';

const DEFAULT_SKILLS = [
  { icon: <FiCode />, label: 'Frontend', techs: ['React', 'HTML5', 'CSS3', 'JavaScript'] },
  { icon: <FiLayout />, label: 'Backend', techs: ['Node.js', 'Express', 'REST API'] },
  { icon: <FiDatabase />, label: 'Database', techs: ['MySQL', 'MongoDB', 'Sequelize'] },
  { icon: <FiGlobe />, label: 'Tools', techs: ['Git', 'Docker', 'VS Code', 'Figma'] },
];

export default function About() {
  const [about, setAbout] = useState(null);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [imgRef, imgVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation();

  useEffect(() => {
    getAbout().then(r => setAbout(r.data.data)).catch(() => {});
  }, []);

  const dynamicSkills = about ? [
    { icon: <FiCode />, label: 'Frontend', techs: about.frontend_skills ? about.frontend_skills.split(',').map(s => s.trim()).filter(Boolean) : [] },
    { icon: <FiLayout />, label: 'Backend', techs: about.backend_skills ? about.backend_skills.split(',').map(s => s.trim()).filter(Boolean) : [] },
    { icon: <FiDatabase />, label: 'Database', techs: about.database_skills ? about.database_skills.split(',').map(s => s.trim()).filter(Boolean) : [] },
    { icon: <FiGlobe />, label: 'Tools', techs: about.tools_skills ? about.tools_skills.split(',').map(s => s.trim()).filter(Boolean) : [] },
  ] : DEFAULT_SKILLS;

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className={`section-header reveal ${headerVisible ? 'revealed' : ''}`} ref={headerRef}>
          <span className="section-label">Who Am I</span>
          <h2 className="section-title">About <span className="text-gradient">Me</span></h2>
          <p className="section-subtitle">Passionate developer, creative thinker, problem solver.</p>
        </div>

        <div className="about-grid">
          <div className={`about-image-side reveal reveal-left ${imgVisible ? 'revealed' : ''}`} ref={imgRef}>
            <div className="about-img-wrapper">
              <div className="about-img-bg" />
              {about?.profile_image ? (
              <img src={getImageUrl(about.profile_image)} alt={about.name} className="about-img" />
              ) : (
                <div className="about-img-placeholder">
                  <span>MY</span>
                </div>
              )}
              <div className="exp-badge glass-card">
                <span className="exp-years">2+</span>
                <span className="exp-text">Years of Experience</span>
              </div>
            </div>
          </div>

          <div className={`about-content reveal reveal-right ${contentVisible ? 'revealed' : ''}`} ref={contentRef}>
            <h3 className="about-name heading-md">{about?.name || 'Mohammed Yasir'}</h3>
            <p className="about-title">{about?.title || 'Full Stack Developer'}</p>
            <p className="about-bio">{about?.bio || 'Passionate and creative Full Stack Developer with expertise in building modern web applications.'}</p>
            
            {about?.resume_link && (
              <a href={getImageUrl(about.resume_link)} target="_blank" rel="noreferrer" className="btn btn-primary" style={{marginTop: '16px', marginBottom: '24px'}}>
                <FiFileText size={18} /> View CV
              </a>
            )}

            <div className="skills-grid">
              {dynamicSkills.map((skill, i) => (
                <div key={skill.label} className="skill-card glass-card" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="skill-icon">{skill.icon}</div>
                  <h4 className="skill-label">{skill.label}</h4>
                  <div className="skill-techs">
                    {skill.techs.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
