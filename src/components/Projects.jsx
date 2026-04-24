import { useState, useEffect } from 'react';
import { getProjects } from '../services/api';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();

  useEffect(() => {
    console.log('👀 Header visible:', headerVisible);
    console.log('👀 Grid visible:', gridVisible);
  }, [headerVisible, gridVisible]);

  useEffect(() => {
    getProjects()
      .then(r => {
        console.log('🚀 Projects data fetched successfully:', r.data.data);
        setProjects(r.data.data);
      })
      .catch(err => {
        console.error('❌ Error fetching projects:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className="section-label">My Work</span>
          <h2 className="section-title">Featured <span className="text-gradient">Projects</span></h2>
          <p className="section-subtitle">A showcase of my best work — from concept to deployment.</p>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : projects.length === 0 ? (
          <p className="empty-state">No projects added yet.</p>
        ) : (
          <div ref={gridRef} className="projects-grid">
            {projects.map((p, i) => {
              console.log('🏗️ Rendering project card:', p.name);
              return (
                <div
                  key={p.id}
                  className="project-card glass-card"
                  style={{ opacity: 1, transform: 'none', transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s` }}
                >
                  <div className="project-img-wrapper">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="project-img" />
                    ) : (
                      <div className="project-img-placeholder"><FiCode size={48} /></div>
                    )}
                    <div className="project-overlay">
                      <div className="project-links">
                        {p.github_link && <a href={formatUrl(p.github_link)} target="_blank" rel="noreferrer" className="project-link-btn"><FiGithub size={18} /> Code</a>}
                        {p.live_link && <a href={formatUrl(p.live_link)} target="_blank" rel="noreferrer" className="project-link-btn live"><FiExternalLink size={18} /> Live</a>}
                      </div>
                    </div>
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{p.name}</h3>
                    {p.details && <p className="project-highlight" style={{ color: 'var(--clr-primary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>{p.details}</p>}
                    <p className="project-desc">{p.description}</p>
                    {p.tech_stack && (
                      <div className="project-tags">
                        {p.tech_stack.split(',').map(t => <span key={t.trim()} className="tag">{t.trim()}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
