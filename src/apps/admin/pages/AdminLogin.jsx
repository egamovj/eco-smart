import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { Lock, Leaf } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin } = useAppStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = loginAdmin(password);
      if (ok) navigate('/admin/dashboard');
      else { setError("Noto'g'ri parol. Maslahat: admin123"); setLoading(false); }
    }, 800);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0D2B1F 0%,#1B4332 50%,#2D6A4F 100%)', padding: '1.5rem' }}>
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(82,183,136,.08)' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(82,183,136,.06)' }} />
      <div style={{ background: 'rgba(255,255,255,.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 'var(--r-xl)', padding: '2.5rem', width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,.4)', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '18px', background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: '1.5rem' }}>Green Khorezm Admin</h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.875rem', marginTop: '.35rem' }}>Chiqindilarni boshqarish markazi</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label" style={{ color: 'rgba(255,255,255,.6)' }}>Admin login</label>
            <input className="input-field" defaultValue="admin@greenkhorezm.uz" readOnly style={{ background: 'rgba(255,255,255,.06)', color: '#fff', border: '1.5px solid rgba(255,255,255,.12)' }} />
          </div>
          <div className="input-group">
            <label className="input-label" style={{ color: 'rgba(255,255,255,.6)' }}>Parol</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,.4)' }} />
              <input className="input-field" type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Parolni kiriting"
                style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,.06)', color: '#fff', border: '1.5px solid rgba(255,255,255,.12)' }} />
            </div>
            {error && <p style={{ color: '#FC8181', fontSize: '.8rem' }}>{error}</p>}
          </div>
          <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading} style={{ marginTop: '.5rem' }}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '🔐 Kirish'}
          </button>
        </form>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', marginTop: '1.5rem', background: 'rgba(82,183,136,.1)', borderRadius: 'var(--r-md)', padding: '.75rem', border: '1px solid rgba(82,183,136,.2)' }}>
          <Leaf size={16} color="var(--c-green-400)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)' }}>Demo parol: <strong style={{ color: 'var(--c-green-400)' }}>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}
