import { User } from '../types/auth';

const STORAGE_USERS_KEY = 'nexus_users_db_v1';
const STORAGE_CURRENT_USER_KEY = 'nexus_auth_user_v1';
const STORAGE_RESET_OTP_KEY = 'nexus_pending_reset_otp';

interface StoredAccount extends User {
  passwordHash: string; // Stored securely in client storage
}

const INITIAL_USERS: StoredAccount[] = [
  {
    id: 'usr_shuhrat',
    name: 'Shuhrat Madaminov',
    email: 'shuhratmadaminov509@gmail.com',
    phone: '+998 90 123 45 67',
    createdAt: '2026-03-01T10:00:00Z',
    role: 'founder',
    surpriseOpened: false,
    coins: 500,
    vipCardId: 'NX-2026-GOLD-001',
    passwordHash: 'parol123',
  },
  {
    id: 'usr_demo',
    name: 'Ali Valiyev',
    email: 'ali@nexus.uz',
    phone: '+998 91 987 65 43',
    createdAt: '2026-03-15T12:30:00Z',
    role: 'vip',
    surpriseOpened: false,
    coins: 250,
    vipCardId: 'NX-2026-VIP-742',
    passwordHash: 'demo12345',
  },
];

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return parsed;
  } catch {
    return INITIAL_USERS;
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to localStorage', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    } else {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to update current user session', e);
  }
}

export function loginUser(emailInput: string, passwordInput: string): { success: boolean; user?: User; error?: string } {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email) {
    return { success: false, error: 'Email manzilingizni kiriting.' };
  }
  if (!password) {
    return { success: false, error: 'Parolni kiriting.' };
  }

  const accounts = getStoredAccounts();
  const match = accounts.find((acc) => acc.email.toLowerCase() === email);

  if (!match) {
    return { success: false, error: 'Bunday email bilan foydalanuvchi topilmadi. Iltimos, ro\'yxatdan o\'ting.' };
  }

  if (match.passwordHash !== password) {
    return { success: false, error: 'Parol noto\'g\'ri kiritildi. Iltimos, qayta tekshiring.' };
  }

  // Strip password hash before saving session
  const { passwordHash, ...cleanUser } = match;
  setCurrentUser(cleanUser);
  return { success: true, user: cleanUser };
}

export function registerUser(nameInput: string, emailInput: string, phoneInput: string, passwordInput: string): {
  success: boolean;
  user?: User;
  error?: string;
} {
  const name = nameInput.trim();
  const email = emailInput.trim().toLowerCase();
  const phone = phoneInput.trim();
  const password = passwordInput.trim();

  if (!name || name.length < 2) {
    return { success: false, error: 'Iltimos, to\'liq ism-sharifingizni kiriting.' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'To\'g\'ri email manzilini kiriting (masalan: foydalanuvchi@mail.uz).' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak.' };
  }

  const accounts = getStoredAccounts();
  const exists = accounts.some((acc) => acc.email.toLowerCase() === email);
  if (exists) {
    return { success: false, error: 'Ushbu email bilan ro\'yxatdan o\'tilgan. Kirish bo\'limiga o\'ting.' };
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newAccount: StoredAccount = {
    id: `usr_${Date.now()}`,
    name,
    email,
    phone: phone || '+998 90 000 00 00',
    createdAt: new Date().toISOString(),
    role: 'vip',
    surpriseOpened: false,
    coins: 300,
    vipCardId: `NX-2026-${randomNum}`,
    passwordHash: password,
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);

  const { passwordHash, ...cleanUser } = newAccount;
  setCurrentUser(cleanUser);
  return { success: true, user: cleanUser };
}

export function sendPasswordResetOtp(emailInput: string): { success: boolean; code?: string; error?: string } {
  const email = emailInput.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Haqiqiy email manzilini kiriting.' };
  }

  const accounts = getStoredAccounts();
  const user = accounts.find((acc) => acc.email.toLowerCase() === email);
  if (!user) {
    return { success: false, error: 'Ushbu email tizimda ro\'yxatdan o\'tmagan.' };
  }

  // Generate 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const payload = {
    email,
    code,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_RESET_OTP_KEY, JSON.stringify(payload));

  return { success: true, code };
}

export function verifyPasswordResetOtp(emailInput: string, codeInput: string): { success: boolean; error?: string } {
  const email = emailInput.trim().toLowerCase();
  const code = codeInput.trim();

  try {
    const raw = localStorage.getItem(STORAGE_RESET_OTP_KEY);
    if (!raw) {
      return { success: false, error: 'Tasdiqlash kodi topilmadi yoki muddati tugagan. Qayta yuboring.' };
    }
    const payload = JSON.parse(raw);
    if (payload.email !== email || payload.code !== code) {
      return { success: false, error: 'Kiritilgan tasdiqlash kodi noto\'g\'ri.' };
    }
    // Valid for 15 minutes
    if (Date.now() - payload.timestamp > 15 * 60 * 1000) {
      return { success: false, error: 'Tasdiqlash kodining amal qilish muddati o\'tib ketgan.' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Kodni tekshirishda xatolik yuz berdi.' };
  }
}

export function finalizePasswordReset(emailInput: string, codeInput: string, newPasswordInput: string): {
  success: boolean;
  user?: User;
  error?: string;
} {
  const verification = verifyPasswordResetOtp(emailInput, codeInput);
  if (!verification.success) {
    return { success: false, error: verification.error };
  }

  const password = newPasswordInput.trim();
  if (password.length < 6) {
    return { success: false, error: 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi shart.' };
  }

  const accounts = getStoredAccounts();
  const email = emailInput.trim().toLowerCase();
  const accountIndex = accounts.findIndex((acc) => acc.email.toLowerCase() === email);

  if (accountIndex === -1) {
    return { success: false, error: 'Foydalanuvchi hisobi topilmadi.' };
  }

  accounts[accountIndex].passwordHash = password;
  saveStoredAccounts(accounts);
  localStorage.removeItem(STORAGE_RESET_OTP_KEY);

  const { passwordHash, ...cleanUser } = accounts[accountIndex];
  setCurrentUser(cleanUser);
  return { success: true, user: cleanUser };
}

export function updateUserProfile(updates: Partial<User>): User | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: User = { ...current, ...updates };
  setCurrentUser(updated);

  const accounts = getStoredAccounts();
  const idx = accounts.findIndex((a) => a.id === current.id);
  if (idx !== -1) {
    accounts[idx] = { ...accounts[idx], ...updates };
    saveStoredAccounts(accounts);
  }

  return updated;
}

export function logoutUser() {
  setCurrentUser(null);
}
