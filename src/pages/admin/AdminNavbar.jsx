import { useEffect, useState } from 'react';
import { getNavbar, createNavLink, updateNavLink, deleteNavLink } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

const EMPTY = { label: '', href: '', order_index: 0, is_active: true };

export default function AdminNavbar() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); getNavbar().then(r => setItems(r.data.data)).finally(() => setLoading(false)); };
  useEffect(load, []);
  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = item => { setForm({ ...item }); setEditing(item.id); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateNavLink(editing, form); toast.success('Updated!'); }
      else { await createNavLink(form); toast.success('Added!'); }
      closeModal(); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };
  const handleDelete = async id => {
    if (!window.confirm('Delete this link?')) return;
    await deleteNavLink(id); toast.success('Deleted'); load();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h2 className="page-title">Navbar Links</h2><p className="page-sub">Control which links appear in the portfolio navigation</p></div>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus size={16} /> Add Link</button>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div className="admin-table-wrap glass-card">
          <table className="admin-table">
            <thead><tr><th>Label</th><th>Href</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><p className="item-name">{item.label}</p></td>
                  <td><code style={{color:'var(--clr-accent)',fontSize:'0.85rem'}}>{item.href}</code></td>
                  <td><span className="badge">{item.order_index}</span></td>
                  <td><span className={`badge ${item.is_active ? '' : 'badge-pink'}`}>{item.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td><div className="flex gap-2">
                    <button className="btn btn-outline btn-sm btn-icon" onClick={() => openEdit(item)}><FiEdit2 size={14} /></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}><FiTrash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="empty-row">No navbar links configured.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Link' : 'Add Nav Link'}</h3>
              <button className="modal-close" onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-row-2">
                <div className="form-group"><label className="form-label">Label *</label><input name="label" value={form.label} onChange={handleChange} className="form-control" required /></div>
                <div className="form-group"><label className="form-label">Href *</label><input name="href" value={form.href} onChange={handleChange} className="form-control" placeholder="#section" required /></div>
              </div>
              <div className="form-group"><label className="form-label">Order Index</label><input type="number" name="order_index" value={form.order_index} onChange={handleChange} className="form-control" /></div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} id="nav-active" style={{width:'18px',height:'18px'}} />
                <label htmlFor="nav-active" className="form-label" style={{margin:0}}>Active (visible in navbar)</label>
              </div>
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
