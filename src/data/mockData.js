// ── Pricing Config ────────────────────────────────────────────────────────────
export const DEFAULT_RATES = {
  plastic: 1200,   // UZS per kg
  paper:    800,
  glass:    500,
};

export const DEFAULT_BONUS_MULTIPLIER = 1.0;

export const MOCK_USERS = [
  { id: 'u1', name: 'Aziza Karimova',   phone: '+998901234567', address: 'Urgench, Al-Khwarizmi ko\'chasi, uy 5', balance: 4850,  totalKg: 38.5, pickups: 12, streak: 5, ecoScore: 850, referralCode: 'AZZ001', joined: '2024-11-01' },
  { id: 'u2', name: 'Bobur Toshmatov',  phone: '+998907654321', address: 'Urgench, Tinchlik shohko\'chasi, uy 3', balance: 2300,  totalKg: 19.0, pickups: 7,  streak: 2, ecoScore: 420, referralCode: 'BOB002', joined: '2024-11-15' },
  { id: 'u3', name: 'Dilnoza Yusupova', phone: '+998901112233', address: 'Urgench, Yoshlar Ko\'li ko\'chasi',  balance: 7200,  totalKg: 62.0, pickups: 21, streak: 8, ecoScore: 1250,referralCode: 'DIL003', joined: '2024-10-20' },
  { id: 'u4', name: 'Eldor Rakhimov',   phone: '+998904445566', address: 'Urgench, Jaloliddin Manguberdi ko\'chasi',      balance: 1100,  totalKg: 9.0,  pickups: 3,  streak: 0, ecoScore: 150, referralCode: 'ELD004', joined: '2024-12-01' },
  { id: 'u5', name: 'Feruza Nazarova',  phone: '+998902223344', address: 'Urgench, Sanoatchilar ko\'chasi',            balance: 9600,  totalKg: 81.5, pickups: 30, streak: 12,ecoScore: 1850,referralCode: 'FER005', joined: '2024-10-05' },
  { id: 'u6', name: 'Gulnara Saidova',  phone: '+998905556677', address: 'Urgench, Ma\'rifat ko\'chasi, uy 10',          balance: 3400,  totalKg: 28.0, pickups: 10, streak: 3, ecoScore: 680, referralCode: 'GUL006', joined: '2024-11-22' },
  { id: 'u7', name: 'Hamza Umarov',     phone: '+998906667788', address: 'Khiva, Ichan-Qal\'a ko\'chasi, uy 4',      balance: 600,   totalKg: 5.0,  pickups: 2,  streak: 0, ecoScore: 100, referralCode: 'HAM007', joined: '2024-12-10' },
  { id: 'u8', name: 'Iroda Xolmatova',  phone: '+998903334455', address: 'Urgench, Amir Temur ko\'chasi, uy 12',              balance: 5500,  totalKg: 46.0, pickups: 16, streak: 6, ecoScore: 920, referralCode: 'IRO008', joined: '2024-10-30' },
];

// ── Orders ────────────────────────────────────────────────────────────────────
export const MOCK_ORDERS = [
  { id: 'ORD-001', userId: 'u1', status: 'completed', wasteType: 'plastic', weight: 3.5, reward: 4200, address: 'Smart Bin – Al-Khwarizmi St', scheduledTime: '2025-03-17 10:00', completedTime: '2025-03-17 10:45', note: '' },
  { id: 'ORD-002', userId: 'u3', status: 'completed', wasteType: 'paper',   weight: 5.0, reward: 4000, address: "Recycling Hub – Yoshlar Ko'li",         scheduledTime: '2025-03-17 11:00', completedTime: '2025-03-17 11:40', note: '' },
  { id: 'ORD-003', userId: 'u5', status: 'pending',   wasteType: 'glass',   weight: 0,   reward: 0,    address: 'Eco-Collection Point – Khiva',       scheduledTime: '2025-03-18 09:00', completedTime: null,               note: 'Fragile, handle with care' },
  { id: 'ORD-004', userId: 'u2', status: 'pending',   wasteType: 'plastic', weight: 0,   reward: 0,    address: 'Plastic & Glass Hub – Urgench',  scheduledTime: '2025-03-18 14:00', completedTime: null,               note: '' },
  { id: 'ORD-005', userId: 'u8', status: 'completed', wasteType: 'plastic', weight: 7.2, reward: 8640, address: 'Smart Bin – Al-Khwarizmi St',         scheduledTime: '2025-03-16 09:00', completedTime: '2025-03-16 09:50', note: '' },
  { id: 'ORD-006', userId: 'u1', status: 'pending',   wasteType: 'paper',   weight: 0,   reward: 0,    address: "Recycling Hub – Yoshlar Ko'li",  scheduledTime: '2025-03-19 10:00', completedTime: null,               note: '' },
  { id: 'ORD-007', userId: 'u6', status: 'completed', wasteType: 'glass',   weight: 4.1, reward: 2050, address: 'Eco-Collection Point – Khiva',     scheduledTime: '2025-03-15 15:00', completedTime: '2025-03-15 15:55', note: '' },
  { id: 'ORD-008', userId: 'u4', status: 'pending',   wasteType: 'plastic', weight: 0,   reward: 0,    address: 'Plastic & Glass Hub – Urgench', scheduledTime: '2025-03-18 11:30', completedTime: null,               note: '' },
  { id: 'ORD-009', userId: 'u3', status: 'pending',   wasteType: 'paper',   weight: 0,   reward: 0,    address: "Recycling Hub – Yoshlar Ko'li",          scheduledTime: '2025-03-19 08:30', completedTime: null,               note: '' },
  { id: 'ORD-010', userId: 'u5', status: 'completed', wasteType: 'plastic', weight: 9.0, reward: 10800,address: 'Plastic & Glass Hub – Urgench',       scheduledTime: '2025-03-14 10:00', completedTime: '2025-03-14 10:55', note: '' },
];

