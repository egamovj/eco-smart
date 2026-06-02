import { useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { Save, CheckCircle } from 'lucide-react';

const WASTE_CONFIG = [
  { id: 'plastic', emoji: '🧴', label: 'Plastik',  desc: "Idishlar, qadoqlar" },
  { id: 'paper',   emoji: '📄', label: "Qog'oz",   desc: "Karton, gazetalar" },
  { id: 'glass',   emoji: '🫙', label: 'Shisha',   desc: "Shishalar, bankalar" },
];

export default function Pricing() {
  const { rates, bonusMultiplier, updateRates, updateBonusMultiplier } = useAppStore();
  const [localRates, setLocalRates] = useState({ ...rates });
  const [localMult, setLocalMult] = useState(bonusMultiplier);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateRates(localRates);
    updateBonusMultiplier(localMult);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Narxlarni boshqarish</h1>
          <p className="text-secondary text-sm mt-1">Har bir chiqindi turi uchun kg narxini belgilang</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? <><CheckCircle size={16} /> Saqlandi!</> : <><Save size={16} /> Narxlarni saqlash</>}
        </button>
      </div>

      {saved && (
        <div style={{ background: 'var(--c-green-100)', border: '1px solid var(--c-green-300)', borderRadius: 'var(--r-md)', padding: '.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '.5rem', alignItems: 'center', color: 'var(--c-green-800)', fontWeight: 600 }}>
          <CheckCircle size={18} /> Narxlar muvaffaqiyatli yangilandi!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {WASTE_CONFIG.map(w => (
          <div key={w.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--c-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{w.emoji}</div>
              <div><p style={{ fontWeight: 700 }}>{w.label}</p><p className="text-muted" style={{ fontSize: '.75rem' }}>{w.desc}</p></div>
            </div>
            <label style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--c-text-secondary)', display: 'block', marginBottom: '.5rem' }}>Bio-Coin / kg</label>
            <input type="number" className="input-field" value={localRates[w.id] ?? 0} min="0" step="50"
              onChange={e => setLocalRates(r => ({ ...r, [w.id]: Number(e.target.value) }))}
              style={{ fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.75rem' }}>
              <span className="text-muted" style={{ fontSize: '.75rem' }}>≈ {Math.round(localRates[w.id] / 100)} so'm</span>
              <span style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--c-green-600)' }}>
                {localRates[w.id] > rates[w.id] ? `▲ Oshirildi` : localRates[w.id] < rates[w.id] ? `▼ Kamaytirildi` : `● O'zgarishsiz`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus multiplikator */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.35rem' }}>🎁 Global bonus multiplikator</p>
        <p className="text-secondary text-sm mb-4">Barcha chiqindi turlariga qo'llaniladi. Aksiyalar yoki faollikni oshirish uchun foydalaning.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
              <span className="text-secondary text-sm">Multiplikator</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--c-green-700)' }}>×{localMult.toFixed(1)}</span>
            </div>
            <input type="range" min="1" max="3" step="0.1" value={localMult} onChange={e => setLocalMult(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--c-green-500)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span className="text-muted" style={{ fontSize: '.7rem' }}>×1.0 (oddiy)</span>
              <span className="text-muted" style={{ fontSize: '.7rem' }}>×3.0 (uchlik)</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', background: localMult > 1.5 ? '#FEF3C7' : 'var(--c-green-50)', borderRadius: 'var(--r-lg)', padding: '1.25rem 1.5rem', minWidth: 120 }}>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: localMult > 1.5 ? '#F59E0B' : 'var(--c-green-700)' }}>×{localMult.toFixed(1)}</p>
            <p style={{ fontSize: '.72rem', color: 'var(--c-text-secondary)', marginTop: 2 }}>
              {localMult >= 2 ? '🔥 Ikki barobar+!' : localMult > 1 ? '⚡ Kuchaytirilgan' : '● Standart'}
            </p>
          </div>
        </div>
      </div>

      {/* Jadval */}
      <div className="card" style={{ marginTop: '1rem', overflow: 'auto' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Multiplikator bilan narx yakuniy ko'rinishi</p>
        <table className="table">
          <thead><tr><th>Chiqindi turi</th><th>Asosiy narx</th><th>Multiplikator bilan</th><th>1 kg mukofot</th><th>10 kg mukofot</th></tr></thead>
          <tbody>
            {WASTE_CONFIG.map(w => (
              <tr key={w.id}>
                <td>{w.emoji} {w.label}</td>
                <td>{localRates[w.id]?.toLocaleString()} coin/kg</td>
                <td style={{ fontWeight: 700, color: 'var(--c-green-700)' }}>{Math.round(localRates[w.id] * localMult).toLocaleString()} coin/kg</td>
                <td><div className="coin-display" style={{ fontSize: '.8rem' }}><div className="coin-icon" style={{ width: 14, height: 14, fontSize: '.45rem' }}>₿</div>{Math.round(localRates[w.id] * localMult).toLocaleString()}</div></td>
                <td><div className="coin-display" style={{ fontSize: '.8rem' }}><div className="coin-icon" style={{ width: 14, height: 14, fontSize: '.45rem' }}>₿</div>{Math.round(localRates[w.id] * localMult * 10).toLocaleString()}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
