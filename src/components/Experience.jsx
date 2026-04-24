import { useState, useEffect } from 'react';
import { getExperience } from '../services/api';
import { FiBriefcase, FiCalendar } from 'react-icons/fi';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Experience.css';

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [listRef, listVisible] = useScrollAnimation();

  useEffect(() => {
    getExperience()
      .then(r => {
        console.log('🚀 Experience data fetched successfully:', r.data.data);
        setItems(r.data.data);
      })
      .catch(err => {
        console.error('❌ Error fetching experience:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className="section-label">My Journey</span>
          <h2 className="section-title">Work <span className="text-gradient">Experience</span></h2>
          <p className="section-subtitle">My professional journey and the roles that shaped my expertise.</p>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <p className="empty-state">No experience entries yet.</p>
        ) : (
          <div ref={listRef} className="timeline">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
                style={{ opacity: 1, transform: 'none', transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.15}s` }}
              >
                <div className="timeline-dot"><FiBriefcase size={16} /></div>
                <div className="timeline-card glass-card">
                  <div className="exp-header">
                    <h3 className="exp-role">{item.role}</h3>
                    <span className="badge">{item.company}</span>
                  </div>
                  {item.details && <p className="exp-details" style={{color:'var(--clr-primary)', fontSize:'0.85rem', fontWeight:'600', marginBottom:'4px'}}>{item.details}</p>}
                  <div className="exp-meta">
                    <span className="exp-meta-item"><FiCalendar size={14} /> {item.duration}</span>
                  </div>
                  <p className="exp-desc">{item.description}</p>
                </div>
              </div>
            ))}
            <div className="timeline-line" />
          </div>
        )}
      </div>
    </section>
  );
}
