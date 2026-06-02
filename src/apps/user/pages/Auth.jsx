import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../../store/appStore';
import { Phone, ChevronRight, ArrowLeft, Leaf } from 'lucide-react';

const OTP_CODE = '123456';

function parseNominatimAddress(data) {
  if (!data || !data.address) return data.display_name || '';
  const addr = data.address;
  const parts = [];
  const cityOrTown = addr.city || addr.town || addr.village || addr.suburb || '';
  const road = addr.road || addr.street || addr.neighbourhood || '';
  
  if (cityOrTown) parts.push(cityOrTown);
  if (road) parts.push(road);
  if (addr.house_number) parts.push(addr.house_number);
  
  if (parts.length === 0) {
    return data.display_name.split(',').slice(0, 3).join(', ');
  }
  return parts.join(', ');
}

export default function Auth() {
  const { loginUser } = useAppStore();
  const [step, setStep] = useState('mode'); // 'mode', 'role', 'phone', 'otp', 'profile_setup'
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('user'); // 'user', 'courier', 'admin'
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  const setupMapRef = useRef(null);
  const setupMapInstanceRef = useRef(null);
  const setupMarkerRef = useRef(null);

  function handlePhoneSubmit(e) {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 12) { setError("To'g'ri telefon raqam kiriting"); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('otp'); }, 1000);
  }

  function handleOtpChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
    if (next.join('').length === 6) verifyOtp(next.join(''));
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!password) { setError("Parolni kiriting"); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = useAppStore.getState().loginAdmin(password);
      if (ok) window.location.href = '/admin';
      else { setLoading(false); setError("Admin paroli noto'g'ri"); }
    }, 700);
  }

  function verifyOtp(code) {
    if (code === OTP_CODE) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const exists = useAppStore.getState().users.find(u => u.phone === phone);
        if (isRegister) {
          if (exists) {
            setError("Bu telefon raqam allaqachon ro'yxatdan o'tgan, iltimos kirish bo'limiga o'ting");
            setOtp(['', '', '', '', '', '']);
          } else {
            setError('');
            setStep('profile_setup');
          }
        } else {
          if (exists) {
            loginUser(phone);
          } else {
            setError("Telefon raqam topilmadi. Avval ro'yxatdan o'ting");
            setOtp(['', '', '', '', '', '']);
          }
        }
      }, 700);
    }
    else { setError("Noto'g'ri kod. Maslahat: 123456"); setOtp(['', '', '', '', '', '']); setTimeout(() => document.getElementById('otp-0')?.focus(), 50); }
  }

  // Handle map initialization in profile setup
  useEffect(() => {
    if (step !== 'profile_setup' || !setupMapRef.current || !window.L || setupMapInstanceRef.current) return;

    const L = window.L;
    const defaultCoords = [41.5519, 60.6312]; // Center at Urgench
    
    const map = L.map(setupMapRef.current, {
      center: defaultCoords,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 20
    }).addTo(map);

    const marker = L.marker(defaultCoords, { draggable: true }).addTo(map);

    setupMapInstanceRef.current = map;
    setupMarkerRef.current = marker;

    const reverseGeocode = async (lat, lng) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=uz,uz-UZ,ru,en`);
        if (response.ok) {
          const data = await response.json();
          setAddress(parseNominatimAddress(data));
        }
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
      }
    };

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      reverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (setupMapInstanceRef.current) {
        setupMapInstanceRef.current.remove();
        setupMapInstanceRef.current = null;
        setupMarkerRef.current = null;
      }
    };
  }, [step]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Brauzeringiz lokatsiyani aniqlashni qo'llab-quvvatlamaydi");
      return;
    }
    setGeoLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGeoLoading(false);
        
        const map = setupMapInstanceRef.current;
        const marker = setupMarkerRef.current;
        if (map && marker) {
          map.setView([latitude, longitude], 15, { animate: true });
          marker.setLatLng([latitude, longitude]);
        }
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=uz,uz-UZ,ru,en`);
          if (response.ok) {
            const data = await response.json();
            setAddress(parseNominatimAddress(data));
          }
        } catch (err) {
          console.error(err);
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (err) => {
        setGeoLoading(false);
        setError("Lokatsiyani aniqlashga ruxsat berilmadi yoki xatolik yuz berdi");
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  function handleRegisterSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Ism va familiyani kiriting");
      return;
    }
    if (!address.trim()) {
      setError("Manzilni kiriting yoki xaritadan tanlang");
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      loginUser(phone, `${firstName.trim()} ${lastName.trim()}`, address.trim());
    }, 700);
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--c-cream)' }}>
      <div style={{ background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 60%, #52B788 100%)', padding: '3rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.15)' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Green Khorezm</h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.875rem', marginTop: '.35rem' }}>Qayta ishlang. Toping. Takrorlang.</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', marginTop: '-1.5rem' }}>
        <div className="card animate-slide-up" style={{ borderRadius: 'var(--r-xl)', padding: '1.75rem' }}>
          {step === 'mode' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Platformaga xush kelibsiz</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>Davom etish uchun variantni tanlang</p>
              
              <button className="btn btn-primary btn-full" style={{ marginBottom: '1rem', padding: '1.25rem' }}
                onClick={() => { setIsRegister(false); setStep('role'); }}>
                Tizimga kirish
              </button>
              
              <button className="btn btn-full" style={{ background: 'var(--c-green-50)', color: 'var(--c-green-700)', border: '1px solid var(--c-green-100)', padding: '1.25rem' }}
                onClick={() => { setIsRegister(true); setRole('user'); setStep('phone'); }}>
                Ro'yxatdan o'tish
              </button>
            </div>
          ) : step === 'role' ? (
            <div>
              <button onClick={() => setStep('mode')} style={{ display: 'flex', alignItems: 'center', gap: '.35rem', color: 'var(--c-text-secondary)', fontSize: '.85rem', marginBottom: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Orqaga
              </button>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Rolni tanlang</h2>
              <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>Siz kimsiz?</p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { id: 'user', name: 'Foydalanuvchi', desc: 'Chiqindilarni topshirish uchun', icon: Leaf },
                  { id: 'admin', name: 'Administrator', desc: 'Tizimni boshqarish uchun', icon: ChevronRight, hideOnRegister: true }
                ].filter(r => !isRegister || !r.hideOnRegister).map(r => (
                  <button key={r.id} onClick={() => { setRole(r.id); setStep(r.id === 'admin' ? 'password' : 'phone'); }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                      borderRadius: 'var(--r-lg)', border: '1px solid #E5E7EB', background: 'white',
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-green-500)'; e.currentTarget.style.background = 'var(--c-green-50)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <r.icon size={20} color="var(--c-green-600)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--c-text-muted)' }}>{r.desc}</p>
                    </div>
                    <ChevronRight size={18} color="#9CA3AF" />
                  </button>
                ))}
              </div>
            </div>
          ) : step === 'phone' ? (
            <>
              <button onClick={() => setStep('role')} style={{ display: 'flex', alignItems: 'center', gap: '.35rem', color: 'var(--c-text-secondary)', fontSize: '.85rem', marginBottom: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Orqaga
              </button>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{isRegister ? "Ro'yxatdan o'tish" : "Xush kelibsiz! 👋"}</h2>
                <p className="text-secondary text-sm mt-1">Boshlash uchun telefon raqamingizni kiriting ({role})</p>
              </div>
              <form onSubmit={handlePhoneSubmit}>
                <div className="input-group">
                  <label className="input-label">Telefon raqam</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
                    <input className="input-field" style={{ paddingLeft: '2.5rem' }} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
                  </div>
                  {error && <p style={{ color: 'var(--c-error)', fontSize: '.8rem', marginTop: '.25rem' }}>{error}</p>}
                </div>
                <button className="btn btn-primary btn-full mt-4" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>SMS kod yuborish <ChevronRight size={18} /></>}
                </button>
              </form>
              <div style={{ background: 'var(--c-green-50)', border: '1px solid var(--c-green-200)', borderRadius: 'var(--r-md)', padding: '.75rem 1rem', marginTop: '1.25rem', display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
                <Leaf size={16} style={{ color: 'var(--c-green-600)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '.78rem', color: 'var(--c-green-700)', fontWeight: 600 }}>Demo rejim</p>
                  <p style={{ fontSize: '.75rem', color: 'var(--c-green-600)', marginTop: 2 }}>Istalgan telefon raqam. SMS kod: <strong>123456</strong></p>
                </div>
              </div>
            </>
          ) : step === 'password' ? (
            <>
              <button onClick={() => setStep('role')} style={{ display: 'flex', alignItems: 'center', gap: '.35rem', color: 'var(--c-text-secondary)', fontSize: '.85rem', marginBottom: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Orqaga
              </button>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Admin kirishi 🛡️</h2>
                <p className="text-secondary text-sm mt-1">Administrator parolini kiriting</p>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="input-group">
                  <label className="input-label">Parol</label>
                  <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
                  {error && <p style={{ color: 'var(--c-error)', fontSize: '.8rem', marginTop: '.25rem' }}>{error}</p>}
                </div>
                <button className="btn btn-primary btn-full mt-4" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Kirish <ChevronRight size={18} /></>}
                </button>
              </form>
              <p style={{ fontSize: '.75rem', color: 'var(--c-text-muted)', marginTop: '1.25rem', textAlign: 'center' }}>
                Demo parol: <strong>admin123</strong>
              </p>
            </>
          ) : step === 'otp' ? (
            <>
              <button onClick={() => { setStep('phone'); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: '.35rem', color: 'var(--c-text-secondary)', fontSize: '.85rem', marginBottom: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Orqaga
              </button>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Kodni tasdiqlang 🔐</h2>
                <p className="text-secondary text-sm mt-1"><strong>{phone}</strong> raqamiga yuborilgan 6 xonali kodni kiriting</p>
              </div>
              <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                {otp.map((digit, i) => (
                  <input key={i} id={`otp-${i}`}
                    style={{ width: 44, height: 52, textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, border: `2px solid ${digit ? 'var(--c-green-400)' : 'rgba(0,0,0,.1)'}`, borderRadius: 'var(--r-md)', background: 'var(--c-white)', transition: 'border-color .2s' }}
                    maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => { if (e.key === 'Backspace' && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
                    autoFocus={i === 0} />
                ))}
              </div>
              {error && <p style={{ color: 'var(--c-error)', fontSize: '.8rem', textAlign: 'center', marginBottom: '.5rem' }}>{error}</p>}
              {loading && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '.5rem' }}><span className="spinner" /></div>}
            </>
          ) : (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Profil ma'lumotlari 👤</h2>
                <p className="text-secondary text-sm mt-1">Ro'yxatdan o'tishni yakunlash uchun to'ldiring</p>
              </div>
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">Ism</label>
                    <input className="input-field" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Aziz" required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Familiya</label>
                    <input className="input-field" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Karimov" required />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Manzil (yozing yoki xaritani bosing)</label>
                  <input className="input-field" type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Urgench, Al-Khwarizmi St, 12" required />
                </div>

                {/* Draggable Selector Map */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.35rem' }}>
                    <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'var(--c-text-secondary)' }}>Xaritadan tanlash (yoki siljiting)</span>
                    <button type="button" onClick={detectLocation} disabled={geoLoading}
                      style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--c-green-600)', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                      {geoLoading ? "Aniqlanmoqda..." : "📍 Lokatsiyani aniqlash"}
                    </button>
                  </div>
                  <div ref={setupMapRef} style={{ height: 160, borderRadius: 'var(--r-md)', border: '1px solid rgba(0,0,0,.1)', zIndex: 1 }} />
                </div>

                {error && <p style={{ color: 'var(--c-error)', fontSize: '.8rem', marginBottom: '.5rem' }}>{error}</p>}

                <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : "Ro'yxatdan o'tishni yakunlash"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
