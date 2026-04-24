import { useEffect, useState } from 'react';
import { getSocial, updateSocial, upsertSocial } from '../../services/api';
import { FiFacebook, FiInstagram, FiPhone, FiCheck, FiLinkedin } from 'react-icons/fi';
import { FaSnapchatGhost } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AdminPage.css';

const PLATFORMS = [
  { key: 'LinkedIn', icon: <FiLinkedin size={20} />, label: 'LinkedIn URL' },
  { key: 'Facebook', icon: <FiFacebook size={20} />, label: 'Facebook URL' },
  { key: 'Instagram', icon: <FiInstagram size={20} />, label: 'Instagram URL' },
  { key: 'Snapchat', icon: <FaSnapchatGhost size={20} />, label: 'Snapchat URL' },
  { key: 'Phone', icon: <FiPhone size={20} />, label: 'Phone Number' },
];

export default function AdminSocial() {
  const [socials, setSocials] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    getSocial().then(r => {
      const map = {};
      r.data.data.forEach(s => { map[s.platform] = s; });
      setSocials(map);
    });
  }, []);

  const handleChange = (platform, val) => {
    setSocials(s => ({ ...s, [platform]: { ...(s[platform] || { platform }), url: val } }));
  };

  const handleToggle = (platform) => {
    setSocials(s => ({ ...s, [platform]: { ...(s[platform] || { platform }), is_active: !s[platform]?.is_active } }));
  };

  const handleSave = async (platform) => {
    setSaving(platform);
    try {
      const data = socials[platform] || { platform };
      if (data.id) await updateSocial(data.id, data);
      else await upsertSocial({ ...data, platform, icon: platform.toLowerCase() });
      toast.success(`${platform} updated!`);
      const r = await getSocial();
      const map = {};
      r.data.data.forEach(s => { map[s.platform] = s; });
      setSocials(map);
    } catch { toast.error('Failed'); }
    finally { setSaving(null); }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h2 className="page-title">Social Media</h2><p className="page-sub">Update your social media links and contact info</p></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'600px'}}>
        {PLATFORMS.map(p => (
          <div key={p.key} className="glass-card" style={{padding:'20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(99,102,241,0.12)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--clr-primary)'}}>
                {p.icon}
              </div>
              <h3 style={{fontFamily:'var(--font-heading)',fontWeight:700}}>{p.key}</h3>
              <label style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                <span style={{fontSize:'0.85rem',color:'var(--clr-text-muted)'}}>Active</span>
                <input type="checkbox" checked={socials[p.key]?.is_active ?? true} onChange={() => handleToggle(p.key)} />
              </label>
            </div>
            <div style={{display:'flex',gap:'12px'}}>
              <input
                className="form-control"
                value={socials[p.key]?.url || ''}
                onChange={e => handleChange(p.key, e.target.value)}
                placeholder={p.label}
              />
              <button className="btn btn-primary btn-sm" onClick={() => handleSave(p.key)} disabled={saving === p.key}>
                <FiCheck size={14} /> {saving === p.key ? '...' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
