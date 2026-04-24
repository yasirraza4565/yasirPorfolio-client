import { useState, useEffect } from 'react';
import { getCourses } from '../services/api';
import { FiBookOpen, FiExternalLink } from 'react-icons/fi';
import useScrollAnimation from '../hooks/useScrollAnimation';
import './Courses.css';

const PLATFORM_COLORS = {
  Udemy: '#ec5252', Coursera: '#0056d3', Udacity: '#02b3e4',
  edX: '#9b59b6', YouTube: '#ff0000', LinkedIn: '#0a66c2',
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();

  useEffect(() => {
    getCourses()
      .then(r => {
        console.log('🚀 Courses data fetched successfully:', r.data.data);
        setCourses(r.data.data);
      })
      .catch(err => {
        console.error('❌ Error fetching courses:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <section id="courses" className="section courses-section">
      <div className="container">
        <div className="section-header" ref={headerRef}>
          <span className="section-label">Continuous Learning</span>
          <h2 className="section-title">Completed <span className="text-gradient">Courses</span></h2>
          <p className="section-subtitle">Always learning, always growing — here's my educational journey.</p>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <p className="empty-state">No courses added yet.</p>
        ) : (
          <div ref={gridRef} className="courses-grid">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="course-card glass-card"
                style={{ opacity: 1, transform: 'none', transition: `all 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s` }}
              >
                <div className="course-header">
                  <div className="course-icon"><FiBookOpen size={22} /></div>
                  <span className="course-platform" style={{ color: PLATFORM_COLORS[course.platform] || 'var(--clr-primary)' }}>
                    {course.platform}
                  </span>
                </div>
                <h3 className="course-name">{course.course_name}</h3>
                {course.details && <p className="course-details" style={{color:'var(--clr-primary)', fontSize:'0.85rem', fontWeight:'600', marginBottom:'8px'}}>{course.details}</p>}
                {course.description && <p className="course-desc">{course.description}</p>}
                {course.certificate_link && (
                  <div className="course-img-wrapper">
                    <img src={course.certificate_link} alt={`${course.course_name} Certificate`} className="course-img" />
                    <div className="course-overlay">
                      <a href={formatUrl(course.certificate_link)} target="_blank" rel="noreferrer" className="course-link-btn">
                        <FiExternalLink size={16} /> View Full
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
