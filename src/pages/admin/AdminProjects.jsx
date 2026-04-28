import { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject, getImageUrl } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

const EMPTY = { name: '', details: '', description: '', tech_stack: '', github_link: '', live_link: '', image: null };

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getProjects().then(r => setItems(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm(EMPTY); setFile(null); setEditing(null); setModal(true); };
  const openEdit = item => { setForm({ ...item }); setFile(null); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v != null && fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) {
        await updateProject(editing, fd);
        toast.success('Project updated!');
      } else {
        await createProject(fd);
        toast.success('Project created!');
      }
      closeModal();
      load();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProject(id);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-sub">Manage your portfolio projects</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FiPlus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="admin-table-wrap glass-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Tech Stack</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image
                      ? <img src={getImageUrl(item.image)} alt="" className="table-img" />
                      : <div className="table-img-placeholder" />}
                  </td>
                  <td>
                    <p className="item-name">{item.name}</p>
                    <p className="item-sub">{item.description?.slice(0, 60)}...</p>
                  </td>
                  <td><span className="tag">{item.tech_stack?.split(',')[0]}</span></td>
                  <td>
                    <div className="flex gap-2">
                      {item.github_link && <a href={item.github_link} target="_blank" rel="noreferrer" className="link-btn">GitHub</a>}
                      {item.live_link && <a href={item.live_link} target="_blank" rel="noreferrer" className="link-btn live">Live</a>}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={5} className="empty-row">No projects yet. Click "Add Project" to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Project' : 'Add Project'}</h3>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
              </div>
              <div className="form-group">
                <label className="form-label">Details (Highlight)</label>
                <input name="details" value={form.details || ''} onChange={handleChange} className="form-control" placeholder="E.g. Web App, Mobile App, etc." />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Tech Stack (comma separated)</label>
                <input name="tech_stack" value={form.tech_stack} onChange={handleChange} className="form-control" placeholder="React, Node.js, MySQL" />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">GitHub Link</label>
                  <input name="github_link" value={form.github_link} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Link</label>
                  <input name="live_link" value={form.live_link} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Project Image</label>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="form-control" />
                {form.image && !file && <img src={getImageUrl(form.image)} alt="" className="preview-img" />}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <FiCheck size={14} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
