import { useAppStore } from '../../../store/appStore';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { MONTHLY_DATA, WASTE_BREAKDOWN } from '../../../data/mockData';

const TOP_USERS = [
  { name: 'Feruza N.',  kg: 81.5 },
  { name: 'Dilnoza Y.', kg: 62.0 },
  { name: 'Iroda X.',   kg: 46.0 },
  { name: 'Aziza K.',   kg: 38.5 },
  { name: 'Gulnara S.', kg: 28.0 },
];

const DAILY_DATA = [
  { day: 'Du', orders: 28 }, { day: 'Se', orders: 35 }, { day: 'Cho', orders: 22 },
  { day: 'Pa', orders: 41 }, { day: 'Ju', orders: 38 }, { day: 'Sh',  orders: 52 }, { day: 'Ya', orders: 30 },
];

const TT = { contentStyle: { borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,.1)', fontSize: '.8rem' } };

export default function Analytics() {
  const { orders, users } = useAppStore();
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalKg = completedOrders.reduce((s, o) => s + o.weight, 0).toFixed(1);
  const co2Saved = (parseFloat(totalKg) * 1.8).toFixed(1);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Tahlil</h1>
        <p className="text-secondary text-sm mt-1">Platforma samaradorlik ko'rsatkichlari</p>
      </div>

      {/* Ta'sir ko'rsatkichlari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Jami qayta ishlandi', value: `${totalKg} kg`,  color: '#10B981', emoji: '♻️' },
          { label: "CO₂ tejaldi",         value: `${co2Saved} kg`, color: '#3B82F6', emoji: '🌍' },
          { label: 'Faol foydalanuvchilar', value: users.filter(u => u.pickups > 0).length, color: '#8B5CF6', emoji: '👤' },
          { label: 'Tarqatilgan coinlar', value: completedOrders.reduce((s,o) => s + o.reward, 0).toLocaleString(), color: '#F59E0B', emoji: '🪙' },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <p style={{ fontSize: '1.6rem', marginBottom: '.5rem' }}>{k.emoji}</p>
            <p style={{ fontWeight: 800, fontSize: '1.4rem', color: k.color }}>{k.value}</p>
            <p style={{ fontSize: '.8rem', color: 'var(--c-text-secondary)', marginTop: 2 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Grafiklar 1-qator */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Oylik qayta ishlangan kg hajmi</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="kgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52B788" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#52B788" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip {...TT} formatter={v => [`${v} kg`, '']} />
              <Area type="monotone" dataKey="kg" stroke="#52B788" strokeWidth={2.5} fill="url(#kgGrad)" dot={{ r: 4, fill: '#52B788' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Chiqindi turlari bo'yicha</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={170} height={170}>
              <Pie data={WASTE_BREAKDOWN} dataKey="value" cx="50%" cy="50%" outerRadius={72} paddingAngle={3}>
                {WASTE_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']} />
            </PieChart>
          </div>
          {WASTE_BREAKDOWN.map(w => (
            <div key={w.name} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.4rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: w.color }} />
              <span style={{ fontSize: '.78rem', flex: 1 }}>{w.name}</span>
              <span style={{ fontWeight: 700, fontSize: '.78rem' }}>{w.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grafiklar 2-qator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Kunlik buyurtmalar hajmi (bu hafta)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DAILY_DATA} barSize={30}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip {...TT} formatter={v => [`${v} ta`, 'Buyurtmalar']} />
              <Bar dataKey="orders" fill="#74C69D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Eng ko'p qayta ishlovchilar (kg)</p>
          {TOP_USERS.map((u, i) => (
            <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.65rem' }}>
              <span style={{ width: 22, textAlign: 'center', fontWeight: 800, color: i < 3 ? '#F59E0B' : 'var(--c-text-muted)', fontSize: '.9rem' }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '.85rem', fontWeight: 600 }}>{u.name}</span>
                  <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--c-green-700)' }}>{u.kg} kg</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${(u.kg / 81.5) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
