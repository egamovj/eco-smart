import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/appStore';
import { Bell, Leaf, TrendingUp, Package, Award } from 'lucide-react';

const WASTE_EMOJIS = { plastic: '🧴', paper: '📄', glass: '🫙' };
const STATUS_COLOR = { completed: 'var(--c-success)', en_route: 'var(--c-info)', confirmed: 'var(--c-warning)', pending: 'var(--c-text-muted)' };
const STATUS_LABEL = { completed: 'Bajarildi', en_route: "Yo'lda", confirmed: 'Tasdiqlandi', pending: 'Kutilmoqda' };

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, orders, notifications } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;
  const userOrders = orders.filter(o => o.userId === currentUser?.id);
  const recentOrders = userOrders.slice(0, 3);
  const totalKg = (currentUser?.totalKg ?? 0).toFixed(1);
  const co2Saved = ((currentUser?.totalKg ?? 0) * 1.8).toFixed(1);

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      {/* Sarlavha */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0 1rem' }}>
        <div>
          <p className="text-sm text-secondary">Xayrli kun,</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentUser?.name?.split(' ')[0]} 👋</h2>
        </div>
        <button style={{ position: 'relative' }} onClick={() => navigate('/notifications')}>
          <Bell size={24} color="var(--c-text-primary)" />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: 'var(--c-error)', borderRadius: '50%', fontSize: '.65rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--c-cream)' }}>{unread}</span>
          )}
        </button>
      </div>

      {/* Balans kartasi */}
      <div className="card-green animate-fade-in" style={{ padding: '1.5rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '.8rem', fontWeight: 500, marginBottom: '.3rem' }}>Bio-Coin Balansi</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
          <div className="coin-icon" style={{ width: 32, height: 32, fontSize: '.9rem' }}>₿</div>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            {(currentUser?.balance ?? 0).toLocaleString()}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '.75rem' }}>≈ {Math.round((currentUser?.balance ?? 0) / 100).toLocaleString()} so'm</p>
        <button className="btn btn-sm" onClick={() => navigate('/pickup')}
          style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', marginTop: '1.25rem', backdropFilter: 'blur(8px)' }}>
          + Yangi topshirish
        </button>
      </div>

      {/* Statistika */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Topshirishlar', value: currentUser?.pickups ?? 0, icon: Package, color: '#3B82F6', bg: '#DBEAFE' },
          { label: 'Eco Score', value: (currentUser?.ecoScore ?? 0).toLocaleString(), icon: Award, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'CO₂ Tejaldi', value: `${co2Saved}kg`, icon: TrendingUp, color: '#8B5CF6', bg: '#EDE9FE' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card" style={{ padding: '.9rem .75rem', textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto .5rem' }}>
              <Icon size={18} color={color} />
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 800 }}>{value}</p>
            <p style={{ fontSize: '.65rem', color: 'var(--c-text-muted)', fontWeight: 500, marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Streak */}
      {(currentUser?.streak ?? 0) > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #F59E0B, #F97316)', borderRadius: 'var(--r-lg)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.25rem', boxShadow: '0 4px 16px rgba(245,158,11,.35)' }}>
          <span style={{ fontSize: '1.75rem' }}>🔥</span>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '.95rem' }}>{currentUser?.streak} kunlik ketma-ketlik!</p>
            <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '.75rem' }}>Qo'shimcha coinlar uchun qayta ishlashda davom eting</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>+15%</span>
        </div>
      )}

      {/* So'nggi buyurtmalar */}
      <div className="section-header">
        <p className="section-title">So'nggi topshirishlar</p>
        <button className="section-link" onClick={() => navigate('/wallet')}>Barchasini ko'rish</button>
      </div>

      {recentOrders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>♻️</div>
          <p style={{ fontWeight: 600 }}>Hali topshirishlar yo'q</p>
          <p className="text-secondary text-sm mt-1">Bio-Coin topish uchun birinchi topshirishni belgilang!</p>
          <button className="btn btn-primary btn-sm mt-4" onClick={() => navigate('/pickup')}>Topshirish yaratish</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
          {recentOrders.map(order => (
            <div key={order.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '.85rem', padding: '.9rem 1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--c-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                {WASTE_EMOJIS[order.wasteType] ?? '♻️'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '.875rem', textTransform: 'capitalize' }}>
                  {order.wasteType === 'plastic' ? 'Plastik' : order.wasteType === 'paper' ? "Qog'oz" : 'Shisha'} topshirish
                </p>
                <p className="text-secondary text-xs mt-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.scheduledTime}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {order.reward > 0 && (
                  <div className="coin-display" style={{ fontSize: '.85rem', justifyContent: 'flex-end', marginBottom: 4 }}>
                    <div className="coin-icon" style={{ width: 18, height: 18, fontSize: '.55rem' }}>₿</div>
                    +{order.reward.toLocaleString()}
                  </div>
                )}
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: STATUS_COLOR[order.status] }}>
                  ● {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ekologik maslahat */}
      <div style={{ background: 'var(--c-green-50)', border: '1.5px solid var(--c-green-200)', borderRadius: 'var(--r-lg)', padding: '1rem', marginTop: '1.25rem', display: 'flex', gap: '.75rem', alignItems: 'center' }}>
        <Leaf size={22} color="var(--c-green-600)" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--c-green-800)' }}>Kunlik eko-maslahat 🌱</p>
          <p style={{ fontSize: '.78rem', color: 'var(--c-green-700)', marginTop: 2 }}>Plastik idishlarni qayta ishlashdan oldin yuvib tashlang — bu ularning qiymatini 20% gacha oshiradi!</p>
        </div>
      </div>
    </div>
  );
}
