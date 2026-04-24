import { useEffect, useState } from 'react';
import { getProjects, getExperience, getAchievements, getCourses, getMessages } from '../../services/api';
import { FiCode, FiBriefcase, FiAward, FiBookOpen, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './AdminPage.css';

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, experience: 0, achievements: 0, courses: 0, messages: 0, unread: 0 });

  useEffect(() => {
    Promise.all([getProjects(), getExperience(), getAchievements(), getCourses(), getMessages()])
      .then(([p, e, a, c, m]) => {
        setStats({
          projects: p.data.data.length,
          experience: e.data.data.length,
          achievements: a.data.data.length,
          courses: c.data.data.length,
          messages: m.data.data.length,
          unread: m.data.data.filter(msg => !msg.is_read).length,
        });
      })
      .catch(() => {});
  }, []);

  const CARDS = [
    { label: 'Projects', value: stats.projects, icon: <FiCode />, path: '/admin/dashboard/projects', color: 'var(--clr-primary)' },
    { label: 'Experience', value: stats.experience, icon: <FiBriefcase />, path: '/admin/dashboard/experience', color: 'var(--clr-secondary)' },
    { label: 'Achievements', value: stats.achievements, icon: <FiAward />, path: '/admin/dashboard/achievements', color: 'var(--clr-accent)' },
    { label: 'Courses', value: stats.courses, icon: <FiBookOpen />, path: '/admin/dashboard/courses', color: '#f59e0b' },
    { label: 'Messages', value: stats.messages, icon: <FiMessageSquare />, path: '/admin/dashboard/messages', color: '#ec4899', extra: stats.unread > 0 ? `${stats.unread} unread` : null },
  ];

  return (
    <div className="admin-page">
      <div style={{marginBottom:'32px'}}>
        <h2 className="page-title">Welcome back! 👋</h2>
        <p className="page-sub">Here's an overview of your portfolio content.</p>
      </div>

      <div className="overview-stats">
        {CARDS.map(card => (
          <Link to={card.path} key={card.label} className="glass-card stat-overview-card" style={{textDecoration:'none',cursor:'pointer'}}>
            <div className="stat-overview-icon" style={{background:`${card.color}22`,color:card.color}}>{card.icon}</div>
            <span className="stat-overview-value">{card.value}</span>
            <span className="stat-overview-label">{card.label}</span>
            {card.extra && <span style={{fontSize:'0.75rem',color:card.color,fontWeight:600}}>{card.extra}</span>}
          </Link>
        ))}
      </div>

      <div className="glass-card" style={{padding:'24px'}}>
        <h3 style={{fontFamily:'var(--font-heading)',fontWeight:700,marginBottom:'16px'}}>Quick Actions</h3>
        <div style={{display:'flex',flexWrap:'wrap',gap:'12px'}}>
          <Link to="/admin/dashboard/projects" className="btn btn-outline btn-sm"><FiCode size={14} /> Add Project</Link>
          <Link to="/admin/dashboard/experience" className="btn btn-outline btn-sm"><FiBriefcase size={14} /> Add Experience</Link>
          <Link to="/admin/dashboard/achievements" className="btn btn-outline btn-sm"><FiAward size={14} /> Add Achievement</Link>
          <Link to="/admin/dashboard/courses" className="btn btn-outline btn-sm"><FiBookOpen size={14} /> Add Course</Link>
          <Link to="/admin/dashboard/messages" className="btn btn-outline btn-sm"><FiMessageSquare size={14} /> View Messages</Link>
        </div>
      </div>
    </div>
  );
}
