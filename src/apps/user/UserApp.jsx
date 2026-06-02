import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import Splash from './pages/Splash';
import Auth from './pages/Auth';
import Home from './pages/Home';
import PickupRequest from './pages/PickupRequest';
import Wallet from './pages/Wallet';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import EcoMap from './pages/EcoMap';
import AccessibilityWidget from './pages/AccessibilityWidget';
import { Home as HomeIcon, PlusCircle, Wallet as WalletIcon, Gift, User, Map } from 'lucide-react';
import { useState, useEffect } from 'react';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  const tabs = [
    { path: '/',        icon: HomeIcon,   label: 'Asosiy' },
    { path: '/map',     icon: Map,        label: 'Xarita' },
    { path: '/pickup',  icon: PlusCircle, label: "Topshirish" },
    { path: '/wallet',  icon: WalletIcon, label: 'Hamyon' },
    { path: '/rewards', icon: Gift,        label: 'Mukofot' },
    { path: '/profile', icon: User,        label: 'Profil' },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button key={path} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => navigate(path)}>
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function UserApp() {
  const { currentUser, theme, accessibility } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(t);
  }, []);

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

  if (showSplash) return <div className="mobile-shell"><Splash /></div>;

  if (!currentUser) return (
    <div className="mobile-shell">
      <Routes><Route path="/*" element={<Auth />} /></Routes>
      <AccessibilityWidget />
    </div>
  );

  return (
    <div className="mobile-shell">
      <div className="page-content">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/pickup"        element={<PickupRequest />} />
          <Route path="/wallet"        element={<Wallet />} />
          <Route path="/rewards"       element={<Rewards />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/map"           element={<EcoMap />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
      <AccessibilityWidget />
    </div>
  );
}
