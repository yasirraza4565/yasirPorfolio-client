import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import {
  FiHome, FiCode, FiBriefcase, FiAward, FiBookOpen,
  FiMenu as FiNav, FiUser, FiShare2, FiImage, FiMessageSquare,
  FiLogOut, FiMenu, FiX, FiExternalLink, FiSettings
} from 'react-icons/fi';
import './AdminDashboard.css';

const MENU = [
  { label: 'Overview', icon: <FiHome />, path: '/admin/dashboard' },
  { label: 'About', icon: <FiUser />, path: '/admin/dashboard/about' },
  { label: 'Projects', icon: <FiCode />, path: '/admin/dashboard/projects' },
  { label: 'Experience', icon: <FiBriefcase />, path: '/admin/dashboard/experience' },
  { label: 'Achievements', icon: <FiAward />, path: '/admin/dashboard/achievements' },
  { label: 'Courses', icon: <FiBookOpen />, path: '/admin/dashboard/courses' },
  { label: 'Navbar Links', icon: <FiNav />, path: '/admin/dashboard/navbar' },
  { label: 'Social Media', icon: <FiShare2 />, path: '/admin/dashboard/social' },
  { label: 'Messages', icon: <FiMessageSquare />, path: '/admin/dashboard/messages' },
  { label: 'Site Settings', icon: <FiSettings />, path: '/admin/dashboard/settings' },

];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogout(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="logo-yasir" style={{
            fontFamily:'var(--font-heading)', fontSize:'1.4rem', fontWeight:800,
            background:'var(--grad-primary)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
          }}>Yasir<span style={{color:'#06b6d4',WebkitTextFillColor:'#06b6d4'}}>.</span></span>
          <span className="sidebar-tag">Admin</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>

        <nav className="sidebar-nav">
          {MENU.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
            <div>
              <p className="user-email">{user?.email}</p>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="sidebar-action-btn">
              <FiExternalLink size={16} /> View Site
            </a>
            <button onClick={handleLogout} className="sidebar-action-btn logout">
              <FiLogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <h2 className="topbar-title">
            <span className="topbar-title-full">Mohammed Yasir · Dashboard</span>
            <span className="topbar-title-short">Dashboard</span>
          </h2>
          <div className="topbar-right">
            <span className="topbar-user">{user?.email}</span>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div className="modal-overlay" style={{zIndex: 9999}}>
          <div className="glass-card" style={{padding: '30px', maxWidth: '400px', width: '100%', textAlign: 'center'}}>
            <FiLogOut size={48} color="var(--clr-primary)" style={{marginBottom: '16px'}} />
            <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px'}}>Confirm Logout</h3>
            <p style={{color: 'var(--clr-text-muted)', marginBottom: '24px'}}>Are you sure you want to log out of the admin panel?</p>
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
              <button className="btn btn-outline" onClick={cancelLogout}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
