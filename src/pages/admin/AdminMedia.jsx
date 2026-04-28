import { useEffect, useState } from 'react';
import { getMedia, uploadMedia, deleteMedia, getImageUrl } from '../../services/api';
import { FiUpload, FiTrash2, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

export default function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [type, setType] = useState('image');
  const [uploading, setUploading] = useState(false);

  const load = () => { setLoading(true); getMedia().then(r => setMedia(r.data.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);
      await uploadMedia(fd);
      toast.success('Uploaded!');
      setFile(null);
      load();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this media?')) return;
    await deleteMedia(id); toast.success('Deleted'); load();
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h2 className="page-title">Media Management</h2><p className="page-sub">Upload and manage your images and logo</p></div>
      </div>

      {/* Upload Form */}
      <div className="glass-card" style={{padding:'24px',maxWidth:'500px',marginBottom:'28px'}}>
        <h3 style={{marginBottom:'16px',fontFamily:'var(--font-heading)',fontWeight:700}}>Upload New File</h3>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label">File Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="form-control">
              <option value="image">Image</option>
              <option value="logo">Logo</option>
              <option value="profile">Profile Photo</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Select File</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            <FiUpload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* Media Grid */}
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'16px'}}>
          {media.map(item => (
            <div key={item.id} className="glass-card" style={{padding:'0',overflow:'hidden'}}>
              <div style={{height:'160px',background:'var(--clr-bg2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src={getImageUrl(item.path)} alt={item.filename} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} />
              </div>
              <div style={{padding:'12px'}}>
                <p style={{fontSize:'0.8rem',color:'var(--clr-text-muted)',marginBottom:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.filename}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span className={`badge ${item.type === 'logo' ? '' : 'badge-cyan'}`}>{item.type}</span>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(item.id)}><FiTrash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          {media.length === 0 && <p style={{color:'var(--clr-text-muted)',gridColumn:'1/-1',textAlign:'center',padding:'40px 0'}}>No media uploaded yet.</p>}
        </div>
      )}
    </div>
  );
}