// ── Transactions ──────────────────────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { id: 't1', userId: 'u1', type: 'earn',   amount: 4200,  description: 'Plastic pickup – ORD-001', date: '2025-03-17', icon: '♻️' },
  { id: 't2', userId: 'u1', type: 'earn',   amount: 500,   description: 'Referral bonus – Bobur T.', date: '2025-03-15', icon: '🎁' },
  { id: 't3', userId: 'u1', type: 'spend',  amount: -2000, description: 'Mobile top-up – +998901234567', date: '2025-03-12', icon: '📱' },
  { id: 't4', userId: 'u1', type: 'earn',   amount: 150,   description: '5-day streak bonus', date: '2025-03-10', icon: '🔥' },
  { id: 't5', userId: 'u1', type: 'spend',  amount: -1000, description: 'Utility payment – UzbekEnergo', date: '2025-03-08', icon: '💡' },
  { id: 't6', userId: 'u1', type: 'earn',   amount: 2400,  description: 'Paper pickup bonus', date: '2025-03-05', icon: '♻️' },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'success', title: 'Pickup Completed!',    body: 'Your plastic pickup was completed. +4,200 Bio-Coins credited.', time: '2h ago',  read: false },
  { id: 'n2', type: 'info',    title: 'Courier Assigned',     body: 'Jasur M. will pick up your waste at 10:00 AM today.',           time: '4h ago',  read: false },
  { id: 'n3', type: 'promo',   title: '🔥 Streak Bonus!',     body: 'Amazing! You\'re on a 5-day streak. Keep recycling!',           time: '1d ago',  read: true  },
  { id: 'n4', type: 'info',    title: 'New Rate Update',      body: 'Plastic rate increased to 1,200 UZS/kg. Earn more now!',        time: '2d ago',  read: true  },
  { id: 'n5', type: 'promo',   title: '🎁 Referral Reward',   body: 'Your friend Bobur joined! 500 Bio-Coins added to your wallet.', time: '3d ago',  read: true  },
];

// ── Analytics (Admin) ─────────────────────────────────────────────────────────
export const MONTHLY_DATA = [
  { month: 'Oct', orders: 42, kg: 210, users: 180, revenue: 1680000 },
  { month: 'Nov', orders: 68, kg: 340, users: 280, revenue: 2720000 },
  { month: 'Dec', orders: 95, kg: 475, users: 390, revenue: 3800000 },
  { month: 'Jan', orders: 120,kg: 600, users: 510, revenue: 4800000 },
  { month: 'Feb', orders: 158,kg: 790, users: 670, revenue: 6320000 },
  { month: 'Mar', orders: 201,kg: 1005,users: 820, revenue: 8040000 },
];

export const WASTE_BREAKDOWN = [
  { name: 'Plastic', value: 58, color: '#52B788' },
  { name: 'Paper',   value: 27, color: '#74C69D' },
  { name: 'Glass',   value: 15, color: '#95D5B2' },
];

export const MOCK_MAP_LOCATIONS = [
  { id: 'l1', type: 'green_zone', name: 'Jaloliddin Manguberdi Park', address: 'Al-Khwarizmi St, Urgench', lat: 41.5519, lng: 60.6312, reward: 25, description: 'Central recreation area in Urgench. Take a walk and earn Bio-Coins by checking in!', checkedIn: false },
  { id: 'l2', type: 'green_zone', name: 'Avesta Memorial Park', address: 'Avesta St, Urgench', lat: 41.5574, lng: 60.6305, reward: 20, description: 'Beautiful green park surrounding the historical Avesta Museum monument.', checkedIn: false },
  { id: 'l3', type: 'recycling',  name: 'Smart Bin – Al-Khwarizmi St', address: 'Al-Khwarizmi St, Urgench', lat: 41.5543, lng: 60.6225, reward: 15, description: 'Automated smart bin for plastic and paper disposal.', checkedIn: false },
  { id: 'l4', type: 'recycling',  name: 'Recycling Hub – Yoshlar Ko\'li', address: 'Tinchlik Ave, Urgench', lat: 41.5398, lng: 60.6321, reward: 30, description: 'Full-service recycling center accepting plastic, glass, and paper.', checkedIn: false },
  { id: 'l5', type: 'green_zone', name: 'Youth Lake Park (Yoshlar Ko\'li)', address: 'Yoshlar Ko\'li Park, Urgench', lat: 41.5412, lng: 60.6278, reward: 35, description: 'Spacious park with a large lake and walking paths. Help keep our recreation areas clean.', checkedIn: false },
  { id: 'l6', type: 'recycling',  name: 'Eco-Collection Point – Khiva', address: 'North Gate (Bogcha Darvoza), Khiva', lat: 41.3812, lng: 60.3612, reward: 25, description: 'Community-driven collection point at the entrance of Ichan-Kala.', checkedIn: false },
  { id: 'l7', type: 'green_zone', name: 'Ichan-Kala Green Belt', address: 'Ichan-Kala Outer Wall, Khiva', lat: 41.3783, lng: 60.3639, reward: 40, description: 'Green garden belt surrounding the walls of the ancient city of Khiva.', checkedIn: false },
  { id: 'l8', type: 'recycling',  name: 'Plastic & Glass Hub – Urgench', address: 'Industrial District, Urgench', lat: 41.5621, lng: 60.6482, reward: 15, description: 'Specialized recycling hub focusing on plastic sorting and glass crushing.', checkedIn: false },
];
