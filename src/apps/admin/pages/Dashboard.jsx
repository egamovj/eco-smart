import { useAppStore } from '../../../store/appStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MONTHLY_DATA, WASTE_BREAKDOWN } from '../../../data/mockData';
import { Users, Package, TrendingUp, Leaf } from 'lucide-react';

export default function Dashboard() {
  const { users, orders, mapLocations } = useAppStore();
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalKg = completedOrders.reduce((s, o) => s + (o.weight ?? 0), 0).toFixed(1);
  const totalCoins = completedOrders.reduce((s, o) => s + (o.reward ?? 0), 0).toLocaleString();
  const recyclingPoints = mapLocations.filter(l => l.type === 'recycling');

  const kpis = [
    { label: 'Jami foydalanuvchilar', value: users.length,      icon: Users,      color: '#3B82F6', bg: '#DBEAFE', change: '+12%' },
    { label: 'Jami topshirishlar',      value: orders.length,     icon: Package,    color: '#8B5CF6', bg: '#EDE9FE', change: '+8%'  },
    { label: 'Qayta ishlandi',        value: `${totalKg} kg`,   icon: Leaf,       color: '#10B981', bg: '#D1FAE5', change: '+23%' },
    { label: 'Tarqatilgan coinlar',   value: totalCoins,         icon: TrendingUp, color: '#F59E0B', bg: '#FEF3C7', change: '+18%' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Boshqaruv paneli</h1>
        <p style={{ color: 'var(--c-text-secondary)', fontSize: '.9rem', marginTop: 0.25 + 'rem' }}>Xush kelibsiz, Admin 👋 — {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} className="stat-card">
            <div className="stat-icon" style={{ background: k.bg }}><k.icon size={22} color={k.color} /></div>
            <p style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--c-text-primary)' }}>{k.value}</p>
            <p style={{ fontSize: '.8rem', color: 'var(--c-text-secondary)', marginTop: 2 }}>{k.label}</p>
            <span style={{ display: 'inline-block', marginTop: 6, fontSize: '.72rem', fontWeight: 700, color: '#10B981', background: '#D1FAE5', padding: '.15rem .5rem', borderRadius: 20 }}>{k.change} o'tgan oydan buyon</span>
          </div>
        ))}
      </div>

      {/* Grafiklar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Oylik topshirishlar va foydalanuvchilar</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)', fontSize: '.8rem' }} />
              <Line type="monotone" dataKey="orders" stroke="#52B788" strokeWidth={2.5} dot={{ r: 4, fill: '#52B788' }} name="Topshirishlar" />
              <Line type="monotone" dataKey="users"  stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6' }} strokeDasharray="5 5" name="Foydalanuvchilar" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontWeight: 700, marginBottom: '.75rem' }}>Chiqindilar bo'limi</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={160} height={160}>
              <Pie data={WASTE_BREAKDOWN} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {WASTE_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']} />
            </PieChart>
          </div>
          {WASTE_BREAKDOWN.map(w => (
            <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: w.color, flexShrink: 0 }} />
              <span style={{ fontSize: '.8rem', flex: 1 }}>{w.name}</span>
              <span style={{ fontWeight: 700, fontSize: '.8rem' }}>{w.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Punktlar + so'nggi topshirishlar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Qabul qilish punktlari ({recyclingPoints.length} ta)</p>
          {recyclingPoints.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.75rem', paddingBottom: '.75rem', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.85rem', color: 'var(--c-green-700)', flexShrink: 0 }}>
                ♻️
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '.85rem' }}>{p.name}</p>
                <p style={{ fontSize: '.72rem', color: 'var(--c-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className="badge badge-green" style={{ fontSize: '.7rem' }}>+{p.reward} coin</span>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>So'nggi topshirishlar</p>
          {orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem', paddingBottom: '.65rem', borderBottom: '1px solid rgba(0,0,0,.04)' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '.85rem' }}>{o.id}</p>
                <p style={{ fontSize: '.72rem', color: 'var(--c-text-muted)', textTransform: 'capitalize' }}>
                  {o.wasteType === 'plastic' ? 'Plastik' : o.wasteType === 'paper' ? "Qog'oz" : 'Shisha'}
                </p>
              </div>
              <span className={`badge ${o.status === 'completed' ? 'badge-green' : 'badge-gray'}`}>
                {o.status === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
