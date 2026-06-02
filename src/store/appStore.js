import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_USERS, MOCK_ORDERS,
  MOCK_TRANSACTIONS, MOCK_NOTIFICATIONS,
  MOCK_MAP_LOCATIONS,
  DEFAULT_RATES, DEFAULT_BONUS_MULTIPLIER,
} from '../data/mockData';

// ── Reward Engine ─────────────────────────────────────────────────────────────
export function calcReward(weightKg, wasteType, rates, multiplier = 1.0, isFirstTime = false, streak = 0) {
  const base = weightKg * (rates[wasteType] ?? 0);
  let bonusMult = multiplier;
  if (isFirstTime) bonusMult += 0.5;
  if (streak >= 7)  bonusMult += 0.3;
  else if (streak >= 3) bonusMult += 0.15;
  return Math.round(base * bonusMult);
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Auth ───────────────────────────────────────────────────────────────
      currentUser: null,
      isAdminLoggedIn: false,
      theme: 'light',
      accessibility: {
        largeText: false,
        highContrast: false,
        dyslexicFont: false,
        textToSpeech: false,
      },
      toggleTheme() {
        set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' }));
      },
      updateAccessibility(key, val) {
        set(s => ({
          accessibility: { ...s.accessibility, [key]: val }
        }));
      },

      loginUser(phone, name = 'New User', address = '') {
        const found = get().users.find(u => u.phone === phone);
        if (found) { set({ currentUser: found }); return true; }
        // Create new user
        const newUser = {
          id: `u${Date.now()}`, name, phone,
          address, balance: 0, totalKg: 0, pickups: 0,
          streak: 0, ecoScore: 0, referralCode: `USR${Date.now().toString().slice(-4)}`,
          joined: new Date().toISOString().slice(0, 10), isNew: true,
        };
        set(s => ({ users: [...s.users, newUser], currentUser: newUser }));
        return true;
      },
      logoutUser() { set({ currentUser: null }); },


      loginAdmin(password) {
        const trimmed = (password || '').trim();
        if (trimmed === 'admin123') { set({ isAdminLoggedIn: true }); return true; }
        return false;
      },
      logoutAdmin() { set({ isAdminLoggedIn: false }); },

      // ── Data ───────────────────────────────────────────────────────────────
      users: MOCK_USERS,
      orders: MOCK_ORDERS,
      transactions: MOCK_TRANSACTIONS,
      notifications: MOCK_NOTIFICATIONS,
      mapLocations: MOCK_MAP_LOCATIONS,
      rates: DEFAULT_RATES,
      bonusMultiplier: DEFAULT_BONUS_MULTIPLIER,

      // ── Orders ─────────────────────────────────────────────────────────────
      createOrder(userId, wasteType, address, scheduledTime, note = '') {
        const newOrder = {
          id: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          userId,
          status: 'pending', wasteType, weight: 0, reward: 0,
          address, scheduledTime, completedTime: null, note,
        };
        set(s => ({ orders: [newOrder, ...s.orders] }));
        return newOrder;
      },

      completeOrder(orderId, weightKg) {
        const { orders, users, rates, bonusMultiplier, transactions } = get();
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        const user = users.find(u => u.id === order.userId);
        const isFirstTime = user?.pickups === 0;
        const reward = calcReward(weightKg, order.wasteType, rates, bonusMultiplier, isFirstTime, user?.streak ?? 0);

        const updatedOrders = orders.map(o =>
          o.id === orderId
            ? { ...o, status: 'completed', weight: weightKg, reward, completedTime: new Date().toISOString() }
            : o
        );
        const updatedUsers = users.map(u =>
          u.id === order.userId
            ? { ...u, balance: u.balance + reward, totalKg: u.totalKg + weightKg, pickups: u.pickups + 1 }
            : u
        );
        const newTx = {
          id: `t${Date.now()}`, userId: order.userId, type: 'earn',
          amount: reward,
          description: `${order.wasteType.charAt(0).toUpperCase() + order.wasteType.slice(1)} pickup – ${orderId}`,
          date: new Date().toISOString().slice(0, 10), icon: '♻️',
        };
        set({ orders: updatedOrders, users: updatedUsers, transactions: [newTx, ...transactions] });
        // Sync currentUser if it's the same user
        const updated = updatedUsers.find(u => u.id === order.userId);
        if (get().currentUser?.id === order.userId) set({ currentUser: updated });
        return reward;
      },

      // ── Wallet ─────────────────────────────────────────────────────────────
      redeemCoins(userId, amount, description) {
        const { users, transactions } = get();
        const user = users.find(u => u.id === userId);
        if (!user || user.balance < amount) return false;
        const updatedUsers = users.map(u =>
          u.id === userId ? { ...u, balance: u.balance - amount } : u
        );
        const newTx = {
          id: `t${Date.now()}`, userId, type: 'spend',
          amount: -amount, description,
          date: new Date().toISOString().slice(0, 10), icon: '💳',
        };
        set({ users: updatedUsers, transactions: [newTx, ...transactions] });
        if (get().currentUser?.id === userId) {
          set({ currentUser: updatedUsers.find(u => u.id === userId) });
        }
        return true;
      },

      // ── Pricing ────────────────────────────────────────────────────────────
      updateRates(newRates) { set({ rates: { ...get().rates, ...newRates } }); },
      updateBonusMultiplier(v) { set({ bonusMultiplier: v }); },

      // ── Notifications ──────────────────────────────────────────────────────
      markAllRead() {
        set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
      },
      addNotification(note) {
        set(s => ({ notifications: [note, ...s.notifications] }));
      },


      
      // ── Eco Map ────────────────────────────────────────────────────────────
      checkIn(locationId) {
        const { mapLocations, currentUser, users, transactions } = get();
        if (!currentUser) return false;
        
        const loc = mapLocations.find(l => l.id === locationId);
        if (!loc || loc.checkedIn) return false;
        
        const updatedLocations = mapLocations.map(l => 
          l.id === locationId ? { ...l, checkedIn: true } : l
        );
        
        const reward = loc.reward;
        const updatedUsers = users.map(u => 
          u.id === currentUser.id 
            ? { ...u, balance: u.balance + reward, ecoScore: (u.ecoScore ?? 0) + (reward * 2) } 
            : u
        );
        
        const newTx = {
          id: `t${Date.now()}`, userId: currentUser.id, type: 'earn',
          amount: reward,
          description: `Check-in: ${loc.name}`,
          date: new Date().toISOString().slice(0, 10), icon: '📍',
        };
        
        const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
        
        set({ 
          mapLocations: updatedLocations, 
          users: updatedUsers, 
          currentUser: updatedUser,
          transactions: [newTx, ...transactions] 
        });
        
        return true;
      },
    }),
    {
      name: 'biocycle-store-v4',
      partialize: (s) => ({
        currentUser: s.currentUser,
        users: s.users,
        orders: s.orders,
        transactions: s.transactions,
        notifications: s.notifications,
        mapLocations: s.mapLocations,
        rates: s.rates,
        bonusMultiplier: s.bonusMultiplier,
        theme: s.theme,
        accessibility: s.accessibility,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState || {}),
      }),
    }
  )
);
