import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { AuthMode } from '../types/auth';

interface FooterProps {
  onOpenAuth: (mode: AuthMode) => void;
  isLoggedIn: boolean;
  onEnterSurprise?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAuth, isLoggedIn, onEnterSurprise }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">NEXUS PRIME</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Kelajak innovatsion ekotizimi: real vaqtli xavfsiz autentifikatsiya va eksklyuziv surpriz portali.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Toshkent, O'zbekiston · 2026
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3">Bo'limlar</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Xususiyatlar</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Imkoniyatlar</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Tariflar</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Mijozlar Fikri</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Savol-Javob</a></li>
            </ul>
          </div>

          {/* Auth links */}
          <div>
            <h4 className="font-bold text-white mb-3">Kirish va Xizmatlar</h4>
            <ul className="space-y-2">
              {isLoggedIn ? (
                <>
                  <li>
                    <button
                      onClick={onEnterSurprise}
                      className="text-amber-400 hover:text-amber-300 font-semibold text-left"
                    >
                      Surpriz Xonasi ✨
                    </button>
                  </li>
                  <li><span className="text-emerald-400">Tizimga kirilgan</span></li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Tizimga kirish
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Ro'yxatdan o'tish
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onOpenAuth('forgot')}
                      className="hover:text-white transition-colors text-left"
                    >
                      Parolni tiklash (OTP)
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Status info */}
          <div>
            <h4 className="font-bold text-white mb-3">Tizim Holati</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-medium">Barcha tizimlar faol</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Serverlar va autentifikatsiya shlyuzlari 100% normal ishlamoqda.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
          <div>
            © 2026 Nexus Prime Inc. Barcha huquqlar himoyalangan.
          </div>
          <div className="flex items-center gap-1">
            <span>Yurakdan yaratildi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>O'zbekistonda</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
