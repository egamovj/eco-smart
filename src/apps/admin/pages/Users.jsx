import { useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { Search } from 'lucide-react';

export default function Users() {
  const { users } = useAppStore();
  const [query, setQuery] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.phone.includes(query));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Foydalanuvchilar</h1>
          <p className="text-secondary text-sm mt-1">{users.length} ta ro'yxatdan o'tgan foydalanuvchi</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
          <input style={{ paddingLeft: '2.25rem', padding: '.65rem 1rem .65rem 2.25rem', borderRadius: 'var(--r-full)', border: '1.5px solid rgba(0,0,0,.1)', background: '#fff', fontSize: '.875rem', width: 240 }} placeholder="Ism yoki telefon bo'yicha qidirish…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="card" style={{ overflow: 'auto' }}>
        <table className="table" style={{ minWidth: 600 }}>
          <thead>
            <tr><th>Foydalanuvchi</th><th>Telefon</th><th>Yig'ishlar</th><th>kg qayta ishlandi</th><th>Balans (₿)</th><th>Ketma-ketlik</th><th>Qo'shildi</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--c-green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.8rem', color: 'var(--c-green-700)', flexShrink: 0 }}>
                      {u.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '.875rem' }}>{u.name}</p>
                      <p style={{ fontSize: '.72rem', color: 'var(--c-text-muted)' }}>{u.address || '—'}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '.875rem' }}>{u.phone}</td>
                <td><span className="badge badge-green">{u.pickups}</span></td>
                <td style={{ fontWeight: 600 }}>{u.totalKg} kg</td>
                <td>
                  <div className="coin-display" style={{ fontSize: '.875rem' }}>
                    <div className="coin-icon" style={{ width: 16, height: 16, fontSize: '.5rem' }}>₿</div>
                    {u.balance.toLocaleString()}
                  </div>
                </td>
                <td>{u.streak > 0 ? <span style={{ fontSize: '.875rem' }}>🔥 {u.streak} kun</span> : <span className="text-muted text-sm">—</span>}</td>
                <td style={{ fontSize: '.8rem', color: 'var(--c-text-secondary)' }}>{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
