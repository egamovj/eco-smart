import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Pricing from './pages/Pricing';
import Analytics from './pages/Analytics';
import AccessibilityWidget from '../user/pages/AccessibilityWidget';
import { LayoutDashboard, Users as UsersIcon, ClipboardList, Tag, BarChart3, LogOut, Leaf } from 'lucide-react';
import { useEffect } from 'react';


const NAV_ITEMS = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Boshqaruv paneli' },
  { path: '/admin/users',     icon: UsersIcon,       label: 'Foydalanuvchilar' },
  { path: '/admin/orders',    icon: ClipboardList,   label: 'Topshirishlar' },
  { path: '/admin/pricing',   icon: Tag,             label: 'Narxlar' },
  { path: '/admin/analytics', icon: BarChart3,       label: 'Tahlil' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutAdmin } = useAppStore();

  return (
    <aside className="admin-sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', padding: '.5rem .5rem 2rem', borderBottom: '1px solid rgba(255,255,255,.1)', marginBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: '.95rem', lineHeight: 1.2 }}>Green Khorezm</p>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.7rem' }}>Admin Panel</p>
        </div>
      </div>

      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname.startsWith(path);
        return (
          <div key={path} className={`admin-nav-item ${isActive ? 'active' : ''}`} onClick={() => navigate(path)}>
            <Icon size={18} />
            <span>{label}</span>
          </div>
        );
      })}

      <div style={{ flex: 1 }} />

      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1rem', marginTop: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.68rem', fontWeight: 600, marginBottom: '.5rem', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Tez havolalar</p>
        <a href="/"       className="admin-nav-item" style={{ display: 'flex' }}><Leaf size={16} /><span>Foydalanuvchi ilovasi</span></a>
        <div className="admin-nav-item" onClick={logoutAdmin} style={{ color: '#FC8181' }}><LogOut size={16} /><span>Chiqish</span></div>
      </div>
    </aside>
  );
}

export default function AdminApp() {
  const { isAdminLoggedIn, theme, accessibility } = useAppStore();

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Apply accessibility classes
    if (accessibility?.largeText) {
      document.body.classList.add('accessibility-large-text');
    } else {
      document.body.classList.remove('accessibility-large-text');
    }

    if (accessibility?.highContrast) {
      document.body.classList.add('accessibility-high-contrast');
    } else {
      document.body.classList.remove('accessibility-high-contrast');
    }

    if (accessibility?.dyslexicFont) {
      document.body.classList.add('accessibility-dyslexic-font');
    } else {
      document.body.classList.remove('accessibility-dyslexic-font');
    }
  }, [theme, accessibility]);

  if (!isAdminLoggedIn) return <Routes><Route path="*" element={<AdminLogin />} /></Routes>;
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Routes>
          <Route index              element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="users"       element={<Users />} />
          <Route path="orders"      element={<Orders />} />
          <Route path="pricing"     element={<Pricing />} />
          <Route path="analytics"   element={<Analytics />} />
          <Route path="*"           element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
      <AccessibilityWidget />
    </div>
  );
}
