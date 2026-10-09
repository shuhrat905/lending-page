import React, { useState } from 'react';
import { User, AuthMode } from '../types/auth';
import { Sparkles, ArrowRight, LogIn, UserPlus, Menu, X, Gift, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onOpenAuth: (mode: AuthMode) => void;
  onEnterSurprise: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onEnterSurprise,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/75 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
              NEXUS <span className="text-indigo-400">PRIME</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider block">
              INNOVATION ECOSYSTEM
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links (Zero-pill, clean typographic links) */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">
            Xususiyatlar
          </a>
          <a href="#showcase" className="hover:text-white transition-colors">
            Imkoniyatlar
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Tariflar
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors">
            Mijozlar
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            Savol-Javob
          </a>
        </div>

        {/* Right CTA / User controls */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={onEnterSurprise}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <Gift className="w-4 h-4" />
                  Surpriz Xonasi ✨
                </button>

                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:border-slate-700 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[11px] text-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs text-slate-200 z-50">
                  <div className="px-4 py-2 border-b border-slate-800 text-[11px]">
                    <span className="text-slate-400 block">Hisob:</span>
                    <span className="font-medium text-white truncate block">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onEnterSurprise();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    Surpriz va Mukofotlar
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-300 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Kirish
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Ro'yxatdan o'tish
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <button
              onClick={onEnterSurprise}
              className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Gift className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 text-sm">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Xususiyatlar
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Imkoniyatlar
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Tariflar
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Mijozlar
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Savol-Javob
          </a>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onEnterSurprise();
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-slate-950 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  Surpriz Xonasi ({user.name})
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 rounded-xl text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20"
                >
                  Chiqish
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200"
                >
                  Kirish
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
                >
                  Ro'yxatdan o'tish
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
