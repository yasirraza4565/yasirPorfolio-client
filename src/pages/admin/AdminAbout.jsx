import { useEffect, useState } from 'react';
import { getAbout, updateAbout } from '../../services/api';
import { FiCheck, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

export default function AdminAbout() {
  const [form, setForm] = useState({ 
    name: '', title: '', bio: '',
    frontend_skills: '', backend_skills: '', database_skills: '', tools_skills: ''
  });
  const [file, setFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAbout().then(r => {
      const d = r.data.data;
      setForm({ 
        name: d.name || '', title: d.title || '', bio: d.bio || '',
        frontend_skills: d.frontend_skills || '',
        backend_skills: d.backend_skills || '',
        database_skills: d.database_skills || '',
        tools_skills: d.tools_skills || ''
      });
      setCurrent(d);
    });
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('profile_image', file);
      if (resumeFile) fd.append('resume', resumeFile);
      await updateAbout(fd);
      toast.success('About section updated!');
      // Refresh current data to get the new links
      getAbout().then(r => setCurrent(r.data.data));
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h2 className="page-title">About Section</h2><p className="page-sub">Update your profile information and skills</p></div>
      </div>
      <div className="glass-card" style={{padding:'32px',maxWidth:'700px'}}>
        <form onSubmit={handleSubmit}>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Full Name *</label><input name="name" value={form.name} onChange={handleChange} className="form-control" required /></div>
            <div className="form-group"><label className="form-label">Title / Role</label><input name="title" value={form.title} onChange={handleChange} className="form-control" placeholder="Full Stack Developer" /></div>
          </div>
          <div className="form-group"><label className="form-label">Bio / About Text</label><textarea name="bio" value={form.bio} onChange={handleChange} className="form-control" rows={4} /></div>
          
          <h3 style={{fontFamily:'var(--font-heading)', fontSize:'1.1rem', marginBottom:'16px', marginTop:'24px'}}>Skills (Comma separated)</h3>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Frontend Skills</label><input name="frontend_skills" value={form.frontend_skills} onChange={handleChange} className="form-control" placeholder="React, HTML, CSS" /></div>
            <div className="form-group"><label className="form-label">Backend Skills</label><input name="backend_skills" value={form.backend_skills} onChange={handleChange} className="form-control" placeholder="Node.js, Express" /></div>
          </div>
          <div className="form-row-2">
            <div className="form-group"><label className="form-label">Database Skills</label><input name="database_skills" value={form.database_skills} onChange={handleChange} className="form-control" placeholder="MySQL, MongoDB" /></div>
            <div className="form-group"><label className="form-label">Tools & Others</label><input name="tools_skills" value={form.tools_skills} onChange={handleChange} className="form-control" placeholder="Git, Docker" /></div>
          </div>

          <h3 style={{fontFamily:'var(--font-heading)', fontSize:'1.1rem', marginBottom:'16px', marginTop:'24px'}}>Media & Documents</h3>
          <div className="form-group">
            <label className="form-label">Resume Document (PDF)</label>
            <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files[0])} className="form-control" />
            {current?.resume_link && !resumeFile && (
              <p style={{marginTop:'8px', fontSize:'0.85rem'}}>
                Current Resume: <a href={current.resume_link} target="_blank" rel="noreferrer" style={{color:'var(--clr-primary)', textDecoration:'underline'}}>View PDF</a>
              </p>
            )}
            {resumeFile && <p style={{marginTop:'8px',color:'var(--clr-primary)',fontSize:'0.85rem'}}>New resume selected: {resumeFile.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="form-control" />
            {(current?.profile_image && !file) && (
              <div style={{marginTop:'12px'}}>
                <img src={current.profile_image} alt="Current" className="preview-img" style={{maxHeight:'150px',width:'auto',borderRadius:'50%'}} />
              </div>
            )}
            {file && <p style={{marginTop:'8px',color:'var(--clr-primary)',fontSize:'0.85rem'}}>New image selected: {file.name}</p>}
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={saving} style={{marginTop:'16px'}}>
            <FiCheck size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

