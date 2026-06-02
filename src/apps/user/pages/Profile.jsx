import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { User, Phone, MapPin, Award, LogOut, ChevronRight, Bell, Settings } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logoutUser, theme, toggleTheme, accessibility, updateAccessibility } = useAppStore();

  const levelLabel = (currentUser?.pickups ?? 0) >= 20 ? '🏆 Eko Qahramon' :
    (currentUser?.pickups ?? 0) >= 10 ? '⚡ Qayta ishlovchi' :
    (currentUser?.pickups ?? 0) >= 5  ? '🌿 Yashil' : '🌱 Novda';

  const menuItems = [
    { icon: Bell,     label: 'Bildirishnomalar',  action: () => navigate('/notifications') },
    { icon: Award,    label: 'Tavsiya dasturi',   action: () => navigate('/rewards') },
    { icon: ChevronRight, label: 'Yordam markazi', action: () => {} },
    { icon: ChevronRight, label: "Maxfiylik siyosati", action: () => {} },
  ];

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, padding: '1.25rem 0 1rem' }}>Profil</h2>

      {/* Avatar bloki */}
      <div className="card-green animate-fade-in" style={{ padding: '1.75rem', textAlign: 'center', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <User size={36} color="#fff" />
        </div>
        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>{currentUser?.name}</h3>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.2)', color: '#fff', borderRadius: 20, padding: '.2rem .75rem', fontSize: '.75rem', fontWeight: 600, marginTop: '.5rem' }}>{levelLabel}</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem', marginTop: '1.25rem' }}>
          {[
            { label: "Topshirishlar", value: currentUser?.pickups },
            { label: 'Bio-Coin', value: (currentUser?.balance ?? 0).toLocaleString() },
            { label: 'Eco Score', value: (currentUser?.ecoScore ?? 0).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 10, padding: '.6rem .5rem' }}>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{value}</p>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.65rem', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hisob ma'lumotlari */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '.75rem' }}>Hisob ma'lumotlari</p>
        {[
          { icon: Phone,  label: 'Telefon',  value: currentUser?.phone },
          { icon: MapPin, label: 'Manzil',   value: currentUser?.address || "Ko'rsatilmagan" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.65rem 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--c-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color="var(--c-green-600)" />
            </div>
            <div>
              <p style={{ fontSize: '.72rem', color: 'var(--c-text-muted)' }}>{label}</p>
              <p style={{ fontWeight: 600, fontSize: '.875rem' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Maxsus imkoniyatlar */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '.75rem' }}>Maxsus imkoniyatlar va dizayn</p>
        
        {/* Theme mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
          <span style={{ fontSize: '.875rem', fontWeight: 600 }}>🌙 Tungi / Kechgi rejim</span>
          <button className="btn btn-secondary btn-sm" onClick={toggleTheme} style={{ padding: '.25rem .6rem', borderRadius: 8 }}>
            {theme === 'light' ? "Yoqish" : "O'chirish"}
          </button>
        </div>

        {/* Large text */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
          <span style={{ fontSize: '.875rem', fontWeight: 600 }}>🔎 Kattalashtirilgan matn</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={accessibility.largeText} onChange={(e) => updateAccessibility('largeText', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* High contrast */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
          <span style={{ fontSize: '.875rem', fontWeight: 600 }}>👁️ Yuqori kontrast</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={accessibility.highContrast} onChange={(e) => updateAccessibility('highContrast', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Dyslexic font */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
          <span style={{ fontSize: '.875rem', fontWeight: 600 }}>📖 O'qishga qulay shrift</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={accessibility.dyslexicFont} onChange={(e) => updateAccessibility('dyslexicFont', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Text to Speech */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.65rem 0' }}>
          <span style={{ fontSize: '.875rem', fontWeight: 600 }}>🔊 Ovozli yordamchi (TTS)</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={accessibility.textToSpeech} onChange={(e) => updateAccessibility('textToSpeech', e.target.checked)} />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Menyu */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        {menuItems.map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action}
            style={{ display: 'flex', alignItems: 'center', gap: '.75rem', width: '100%', padding: '.85rem 0', borderBottom: '1px solid rgba(0,0,0,.05)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--c-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color="var(--c-text-secondary)" />
            </div>
            <span style={{ flex: 1, fontWeight: 600, fontSize: '.875rem' }}>{label}</span>
            <ChevronRight size={16} color="var(--c-text-muted)" />
          </button>
        ))}
      </div>

      {/* Chiqish */}
      <button className="btn btn-full" onClick={logoutUser}
        style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 'var(--r-full)', padding: '.85rem', fontWeight: 700 }}>
        <LogOut size={18} /> Hisobdan chiqish
      </button>
    </div>
  );
}
