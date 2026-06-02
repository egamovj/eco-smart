import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { ArrowLeft, CheckCircle, Calendar, MapPin, ChevronRight } from 'lucide-react';

const WASTE_TYPES = [
  { id: 'plastic', emoji: '🧴', label: 'Plastik',  desc: "Idishlar, qadoqlar, o'ramalar",  rate: 1200, color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'paper',   emoji: '📄', label: "Qog'oz",   desc: "Karton, gazetalar, kitoblar",     rate:  800, color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'glass',   emoji: '🫙', label: 'Shisha',   desc: "Shishalar, bankalar, idishlar",   rate:  500, color: '#8B5CF6', bg: '#EDE9FE' },
];

const STEPS = ["Tur tanlash", "Punkt va vaqt", 'Tasdiqlash'];

export default function PickupRequest() {
  const navigate = useNavigate();
  const { currentUser, createOrder, rates, mapLocations } = useAppStore();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [estQty, setEstQty] = useState(3);
  
  const recyclingPoints = mapLocations.filter(l => l.type === 'recycling');
  const [selectedPointId, setSelectedPointId] = useState(recyclingPoints[0]?.id ?? '');
  
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow.toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [note, setNote] = useState('');
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedPoint = recyclingPoints.find(p => p.id === selectedPointId) || recyclingPoints[0];

  function handleSubmit() {
    setLoading(true);
    const scheduledTime = `${date} ${time}`;
    setTimeout(() => {
      const order = createOrder(currentUser.id, selectedType, selectedPoint?.name || 'Recycling Point', scheduledTime, note);
      setCreated(order); setLoading(false);
    }, 1200);
  }

  if (created) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80dvh', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', animation: 'coinPop .5s ease-out' }}>
        <CheckCircle size={48} color="var(--c-green-600)" />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Topshirish belgilandi! 🎉</h2>
      <p className="text-secondary text-sm mt-2" style={{ maxWidth: 280 }}>Chiqindilarni belgilangan vaqtda tanlangan punktga olib borib topshiring. Operator uni o'lchab, balansingizga coin qo'shadi.</p>
      <div className="card" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'left' }}>
        {[
          ['Topshirish ID', created.id],
          ['Chiqindi turi', WASTE_TYPES.find(w => w.id === created.wasteType)?.label ?? created.wasteType],
          ['Qabul punkti', created.address],
          ['Holat', <span className="badge badge-yellow">Kutilmoqda</span>],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
            <span className="text-secondary text-sm">{label}</span>
            <span style={{ fontWeight: 700, fontSize: '.875rem', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-full mt-4" onClick={() => navigate('/')}>Bosh sahifaga qaytish</button>
      <button className="btn btn-ghost btn-full mt-2" onClick={() => { setStep(0); setSelectedType(null); setCreated(null); }}>Yangi topshirish</button>
    </div>
  );

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '1.25rem 0 1rem' }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}><ArrowLeft size={22} color="var(--c-text-primary)" /></button>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Topshirishni belgilash</h2>
      </div>

      {/* Qadamlar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i <= step ? 'var(--c-green-500)' : 'rgba(0,0,0,.08)', color: i <= step ? '#fff' : 'var(--c-text-muted)', fontSize: '.75rem', fontWeight: 700, transition: 'all .3s' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '.65rem', fontWeight: 600, marginTop: 4, color: i === step ? 'var(--c-green-600)' : 'var(--c-text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--c-green-400)' : 'rgba(0,0,0,.08)', margin: '0 .5rem', marginBottom: '1.1rem', transition: 'background .3s' }} />}
          </div>
        ))}
      </div>

      {/* 1-qadam: Tur tanlash */}
      {step === 0 && (
        <div className="animate-fade-in">
          <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Bugun nima topshirasiz?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {WASTE_TYPES.map(w => {
              const rate = rates[w.id] ?? w.rate;
              return (
                <div key={w.id} className={`waste-card ${selectedType === w.id ? 'selected' : ''}`}
                  style={{ flexDirection: 'row', textAlign: 'left', gap: '1rem', alignItems: 'center' }}
                  onClick={() => setSelectedType(w.id)}>
                  <div style={{ width: 52, height: 52, borderRadius: 'var(--r-md)', background: w.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>{w.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700 }}>{w.label}</p>
                    <p className="text-secondary text-xs mt-1">{w.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, color: w.color, fontSize: '.85rem' }}>{rate.toLocaleString()}</p>
                    <p className="text-muted" style={{ fontSize: '.65rem' }}>coin/kg</p>
                  </div>
                  {selectedType === w.id && <CheckCircle size={20} color="var(--c-green-500)" />}
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary btn-full mt-4" onClick={() => setStep(1)} disabled={!selectedType}>
            Davom etish <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* 2-qadam: Ma'lumotlar */}
      {step === 1 && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: '.75rem' }}>Taxminiy og'irlik</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
              <span className="text-secondary text-sm">~{estQty} kg</span>
              <div className="coin-display" style={{ fontSize: '.85rem' }}>
                <div className="coin-icon" style={{ width: 18, height: 18, fontSize: '.55rem' }}>₿</div>
                ~{((rates[selectedType] ?? 0) * estQty).toLocaleString()} coin
              </div>
            </div>
            <input type="range" min="1" max="30" step="0.5" value={estQty} onChange={e => setEstQty(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--c-green-500)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span className="text-muted" style={{ fontSize: '.7rem' }}>1 kg</span>
              <span className="text-muted" style={{ fontSize: '.7rem' }}>30 kg</span>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label"><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />Qabul qilish punkti</label>
            <select className="input-field" value={selectedPointId} onChange={e => setSelectedPointId(e.target.value)}>
              {recyclingPoints.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.address})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <div className="input-group">
              <label className="input-label"><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />Sana</label>
              <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="input-group">
              <label className="input-label">Vaqt</label>
              <input className="input-field" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Izoh (ixtiyoriy)</label>
            <input className="input-field" value={note} onChange={e => setNote(e.target.value)} placeholder="Masalan: shisha idishlar ko'p" />
          </div>

          <button className="btn btn-primary btn-full" onClick={() => setStep(2)} disabled={!selectedPointId}>
            Ma'lumotlarni tekshirish <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* 3-qadam: Tasdiqlash */}
      {step === 2 && (
        <div className="animate-fade-in">
          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Topshirish tafsilotlari</p>
            {[
              { label: 'Chiqindi turi', value: <span style={{ fontWeight: 700 }}>{WASTE_TYPES.find(w => w.id === selectedType)?.emoji} {WASTE_TYPES.find(w => w.id === selectedType)?.label}</span> },
              { label: "Tax. og'irlik", value: `~${estQty} kg` },
              { label: 'Tax. mukofot', value: <div className="coin-display" style={{ fontSize: '.875rem' }}><div className="coin-icon" style={{ width: 18, height: 18, fontSize: '.55rem' }}>₿</div>~{((rates[selectedType] ?? 0) * estQty).toLocaleString()}</div> },
              { label: 'Topshirish punkti', value: selectedPoint?.name },
              { label: 'Manzil', value: selectedPoint?.address },
              { label: 'Vaqt', value: `${date} ${time}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '.65rem', marginBottom: '.65rem', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
                <span className="text-secondary text-sm">{label}</span>
                <span style={{ fontWeight: 600, fontSize: '.875rem', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--c-green-50)', border: '1.5px solid var(--c-green-200)', borderRadius: 'var(--r-md)', padding: '.85rem', marginBottom: '1rem', fontSize: '.8rem', color: 'var(--c-green-700)' }}>
            ℹ️ Haqiqiy mukofot qabul punktida tarozi bilan o'lchangan og'irlik asosida hisoblanadi.
          </div>
          <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Yuklanmoqda…</> : '🚀 Topshirishni tasdiqlash'}
          </button>
        </div>
      )}
    </div>
  );
}
