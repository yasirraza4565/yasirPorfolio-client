import { useState, useEffect } from 'react';
import { getAchievements, getImageUrl } from '../services/api';
import { FiAward } from 'react-icons/fi';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Achievements.css';

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();

  useEffect(() => {
    getAchievements()
      .then(r => {
        console.log('🚀 Achievements data fetched successfully:', r.data.data);
        setItems(r.data.data);
      })
      .catch(err => {
        console.error('❌ Error fetching achievements:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="achievements" className="section achievements-section">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className="section-label">Recognition</span>
          <h2 className="section-title">My <span className="text-gradient">Achievements</span></h2>
          <p className="section-subtitle">Milestones and recognitions from my journey.</p>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : items.length === 0 ? (
          <p className="empty-state">No achievements added yet.</p>
        ) : (
          <div ref={gridRef} className="achievements-grid">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="achievement-card glass-card"
                style={{ opacity: 1, transform: 'none', transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s` }}
              >
                {item.image && (
                  <div className="ach-img-wrapper">
                    <img src={getImageUrl(item.image)} alt={item.title} className="ach-img" />
                  </div>
                )}
                <div className="ach-body">
                  <div className="ach-icon"><FiAward size={24} /></div>
                  <h3 className="ach-title">{item.title}</h3>
                  {item.details && <p className="ach-details">{item.details}</p>}
                  {item.description && <p className="ach-desc">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
