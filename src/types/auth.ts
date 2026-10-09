export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  role: 'member' | 'vip' | 'founder';
  avatar?: string;
  surpriseOpened: boolean;
  wonPrize?: string;
  coins: number;
  vipCardId: string;
}

export type AuthMode = 'login' | 'register' | 'forgot' | 'reset-code' | 'reset-new-password';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'otp';
  title: string;
  message: string;
  otpCode?: string;
}
