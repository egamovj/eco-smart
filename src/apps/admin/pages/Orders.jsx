import { useState } from 'react';
import { useAppStore } from '../../../store/appStore';
import { Search, Eye } from 'lucide-react';

const WASTE_LABELS = { plastic: 'Plastik', paper: "Qog'oz", glass: 'Shisha' };
const WASTE_EMOJIS = { plastic: '🧴', paper: '📄', glass: '🫙' };
const STATUS_BADGE = { completed: 'badge-green', pending: 'badge-gray' };
const STATUS_LABEL = { completed: 'Bajarildi', pending: 'Kutilmoqda' };

export default function Orders() {
  const { orders, users, completeOrder } = useAppStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [weight, setWeight] = useState('3.0');

  const filtered = orders.filter(o => {
    const matchesQuery = o.id.includes(query) || o.wasteType.includes(query.toLowerCase()) || o.address.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const getUserName = id => users.find(u => u.id === id)?.name ?? '–';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Topshirishlar</h1>
          <p className="text-secondary text-sm mt-1">{orders.length} ta topshirish</p>
        </div>
        <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {[['all','Barchasi'],['pending','Kutilmoqda'],['completed','Bajarildi']].map(([s, l]) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '.35rem .85rem', borderRadius: 'var(--r-full)', border: 'none', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', background: statusFilter === s ? 'var(--c-green-500)' : '#fff', color: statusFilter === s ? '#fff' : 'var(--c-text-secondary)', boxShadow: 'var(--shadow-xs)', transition: 'all .2s' }}>
              {l}
            </button>
          ))}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
            <input style={{ paddingLeft: '2.1rem', padding: '.6rem 1rem .6rem 2.1rem', borderRadius: 'var(--r-full)', border: '1.5px solid rgba(0,0,0,.1)', background: '#fff', fontSize: '.8rem', width: 200 }} placeholder="Qidirish…" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="card" style={{ overflow: 'auto' }}>
        <table className="table" style={{ minWidth: 700 }}>
          <thead>
            <tr><th>ID</th><th>Mijoz</th><th>Tur</th><th>Holat</th><th>Og'irlik</th><th>Mukofot</th><th>Punkt</th><th>Sana</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, fontSize: '.8rem' }}>{o.id}</td>
                <td style={{ fontSize: '.875rem' }}>{getUserName(o.userId)}</td>
                <td>{WASTE_EMOJIS[o.wasteType]} <span style={{ fontSize: '.78rem', marginLeft: 5, color: 'var(--c-text-secondary)' }}>{WASTE_LABELS[o.wasteType] ?? o.wasteType}</span></td>
                <td><span className={`badge ${STATUS_BADGE[o.status] ?? 'badge-gray'}`}>{STATUS_LABEL[o.status] ?? o.status}</span></td>
                <td style={{ fontWeight: 600 }}>{o.weight > 0 ? `${o.weight} kg` : '—'}</td>
                <td>{o.reward > 0 ? <div className="coin-display" style={{ fontSize: '.8rem' }}><div className="coin-icon" style={{ width: 14, height: 14, fontSize: '.45rem' }}>₿</div>{o.reward.toLocaleString()}</div> : <span className="text-muted text-sm">—</span>}</td>
                <td style={{ fontSize: '.8rem', fontWeight: 500 }}>{o.address}</td>
                <td style={{ fontSize: '.78rem', color: 'var(--c-text-secondary)' }}>{o.scheduledTime}</td>
                <td><button style={{ background: 'var(--c-green-50)', border: 'none', borderRadius: 8, padding: '.35rem .5rem', cursor: 'pointer', color: 'var(--c-green-700)' }} onClick={() => setSelectedOrder(o)}><Eye size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="overlay" onClick={() => setSelectedOrder(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <h3 style={{ fontWeight: 800, marginBottom: '1.25rem' }}>Topshirish {selectedOrder.id}</h3>
            <div className="card">
              {[
                { label: 'Mijoz',    value: getUserName(selectedOrder.userId) },
                { label: 'Tur',      value: `${WASTE_EMOJIS[selectedOrder.wasteType]} ${WASTE_LABELS[selectedOrder.wasteType]}` },
                { label: 'Holat',    value: <span className={`badge ${STATUS_BADGE[selectedOrder.status]}`}>{STATUS_LABEL[selectedOrder.status]}</span> },
                { label: "Og'irlik", value: selectedOrder.weight > 0 ? `${selectedOrder.weight} kg` : 'Kutilmoqda' },
                { label: 'Mukofot', value: selectedOrder.reward > 0 ? `${selectedOrder.reward.toLocaleString()} coin` : '—' },
                { label: 'Punkt',  value: selectedOrder.address },
                { label: 'Sana',    value: selectedOrder.scheduledTime },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.65rem 0', borderBottom: '1px solid rgba(0,0,0,.04)' }}>
                  <span className="text-secondary text-sm">{label}</span>
                  <span style={{ fontWeight: 600, fontSize: '.875rem', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
            </div>

            {selectedOrder.status === 'pending' && (
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,.08)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '.75rem', fontSize: '.9rem' }}>Topshirishni tasdiqlash va yakunlash</h4>
                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Haqiqiy og'irlik (kg)</label>
                  <input className="input-field" type="number" step="0.1" min="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Masalan: 3.5" />
                </div>
                <button className="btn btn-primary btn-full" onClick={() => {
                  completeOrder(selectedOrder.id, parseFloat(weight));
                  setSelectedOrder(null);
                  setWeight('3.0');
                }}>
                  Vaznni tasdiqlash va coinlarni berish
                </button>
              </div>
            )}

            <button className="btn btn-ghost btn-full mt-4" onClick={() => setSelectedOrder(null)}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  );
}
