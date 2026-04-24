import { useEffect, useState } from 'react';
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

const EMPTY = { role: '', company: '', duration: '', details: '', description: '' };

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getExperience().then(r => setItems(r.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = item => { setForm({ ...item }); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await updateExperience(editing, form); toast.success('Updated!'); }
      else { await createExperience(form); toast.success('Added!'); }
      closeModal(); load();
    } catch { toast.error('Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete?')) return;
    await deleteExperience(id); toast.success('Deleted'); load();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h2 className="page-title">Experience</h2><p className="page-sub">Work history and roles</p></div>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus size={16} /> Add Experience</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="admin-table-wrap glass-card">
          <table className="admin-table">
            <thead><tr><th>Role</th><th>Company</th><th>Duration</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><p className="item-name">{item.role}</p><p className="item-sub">{item.description?.slice(0,60)}...</p></td>
                  <td><span className="badge">{item.company}</span></td>
                  <td><span className="text-muted">{item.duration}</span></td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}><FiTrash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="empty-row">No experience entries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Experience' : 'Add Experience'}</h3>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row-2">
                <div className="form-group"><label className="form-label">Role *</label><input name="role" value={form.role} onChange={handleChange} className="form-control" required /></div>
                <div className="form-group"><label className="form-label">Company *</label><input name="company" value={form.company} onChange={handleChange} className="form-control" required /></div>
              </div>
              <div className="form-group"><label className="form-label">Duration</label><input name="duration" value={form.duration} onChange={handleChange} className="form-control" placeholder="Jan 2023 – Present" /></div>
              <div className="form-group"><label className="form-label">Details (Highlight)</label><input name="details" value={form.details || ''} onChange={handleChange} className="form-control" placeholder="E.g. Remote, On-site, Part-time" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={4} /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}><FiCheck size={14} /> {saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
