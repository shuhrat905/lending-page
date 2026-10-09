import React, { useState, useEffect } from 'react';
import { AuthMode, User } from '../types/auth';
import {
  loginUser,
  registerUser,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  finalizePasswordReset,
} from '../services/authService';
import { playSuccessChime } from '../utils/audio';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'otp', title: string, message: string, otpCode?: string) => void;
  pendingOtpCode?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
  onShowToast,
  pendingOtpCode,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (pendingOtpCode && mode === 'reset-code') {
      setOtpCode(pendingOtpCode);
    }
  }, [pendingOtpCode, mode]);

  if (!isOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleQuickDemoFill = (type: 'shuhrat' | 'ali') => {
    if (type === 'shuhrat') {
      setEmail('shuhratmadaminov509@gmail.com');
      setPassword('parol123');
    } else {
      setEmail('ali@nexus.uz');
      setPassword('demo12345');
    }
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = loginUser(email, password);
      setLoading(false);
      if (res.success && res.user) {
        playSuccessChime();
        onShowToast('success', 'Xush kelibsiz!', `${res.user.name}, siz tizimga muvaffaqiyatli kirdingiz.`);
        onSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Kirishda xatolik yuz berdi.');
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Parollar bir-biriga mos kelmadi.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Iltimos, foydalanish shartlariga rozilik bildiring.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerUser(name, email, phone, password);
      setLoading(false);
      if (res.success && res.user) {
        playSuccessChime();
        onShowToast(
          'success',
          'Tabriklaymiz!',
          `Hisobingiz ochildi! Shaxsiy VIP kartangiz tayyor va surpriz xonasi kutmoqda.`
        );
        onSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Ro\'yxatdan o\'tishda xatolik.');
      }
    }, 450);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const res = sendPasswordResetOtp(email);
      setLoading(false);
      if (res.success && res.code) {
        onShowToast(
          'otp',
          'SMS / Email orqali tasdiqlash kodi',
          `${email} manziliga 6 xonali tasdiqlash kodi yuborildi. Quyidagi kodni kiriting:`,
          res.code
        );
        setOtpCode(res.code);
        setMode('reset-code');
      } else {
        setErrorMessage(res.error || 'Kodni yuborishda xatolik.');
      }
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = verifyPasswordResetOtp(email, otpCode);
    if (res.success) {
      setMode('reset-new-password');
      onShowToast('info', 'Kod tasdiqlandi', 'Endi yangi parolingizni belgilashingiz mumkin.');
    } else {
      setErrorMessage(res.error || 'Kiritilgan kod noto\'g\'ri.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Yangi parollar mos kelmadi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = finalizePasswordReset(email, otpCode, password);
      setLoading(false);
      if (res.success && res.user) {
        playSuccessChime();
        onShowToast('success', 'Parol yangilandi', 'Yangi parol bilan tizimga kirdingiz!');
        onSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Parolni yangilashda xatolik.');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Yopish"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3">
            {mode === 'login' && <ShieldCheck className="w-6 h-6" />}
            {mode === 'register' && <Sparkles className="w-6 h-6" />}
            {(mode === 'forgot' || mode === 'reset-code' || mode === 'reset-new-password') && (
              <KeyRound className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' && 'Tizimga kirish'}
            {mode === 'register' && 'Ro\'yxatdan o\'tish'}
            {mode === 'forgot' && 'Parolni tiklash'}
            {mode === 'reset-code' && 'Kodni tasdiqlash'}
            {mode === 'reset-new-password' && 'Yangi parol yaratish'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Nexus Prime ekotizimiga kirish va surprizni kashf etish'}
            {mode === 'register' && 'Bir necha soniyada bepul a\'zo bo\'ling va VIP bonusni oling'}
            {mode === 'forgot' && 'Elektron pochtangizni kiriting, tasdiqlash kodini yuboramiz'}
            {mode === 'reset-code' && 'Pochtaga yuborilgan 6 xonali maxfiy kodni kiriting'}
            {mode === 'reset-new-password' && 'Xavfsiz yangi parol o\'ylab toping'}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email manzil</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@nexus.uz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Parol</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                Meni eslab qol
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Kirish va Surprizni ochish
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-3 border-t border-slate-800/80">
              <span className="block text-[11px] text-slate-400 text-center mb-2">
                Tezkor sinash uchun namunaviy hisoblar:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('shuhrat')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Shuhrat (Founder)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('ali')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Ali (VIP Demo)
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Hisobingiz yo'qmi? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                Ro'yxatdan o'ting
              </button>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">To'liq ism-sharif</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ali Valiyev"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email manzil</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ali@nexus.uz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Telefon raqam</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 belgi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full transition-all ${
                        strength <= 1 ? 'w-1/3 bg-rose-500' : strength <= 2 ? 'w-2/3 bg-amber-500' : 'w-full bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {strength <= 1 ? 'Oddiy' : strength <= 2 ? 'Yaxshi' : 'Kuchli parol'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Parolni tasdiqlang</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolni qayta kiriting"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <span>
                  Foydalanish shartlari va maxfiylik siyosatiga roziman.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Ro'yxatdan o'tish & Sovg'ani olish
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Allaqachon hisobingiz bormi? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
              >
                Tizimga kirish
              </button>
            </div>
          </form>
        )}

        {/* MODE: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ro'yxatdan o'tgan email manzilingiz
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="masalan: shuhratmadaminov509@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Biz ushbu manzilga darhol 6 xonali tasdiqlash kodini yuboramiz. Siz uni ekranda darhol ko'rishingiz va nusxalashingiz mumkin.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Tasdiqlash kodini yuborish
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Orqaga qaytish (Kirish)
              </button>
            </div>
          </form>
        )}

        {/* MODE: RESET CODE (OTP) */}
        {mode === 'reset-code' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">6 xonali tasdiqlash kodi</label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Qayta yuborish
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] font-mono text-xl bg-slate-950 border border-slate-800 rounded-xl py-3 text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <p className="text-xs text-slate-400 text-center">
              Kod <span className="text-white font-medium">{email}</span> manziliga jo'natildi.
            </p>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              Kodni tasdiqlash
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Boshqa email kiritish
              </button>
            </div>
          </form>
        )}

        {/* MODE: RESET NEW PASSWORD */}
        {mode === 'reset-new-password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Yangi parol</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Yangi parolni tasdiqlang</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolni qayta tering"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Parolni yangilash & Tizimga kirish
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
