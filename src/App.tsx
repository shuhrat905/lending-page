/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, AuthMode, ToastMessage } from './types/auth';
import { getCurrentUser, logoutUser } from './services/authService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SurprisePortal } from './components/SurprisePortal';
import { ToastContainer } from './components/Toast';
import { ArrowLeft, Gift } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');
  const [viewMode, setViewMode] = useState<'landing' | 'surprise'>('landing');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pendingOtpCode, setPendingOtpCode] = useState<string | undefined>(undefined);

  // Initialize stored session on load
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const showToast = (
    type: 'success' | 'error' | 'info' | 'otp',
    title: string,
    message: string,
    otpCode?: string
  ) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message, otpCode };
    setToasts((prev) => [...prev, newToast]);

    if (otpCode) {
      setPendingOtpCode(otpCode);
    }

    // Auto-dismiss after 7 seconds (longer for OTP so user has time to read/copy)
    setTimeout(() => {
      dismissToast(id);
    }, otpCode ? 12000 : 6000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAuth = (mode: AuthMode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    // Immediately enter the surprise zone upon authenticating!
    setViewMode('surprise');
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setViewMode('landing');
  };

  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        onUseOtp={(code) => {
          setPendingOtpCode(code);
          showToast('info', 'Kod tayyor', 'Tasdiqlash kodi kiritish maydoniga uzatildi.');
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onShowToast={showToast}
        pendingOtpCode={pendingOtpCode}
      />

      {/* VIEW: SURPRISE PORTAL (when user is inside) */}
      {viewMode === 'surprise' && currentUser ? (
        <div className="flex-1 flex flex-col">
          {/* Top navigation back to Landing */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Landing Sahifasiga Qaytish
            </button>
            <div className="flex items-center gap-2 text-indigo-300">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Surpriz Portali Faol</span>
            </div>
          </div>

          <SurprisePortal
            user={currentUser}
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
            onShowToast={showToast}
          />
        </div>
      ) : (
        /* VIEW: FULL LANDING PAGE */
        <div className="flex-1 flex flex-col">
          {/* Main Top Navigation */}
          <Navbar
            user={currentUser}
            onOpenAuth={handleOpenAuth}
            onEnterSurprise={() => setViewMode('surprise')}
            onLogout={handleLogout}
          />

          {/* Hero Section */}
          <Hero
            onOpenAuth={handleOpenAuth}
            onEnterSurprise={() => setViewMode('surprise')}
            isLoggedIn={!!currentUser}
          />

          {/* Features Section */}
          <Features />

          {/* Interactive Calculator Showcase */}
          <InteractiveShowcase onOpenAuth={handleOpenAuth} />

          {/* Transparent Pricing Plans */}
          <Pricing onOpenAuth={handleOpenAuth} />

          {/* Customer Testimonials */}
          <Testimonials />

          {/* FAQ Accordion */}
          <FAQ />

          {/* Site Footer */}
          <Footer
            onOpenAuth={handleOpenAuth}
            isLoggedIn={!!currentUser}
            onEnterSurprise={() => setViewMode('surprise')}
          />
        </div>
      )}
    </div>
  );
}
