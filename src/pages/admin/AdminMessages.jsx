import { useEffect, useState } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '../../services/api';
import { FiMail, FiTrash2, FiCheck, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AdminPage.css';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); getMessages().then(r => setMessages(r.data.data)).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleRead = async id => {
    await markMessageRead(id); load();
  };
  const handleDelete = async id => {
    if (!window.confirm('Delete this message?')) return;
    await deleteMessage(id); toast.success('Deleted'); load();
  };

  const unread = messages.filter(m => !m.is_read).length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Contact Messages</h2>
          <p className="page-sub">{unread} unread message{unread !== 1 ? 's' : ''}</p>
        </div>
      </div>
      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          {messages.map(msg => (
            <div key={msg.id} className={`glass-card msg-card ${!msg.is_read ? 'unread' : ''}`} style={{padding:'20px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background: msg.is_read ? 'var(--clr-surface)' : 'rgba(99,102,241,0.15)',display:'flex',alignItems:'center',justifyContent:'center',color: msg.is_read ? 'var(--clr-text-muted)' : 'var(--clr-primary)',flexShrink:0}}>
                  <FiMail size={18} />
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',marginBottom:'4px'}}>
                    <strong style={{fontFamily:'var(--font-heading)'}}>{msg.name}</strong>
                    <span style={{color:'var(--clr-text-muted)',fontSize:'0.85rem'}}>{msg.email}</span>
                    {!msg.is_read && <span className="badge" style={{fontSize:'0.7rem'}}>New</span>}
                    <span style={{marginLeft:'auto',color:'var(--clr-text-subtle)',fontSize:'0.8rem'}}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  {msg.subject && <p style={{color:'var(--clr-text-muted)',fontSize:'0.85rem',marginBottom:'8px',fontWeight:600}}>{msg.subject}</p>}
                  <p style={{color:'var(--clr-text-muted)',fontSize:'0.9rem',lineHeight:1.6}}>{msg.message}</p>
                </div>
                <div style={{display:'flex',gap:'8px',flexShrink:0}}>
                  {!msg.is_read && (
                    <button className="btn btn-outline btn-sm btn-icon" title="Mark as read" onClick={() => handleRead(msg.id)}><FiCheck size={14} /></button>
                  )}
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(msg.id)}><FiTrash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {messages.length === 0 && <p style={{color:'var(--clr-text-muted)',textAlign:'center',padding:'60px 0'}}>No messages received yet.</p>}
        </div>
      )}
    </div>
  );
}
