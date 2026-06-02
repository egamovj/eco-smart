import { useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { CreditCard, Smartphone, Zap, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const REDEEM_OPTIONS = [
  { id: 'mobile',  label: 'Mobil to\'ldirish', desc: "Istalgan UZ raqamni to'ldiring", icon: Smartphone, cost: 2000, color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'utility', label: 'Kommunal to\'lov',   desc: "Elektr / gaz to'lovi",           icon: Zap,        cost: 5000, color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'voucher', label: 'Voucher',             desc: "Hamkor do'kon kuponlari",         icon: CreditCard, cost: 3000, color: '#8B5CF6', bg: '#EDE9FE' },
];

export default function Wallet() {
  const { currentUser, transactions, redeemCoins } = useAppStore();
  const userTxns = transactions.filter(t => t.userId === currentUser?.id);
  const [redeemTarget, setRedeemTarget] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleRedeem(opt) {
    const ok = redeemCoins(currentUser.id, opt.cost, opt.label);
    if (ok) { setSuccess(`✅ Muvaffaqiyatli: ${opt.label}`); setRedeemTarget(null); setTimeout(() => setSuccess(''), 3000); }
    else setError("Yetarli Bio-Coin mavjud emas");
  }

  const txnLabel = tx => tx.type === 'earn' ? 'Kirim' : 'Chiqim';

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, padding: '1.25rem 0 1rem' }}>Hamyonim</h2>

      {/* Balans */}
      <div className="card-green animate-fade-in" style={{ padding: '1.75rem', marginBottom: '1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.8rem', marginBottom: '.5rem', fontWeight: 500 }}>Jami balans</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', marginBottom: '.4rem' }}>
          <div className="coin-icon" style={{ width: 36, height: 36, fontSize: '1rem' }}>₿</div>
          <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>
            {(currentUser?.balance ?? 0).toLocaleString()}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.8rem' }}>≈ {Math.round((currentUser?.balance ?? 0) / 100).toLocaleString()} so'm</p>
      </div>

      {/* Sarflash */}
      <div className="section-header"><p className="section-title">Bio-Coin sarflash</p></div>
      {success && <div style={{ background: 'var(--c-green-100)', border: '1px solid var(--c-green-300)', borderRadius: 'var(--r-md)', padding: '.75rem', marginBottom: '.75rem', fontSize: '.85rem', color: 'var(--c-green-700)', fontWeight: 600 }}>{success}</div>}
      {error && <div style={{ background: '#FEE2E2', borderRadius: 'var(--r-md)', padding: '.75rem', marginBottom: '.75rem', fontSize: '.85rem', color: '#991B1B', fontWeight: 600 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.65rem', marginBottom: '1.25rem' }}>
        {REDEEM_OPTIONS.map(opt => (
          <button key={opt.id} onClick={() => setRedeemTarget(opt)}
            style={{ background: 'var(--c-white)', borderRadius: 'var(--r-lg)', padding: '.9rem .65rem', textAlign: 'center', border: '1.5px solid rgba(0,0,0,.06)', cursor: 'pointer', transition: 'all .2s', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: opt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .55rem' }}>
              <opt.icon size={20} color={opt.color} />
            </div>
            <p style={{ fontSize: '.72rem', fontWeight: 700 }}>{opt.label}</p>
            <div className="coin-display" style={{ fontSize: '.68rem', justifyContent: 'center', marginTop: 4 }}>
              <div className="coin-icon" style={{ width: 14, height: 14, fontSize: '.5rem' }}>₿</div>
              {opt.cost.toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      {/* Tasdiqlash oynasi */}
      {redeemTarget && (
        <div className="overlay" onClick={() => setRedeemTarget(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: redeemTarget.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .75rem' }}>
                <redeemTarget.icon size={28} color={redeemTarget.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{redeemTarget.label}</h3>
              <p className="text-secondary text-sm mt-1">{redeemTarget.desc}</p>
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary text-sm">Narxi</span>
                <div className="coin-display"><div className="coin-icon" style={{ width: 18, height: 18, fontSize: '.55rem' }}>₿</div>{redeemTarget.cost.toLocaleString()}</div>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary text-sm">Balansingiz</span>
                <div className="coin-display"><div className="coin-icon" style={{ width: 18, height: 18, fontSize: '.55rem' }}>₿</div>{(currentUser?.balance ?? 0).toLocaleString()}</div>
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => handleRedeem(redeemTarget)}>Tasdiqlash</button>
            <button className="btn btn-ghost btn-full mt-2" onClick={() => setRedeemTarget(null)}>Bekor qilish</button>
          </div>
        </div>
      )}

      {/* Operatsiyalar tarixi */}
      <div className="section-header"><p className="section-title">Operatsiyalar tarixi</p></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
        {userTxns.length === 0 && <p className="text-secondary text-sm" style={{ textAlign: 'center', padding: '1.5rem' }}>Hali operatsiyalar yo'q.</p>}
        {userTxns.map(tx => (
          <div key={tx.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '.85rem', padding: '.9rem 1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.type === 'earn' ? 'var(--c-green-100)' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{tx.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: '.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</p>
              <p className="text-muted text-xs mt-1">{tx.date}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {tx.type === 'earn' ? <ArrowDownLeft size={14} color="var(--c-green-600)" /> : <ArrowUpRight size={14} color="var(--c-error)" />}
              <span style={{ fontWeight: 700, fontSize: '.9rem', color: tx.type === 'earn' ? 'var(--c-green-600)' : 'var(--c-error)' }}>
                {tx.type === 'earn' ? '+' : ''}{tx.amount.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
