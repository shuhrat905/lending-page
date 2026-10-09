import React, { useState } from 'react';
import { AuthMode } from '../types/auth';
import {
  ArrowRight,
  Shield,
  Sparkles,
  Zap,
  Gift,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
  Lock,
} from 'lucide-react';

interface HeroProps {
  onOpenAuth: (mode: AuthMode) => void;
  onEnterSurprise?: () => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuth, onEnterSurprise, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'security' | 'surprise'>('surprise');

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Zero-Pill Metadata Header (Clean unboxed text with typographic separators) */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 mb-6 tracking-wide">
            <span>YANGI AVLOD PLATFORMASI 2026</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-emerald-400">REAL VAQT REJIMI</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400">MAXSUS VIP SURPRIZ</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Barcha imkoniyatlar bir joyda: <br className="hidden sm:inline" />
            <span className="shimmer-text">Tezkor, Ishonchli & Innovatsion</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Zamonaviy boshqaruv va xavfsiz tizim ekotizimiga xush kelibsiz. 
            Ro'yxatdan o'ting yoki tizimga kiring — ichkarida sizni eksklyuziv surprizlar to'plami kutmoqda!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            {isLoggedIn ? (
              <button
                onClick={onEnterSurprise}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Gift className="w-4 h-4" />
                Surpriz Xonasiga O'tish
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Ro'yxatdan o'tish & Sovg'ani olish
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  Tizimga kirish
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </>
            )}
          </div>

          {/* Unboxed Metadata Stats with typographic bullet separators */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-800/60 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">99.99%</span>
              <span>Barqarorlik</span>
            </div>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">50,000+</span>
              <span>Faol a'zo</span>
            </div>
            <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400 text-base">&lt; 15 ms</span>
              <span>Javob tezligi</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Terminal / Dashboard Card */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Window Header */}
          <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-400">nexus-live-console.v2</span>
            </div>

            {/* Segmented Interactive Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('surprise')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'surprise' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎁 Surpriz Preview
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'security' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                🛡️ Xavfsizlik
              </button>
              <button
                onClick={() => setActiveTab('cloud')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'cloud' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Server Quvvati
              </button>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 font-sans">
            {activeTab === 'surprise' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                    <Gift className="w-4 h-4" />
                    Kutib Olish Sovg'asi
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Har bir yangi ro'yxatdan o'tgan foydalanuvchiga interaktiv 3D sovg'a qutisi taqdim etiladi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
                    <Sparkles className="w-4 h-4" />
                    Omad Charxpalagi
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    100% kafolatlangan yutuqli g'ildirak orqali 1,000,000 UZS gacha bo'lgan mukofotlar.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Shaxsiy VIP Karta
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ism-sharifingiz va unikal ID raqamingiz tushirilgan 3D holografik sertifikat.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-2 text-xs font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-emerald-400 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> [256-bit AES Shifrlash] - Ma'lumotlar to'liq himoyalangan
                </div>
                <div className="text-slate-400">
                  &gt; Haqiqiy vaqtli parolni tiklash (6 xonali OTP avtomatik tekshiruv)
                </div>
                <div className="text-slate-400">
                  &gt; Sessiyalarni boshqarish: Shaxsiy qurilmada xavfsiz saqlash faol
                </div>
                <div className="text-indigo-400">
                  &gt; STATUS: Xavfsizlik darajasi: A+ (Ekspert baholash)
                </div>
              </div>
            )}

            {activeTab === 'cloud' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="font-mono text-lg font-bold text-white">0.02%</div>
                  <div className="text-[10px] text-slate-400">Xatolik nisbati</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <div className="font-mono text-lg font-bold text-white">8.4 ms</div>
                  <div className="text-[10px] text-slate-400">Server Ping</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Cpu className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <div className="font-mono text-lg font-bold text-white">99.99%</div>
                  <div className="text-[10px] text-slate-400">Ishlash kafolati</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <Shield className="w-4 h-4 text-fuchsia-400 mx-auto mb-1" />
                  <div className="font-mono text-lg font-bold text-white">100%</div>
                  <div className="text-[10px] text-slate-400">Avtomatlashtirish</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
