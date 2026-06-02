import { useAppStore } from '../../../store/appStore';

const ACHIEVEMENTS = [
  { id: 'first',   emoji: '🌱', label: `Birinchi yig'ish`,  desc: `Birinchi yig'ishingizni bajaring`,    locked: false },
  { id: 'streak3', emoji: '🔥', label: '3 kunlik zanjir',   desc: '3 kun ketma-ket qayta ishlang',        locked: false },
  { id: 'streak7', emoji: '⚡', label: 'Hafta jangchisi',   desc: 'Hafta davomida har kuni qayta ishlang',locked: true  },
  { id: 'kg50',    emoji: '⭐', label: '50 kg chegara',     desc: "Jami 50 kg qayta ishlang",             locked: true  },
  { id: 'ref5',    emoji: '🤝', label: `Super do'st`,       desc: "5 do'stni taklif qiling",              locked: true  },
  { id: 'eco',     emoji: '🌍', label: 'Eko chempion',      desc: "100 kg CO₂ tejang",                    locked: true  },
];

const PROMOTIONS = [
  { id: 'p1', title: 'Ikki barobar coin hafta soni', desc: 'Har shanba va yakshanbada 2× Bio-Coin toping!', bg: 'linear-gradient(135deg,#F59E0B,#F97316)', emoji: '🚀', expires: '31 mar tugaydi' },
  { id: 'p2', title: "Do'st taklif et – Coin top",   desc: "Har bir taklif qilgan do'stingiz uchun 500 coin.", bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)', emoji: '🎁', expires: 'Doimo' },
  { id: 'p3', title: 'Birinchi shisha bonusi',        desc: `Birinchi shisha yig'ishda +50% coin toping.`,   bg: 'linear-gradient(135deg,#10B981,#059669)', emoji: '🫙', expires: 'Cheklangan' },
];

export default function Rewards() {
  const { currentUser } = useAppStore();
  const streak = currentUser?.streak ?? 0;
  const pickups = currentUser?.pickups ?? 0;

  const levelLabel = pickups >= 20 ? '🏆 Eko Qahramon' : pickups >= 10 ? '⚡ Qayta ishlovchi' : pickups >= 5 ? '🌿 Yashil' : '🌱 Novda';
  const nextLevel = pickups >= 20 ? 50 : pickups >= 10 ? 20 : pickups >= 5 ? 10 : 5;

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, padding: '1.25rem 0 1rem' }}>Mukofotlar 🎁</h2>

      {/* Daraja */}
      <div className="card-green animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.8rem' }}>Darajangiz</p>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', marginTop: 2 }}>{levelLabel}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.75rem' }}>Keyingi daraja</p>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '.9rem', marginTop: 2 }}>{Math.max(0, nextLevel - pickups)} ta yig'ish</p>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(100, (pickups / nextLevel) * 100)}%`, background: 'rgba(255,255,255,.8)' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.72rem', marginTop: '.4rem' }}>{pickups} ta yig'ish bajarildi</p>
      </div>

      {/* Aksiyalar */}
      <div className="section-header"><p className="section-title">Faol aksiyalar</p></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginBottom: '1.25rem' }}>
        {PROMOTIONS.map(p => (
          <div key={p.id} style={{ background: p.bg, borderRadius: 'var(--r-lg)', padding: '1.1rem 1.25rem', color: '#fff', display: 'flex', gap: '.85rem', alignItems: 'flex-start', boxShadow: 'var(--shadow-md)' }}>
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: '.9rem' }}>{p.title}</p>
              <p style={{ opacity: .85, fontSize: '.78rem', marginTop: 4 }}>{p.desc}</p>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,.2)', borderRadius: 20, padding: '.15rem .6rem', fontSize: '.68rem', fontWeight: 700, marginTop: 6 }}>{p.expires}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tavsiya kodi */}
      <div className="card" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.5rem' }}>Tavsiya kodingiz 🤝</p>
        <div style={{ background: 'var(--c-green-50)', border: '2px dashed var(--c-green-300)', borderRadius: 'var(--r-md)', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '.15em', color: 'var(--c-green-700)' }}>{currentUser?.referralCode ?? 'BIOC01'}</p>
        </div>
        <p className="text-secondary text-sm">Kodingizni ulashing. Siz va do'stingiz <strong>500 coin olasiz!</strong></p>
        <button className="btn btn-primary btn-sm mt-3" onClick={() => navigator.clipboard?.writeText(currentUser?.referralCode ?? '')}>
          Nusxa olish
        </button>
      </div>

      {/* Yutuqlar */}
      <div className="section-header"><p className="section-title">Yutuqlar</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        {ACHIEVEMENTS.map(ach => {
          const unlocked = !ach.locked && (ach.id === 'first' ? pickups > 0 : ach.id === 'streak3' ? streak >= 3 : true);
          return (
            <div key={ach.id} className="card" style={{ textAlign: 'center', padding: '1rem .75rem', opacity: unlocked ? 1 : .45 }}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem', filter: unlocked ? 'none' : 'grayscale(100%)' }}>{ach.emoji}</div>
              <p style={{ fontWeight: 700, fontSize: '.8rem' }}>{ach.label}</p>
              <p className="text-muted" style={{ fontSize: '.68rem', marginTop: 2 }}>{ach.desc}</p>
              {unlocked && <span className="badge badge-green" style={{ marginTop: 8 }}>Qo'lga kiritildi</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
