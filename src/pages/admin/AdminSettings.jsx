import { useEffect, useState } from 'react';
import { getSettings, bulkUpdateSettings } from '../../services/api';
import { FiSave, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

const SETTING_GROUPS = [
  {
    title: 'Personal Info',
    keys: ['site_owner_name', 'hero_greeting'],
  },
  {
    title: 'Hero Section',
    keys: ['hero_typing_words', 'hero_stat_projects', 'hero_stat_years', 'hero_stat_technologies'],
  },
  {
    title: 'Footer & Links',
    keys: ['footer_tagline', 'github_url', 'linkedin_url'],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [labels, setLabels] = useState({});
  const [types, setTypes] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(r => {
        const map = {};
        const lblMap = {};
        const typeMap = {};
        r.data.data.forEach(s => {
          map[s.key] = s.value || '';
          lblMap[s.key] = s.label || s.key;
          typeMap[s.key] = s.type || 'text';
        });
        setSettings(map);
        setLabels(lblMap);
        setTypes(typeMap);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(settings).map(([key, value]) => ({ key, value }));
      await bulkUpdateSettings(payload);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Site Settings</h2>
          <p className="page-sub">Control all portfolio text, hero stats, and site-wide configuration</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '760px' }}>
        {SETTING_GROUPS.map(group => (
          <div key={group.title} className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiSettings style={{ color: 'var(--clr-primary)' }} /> {group.title}
            </h3>
            {group.keys.map(key => (
              settings[key] !== undefined && (
                <div className="form-group" key={key}>
                  <label className="form-label">{labels[key] || key}</label>
                  {types[key] === 'textarea' ? (
                    <textarea
                      className="form-control"
                      value={settings[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={settings[key]}
                      onChange={e => handleChange(key, e.target.value)}
                    />
                  )}
                  <small style={{ color: 'var(--clr-text-subtle)', fontSize: '0.76rem', marginTop: '4px', display: 'block' }}>
                    Key: <code style={{ color: 'var(--clr-primary)', fontSize: '0.75rem' }}>{key}</code>
                  </small>
                </div>
              )
            ))}
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '20px', maxWidth: '760px', marginTop: '8px', background: 'rgba(99,102,241,0.06)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>
          💡 <strong>Tip:</strong> Hero typing words should be comma-separated (e.g., <code style={{ color: 'var(--clr-primary)' }}>Full Stack Developer,UI/UX Designer</code>). Changes take effect immediately on the portfolio after saving.
        </p>
      </div>
    </div>
  );
}
