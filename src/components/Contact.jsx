import { useState, useEffect } from 'react';
import { sendMessage, getSocial } from '../services/api';
import { FiSend, FiFacebook, FiInstagram, FiPhone, FiLinkedin } from 'react-icons/fi';
import { FaSnapchatGhost } from 'react-icons/fa';
import useScrollAnimation from '../hooks/useScrollAnimation';
import toast from 'react-hot-toast';
import './Contact.css';

const SOCIAL_ICONS = {
  LinkedIn: <FiLinkedin size={22} />,
  Facebook: <FiFacebook size={22} />,
  Instagram: <FiInstagram size={22} />,
  Snapchat: <FaSnapchatGhost size={22} />,
  Phone: <FiPhone size={22} />,
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [socials, setSocials] = useState([]);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [contentRef, contentVisible] = useScrollAnimation();

  useEffect(() => {
    getSocial().then(r => setSocials(r.data.data)).catch(() => {});
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      await sendMessage(form);
      toast.success("Message sent! I'll get back to you soon. 📬");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const getHref = (social) => {
    if (social.platform === 'Phone') return `tel:${social.url}`;
    return social.url;
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className={`section-header reveal ${headerVisible ? 'revealed' : ''}`} ref={headerRef}>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Contact <span className="text-gradient">Me</span></h2>
          <p className="section-subtitle">Have a project in mind or just want to say hello? Drop me a message!</p>
        </div>

        <div className={`contact-grid reveal ${contentVisible ? 'revealed' : ''}`} ref={contentRef}>
          {/* Info Side */}
          <div className="contact-info">
            <div className="contact-intro glass-card">
              <h3>Let's Work Together</h3>
              <p>I'm always open to new opportunities and collaborations. Whether you have a project idea, need technical expertise, or just want to connect — I'd love to hear from you.</p>
            </div>

            {socials.filter(s => s.is_active).length > 0 && (
              <div className="social-section">
                <h4 className="social-title">Find Me On</h4>
                <div className="social-links">
                  {socials.filter(s => s.is_active).map(s => (
                    <a
                      key={s.id}
                      href={getHref(s)}
                      target={s.platform !== 'Phone' ? '_blank' : undefined}
                      rel="noreferrer"
                      className="social-pill glass-card"
                    >
                      <span className="social-pill-icon">{SOCIAL_ICONS[s.platform] || <FiPhone size={22} />}</span>
                      <span>{s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Side */}
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="form-control"
                placeholder="What is this about?"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="form-control"
                placeholder="Tell me about your project or idea..."
                rows={6}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={sending}>
              {sending ? (
                <><span className="btn-spinner" /> Sending...</>
              ) : (
                <><FiSend size={16} /> Send Message</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
