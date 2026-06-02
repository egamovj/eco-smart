import { useAppStore } from '../../../store/appStore';

const TYPE_ICON = { success: '✅', info: 'ℹ️', promo: '🎁', warning: '⚠️' };

export default function Notifications() {
  const { notifications, markAllRead, currentUser } = useAppStore();
  const myNotifs = notifications.filter(n => !n.userId || n.userId === currentUser?.id);
  const unread = myNotifs.filter(n => !n.read).length;

  return (
    <div style={{ padding: '0 1rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0 1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Bildirishnomalar</h2>
          {unread > 0 && <p className="text-secondary text-sm mt-1">{unread} ta o'qilmagan</p>}
        </div>
        {unread > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={markAllRead}>Barchasini o'qildi deb belgilash</button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '.75rem' }}>🔔</p>
          <p style={{ fontWeight: 600 }}>Bildirishnomalar yo'q</p>
          <p className="text-secondary text-sm mt-1">Yangilanishlar bu yerda ko'rsatiladi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
          {myNotifs.map(n => (
            <div key={n.id} className="card animate-slide-up"
              style={{ display: 'flex', gap: '.85rem', alignItems: 'flex-start', padding: '1rem', background: n.read ? 'var(--c-white)' : 'var(--c-green-50)', borderLeft: `3px solid ${n.read ? 'transparent' : 'var(--c-green-500)'}` }}>
              <span style={{ fontSize: '1.35rem', flexShrink: 0 }}>{TYPE_ICON[n.type] ?? '🔔'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: n.read ? 500 : 700, fontSize: '.875rem' }}>{n.title}</p>
                <p className="text-secondary text-sm mt-1">{n.message}</p>
                <p className="text-muted" style={{ fontSize: '.72rem', marginTop: 4 }}>{n.time}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-green-500)', flexShrink: 0, marginTop: 4 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
