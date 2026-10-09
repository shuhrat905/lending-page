import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types/auth';
import confetti from 'canvas-confetti';
import {
  playFanfare,
  playPopSound,
  playWheelTick,
  playSuccessChime,
  playFireworkBurst,
} from '../utils/audio';
import { updateUserProfile, logoutUser } from '../services/authService';
import {
  Gift,
  Sparkles,
  Trophy,
  Award,
  Crown,
  Share2,
  Download,
  LogOut,
  Flame,
  Volume2,
  VolumeX,
  Zap,
  Gamepad2,
  Mail,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface SurprisePortalProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  onShowToast: (type: 'success' | 'error' | 'info' | 'otp', title: string, message: string) => void;
}

const PRIZES = [
  { id: 1, label: "1 Yillik VIP Status", desc: "Barcha xizmatlar 100% bepul ochildi", color: "#6366f1", icon: Crown },
  { id: 2, label: "1,000,000 UZS Vaucher", desc: "Nexus do'konida erkin xarid qilish uchun", color: "#10b981", icon: Trophy },
  { id: 3, label: "Cheksiz AI & Cloud", desc: "Yuqori tezlikdagi server resurslari", color: "#ec4899", icon: Zap },
  { id: 4, label: "Oltin A'zolik Nishoni", desc: "Ekotizimda doimiy maxsus imtiyozlar", color: "#f59e0b", icon: Award },
  { id: 5, label: "Maxfiy Masterclass", desc: "IT va Biznes bo'yicha eksklyuziv darslar", color: "#8b5cf6", icon: Sparkles },
  { id: 6, label: "500 Bonus Nexus Tangasi", desc: "Shaxsiy hisobingizga qo'shildi", color: "#06b6d4", icon: Flame },
];

export const SurprisePortal: React.FC<SurprisePortalProps> = ({
  user,
  onLogout,
  onUpdateUser,
  onShowToast,
}) => {
  const [giftOpened, setGiftOpened] = useState(user.surpriseOpened);
  const [activeTab, setActiveTab] = useState<'gift' | 'wheel' | 'card' | 'game' | 'letter'>('gift');
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(user.wonPrize || null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [letterOpen, setLetterOpen] = useState(false);

  // Mini game state
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTimeLeft, setGameTimeLeft] = useState(20);
  const [fallingItems, setFallingItems] = useState<{ id: number; x: number; y: number; speed: number; char: string; points: number }[]>([]);

  // Trigger celebration on initial mount if not opened
  useEffect(() => {
    if (!user.surpriseOpened) {
      triggerConfettiShow();
    }
  }, []);

  const triggerConfettiShow = () => {
    if (soundEnabled) {
      playFanfare();
    }
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.7 },
        colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#38bdf8'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.7 },
        colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#38bdf8'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleOpenGift = () => {
    if (soundEnabled) {
      playPopSound();
      playFanfare();
    }
    setGiftOpened(true);
    triggerConfettiShow();

    const updated = updateUserProfile({
      surpriseOpened: true,
      coins: user.coins + 500,
    });
    if (updated) {
      onUpdateUser(updated);
    }
    onShowToast('success', 'Surpriz ochildi! 🎉', 'Sizga 500 bonus tanga va VIP kutib olish to\'plami berildi!');
  };

  const handleSpinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const segmentCount = PRIZES.length;
    const chosenIndex = Math.floor(Math.random() * segmentCount);
    const chosenPrize = PRIZES[chosenIndex];

    // Extra spins (5 to 8 full rotations) + target angle offset
    const extraRotations = 360 * 6;
    const segmentAngle = 360 / segmentCount;
    // Target angle center
    const targetAngle = 360 - (chosenIndex * segmentAngle + segmentAngle / 2);
    const finalRotation = wheelRotation + extraRotations + targetAngle;

    setWheelRotation(finalRotation);

    // Audio tick simulation during spin
    if (soundEnabled) {
      const interval = setInterval(() => {
        playWheelTick();
      }, 180);
      setTimeout(() => clearInterval(interval), 3600);
    }

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(chosenPrize.label);
      if (soundEnabled) {
        playSuccessChime();
        playFanfare();
      }
      triggerConfettiShow();

      const updated = updateUserProfile({
        wonPrize: chosenPrize.label,
        coins: user.coins + 250,
      });
      if (updated) {
        onUpdateUser(updated);
      }
      onShowToast('success', 'Yutuq aniqlandi! 🏆', `Siz yutib oldingiz: "${chosenPrize.label}"!`);
    }, 4000);
  };

  const handleLaunchFireworks = (e: React.MouseEvent) => {
    if (soundEnabled) {
      playFireworkBurst();
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: Math.max(0.1, Math.min(0.9, x)), y: Math.max(0.1, Math.min(0.9, y)) },
      colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981', '#38bdf8'],
    });
  };

  // Mini game logic
  const startGame = () => {
    setGameScore(0);
    setGameTimeLeft(20);
    setGameActive(true);
    setFallingItems([]);
    if (soundEnabled) playSuccessChime();
  };

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          triggerConfettiShow();
          const extraCoins = gameScore * 10;
          const updated = updateUserProfile({ coins: user.coins + extraCoins });
          if (updated) onUpdateUser(updated);
          onShowToast('success', 'O\'yin yakunlandi! 🎮', `Siz ${gameScore} ball to'pladingiz va ${extraCoins} tanga yutdingiz!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnInterval = setInterval(() => {
      setFallingItems((prev) => [
        ...prev.slice(-15),
        {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 85),
          y: -10,
          speed: 1.5 + Math.random() * 2,
          char: ['⭐', '💎', '🎁', '🚀', '👑'][Math.floor(Math.random() * 5)],
          points: 10,
        },
      ]);
    }, 600);

    const animation = setInterval(() => {
      setFallingItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + item.speed }))
          .filter((item) => item.y < 105)
      );
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(spawnInterval);
      clearInterval(animation);
    };
  }, [gameActive, gameScore]);

  const handleCatchItem = (id: number, points: number) => {
    if (soundEnabled) playPopSound();
    setGameScore((s) => s + points);
    setFallingItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Interior Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">NEXUS VIP ZONE</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {user.role === 'founder' ? 'Founder' : 'VIP Member'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Shaxsiy maxfiy portal & surpriz xonasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-bold text-amber-300 font-mono">{user.coins}</span>
              <span className="text-slate-400 text-[11px]">tanga</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Logout button */}
            <button
              onClick={() => {
                logoutUser();
                onLogout();
                onShowToast('info', 'Chiqildi', 'Siz tizimdan chiqdingiz. Landing sahifasiga qaytdingiz.');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chiqish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Surprise Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Welcome Greeting Banner */}
        <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-fuchsia-950/70 border border-indigo-500/30 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs text-indigo-300 font-medium tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Xush kelibsiz, {user.name}!
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Siz uchun maxsus tayyorlangan <span className="shimmer-text">Surprizlar Portali</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                Tizimga muvaffaqiyatli kirdingiz! Siz uchun sovg'a qutisi, omad charxpalagi, maxsus VIP sertifikat karta va yutuqli mini o'yinlar tayyorlab qo'yildi.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={triggerConfettiShow}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Bayramona Feyerverk!
              </button>
              <button
                onClick={() => setLetterOpen(!letterOpen)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                Maxfiy Tabrik Xati
              </button>
            </div>
          </div>

          {/* Letter popup */}
          {letterOpen && (
            <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-top-2">
              <div className="bg-slate-950/90 rounded-xl p-5 border border-indigo-500/40 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Nexus Platformasi Asoschilaridan Maxsus Maktub
                  </div>
                  <button
                    onClick={() => setLetterOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Yopish
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Hurmatli {user.name}, bizning premium platformamizga qadam qo'yganingizdan bag'oyat mamnunmiz! 
                  Siz nafaqat foydalanuvchi, balki kelajak innovatsiyalarining ilk ishtirokchisisiz. 
                  Quyidagi bo'limlardan o'z sovg'alaringizni qabul qilib oling, omadingizni sinab ko'ring va VIP imtiyozlardan to'liq bahramand bo'ling!"
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Toshkent, O'zbekiston · 2026</span>
                  <span className="font-semibold text-indigo-300">Nexus Prime Team</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Surprise Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('gift')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'gift'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gift className="w-4 h-4" />
            1. Asosiy Sovg'a Qutisi
            {!giftOpened && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          </button>

          <button
            onClick={() => setActiveTab('wheel')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'wheel'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            2. Omad Charxpalagi (Lucky Wheel)
            {wonPrize && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded">Yutuq bor!</span>}
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'card'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-4 h-4" />
            3. Shaxsiy VIP Karta
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'game'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            4. Yulduzlar Ovi Mini-O'yini
          </button>
        </div>

        {/* TAB 1: 3D GIFT BOX SURPRISE */}
        {activeTab === 'gift' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

              {!giftOpened ? (
                <div className="flex flex-col items-center">
                  <div
                    onClick={handleOpenGift}
                    className="cursor-pointer group relative transition-transform hover:scale-105 active:scale-95 animate-float-gift"
                  >
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-indigo-600 via-fuchsia-600 to-amber-500 p-1 shadow-2xl animate-pulse-glow flex items-center justify-center relative">
                      {/* Ribbon decoration */}
                      <div className="absolute inset-x-0 h-8 bg-amber-400/90 top-1/2 -translate-y-1/2 shadow-md" />
                      <div className="absolute inset-y-0 w-8 bg-amber-400/90 left-1/2 -translate-x-1/2 shadow-md" />
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-amber-300 border-4 border-amber-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-7 h-7 text-amber-900" />
                      </div>

                      <div className="relative z-10 text-center px-4">
                        <Gift className="w-20 h-20 text-white mx-auto drop-shadow-md group-hover:rotate-12 transition-transform" />
                        <span className="block mt-2 font-bold text-white text-sm tracking-wide uppercase">
                          Bosib Ochish!
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-8">Maxfiy Sovg'angizni Qabul Qiling!</h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                    Ushbu sovg'a qutisi sizning hisobingiz uchun maxsus shakllantirilgan. Qutini ochish uchun ustiga bosing!
                  </p>

                  <button
                    onClick={handleOpenGift}
                    className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Gift className="w-4 h-4" />
                    Sovg'a Qutisini Ochish
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-500 w-full">
                  <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
                    <Trophy className="w-12 h-12" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                    Muvaffaqiyatli ochildi!
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">Sizning VIP Sovg'alar To'plamingiz</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    Tabriklaymiz! Hisobingizga 500 bonus tanga va quyidagi barcha imtiyozlar faollashtirildi:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-6 text-left">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">VIP Pre-Access</h4>
                        <p className="text-[11px] text-slate-400">Kelgusi barcha relizlarga erta kirish</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">+500 Bonus Tanga</h4>
                        <p className="text-[11px] text-slate-400">Shaxsiy balansga yozildi</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Cheksiz API Quvvati</h4>
                        <p className="text-[11px] text-slate-400">0 ms kechikish bilan yuklanish</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-fuchsia-500/30 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-fuchsia-500/20 text-fuchsia-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">24/7 Shaxsiy Konsyerj</h4>
                        <p className="text-[11px] text-slate-400">Shaxsiy muhandis yordami</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setActiveTab('wheel')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
                    >
                      Omad Charxpalagini Aylantirish
                      <Trophy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={triggerConfettiShow}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                    >
                      Qayta Feyerverk
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Quick Stats & Mystery Box info */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Foydalanuvchi Ma'lumotlari
                  </h4>
                  <span className="text-[11px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    Faol Seans
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Ism:</span>
                    <span className="font-semibold text-white">{user.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-300">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Telefon:</span>
                    <span className="font-mono text-slate-300">{user.phone || '+998 90 000 00 00'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">VIP Karta ID:</span>
                    <span className="font-mono font-bold text-indigo-400">{user.vipCardId}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Balans Tangalari:</span>
                    <span className="font-bold text-amber-400">{user.coins} NX</span>
                  </div>
                </div>
              </div>

              {/* Interactive Fireworks playground */}
              <div
                onClick={handleLaunchFireworks}
                className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/60 transition-all group relative overflow-hidden select-none"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Interaktiv Feyerverk Maydoni</h4>
                    <p className="text-[11px] text-slate-400">Bu yerga bosing yoki cherting — feyerverk otiladi!</p>
                  </div>
                </div>
                <div className="mt-3 text-center py-4 bg-slate-950/50 rounded-xl border border-dashed border-indigo-500/30 text-indigo-300 text-xs">
                  ✨ Cherting va rang-barang chaqnashlarni ko'ring ✨
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LUCKY WHEEL (OMAD CHARXPALAGI) */}
        {activeTab === 'wheel' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center">
            <div className="text-center max-w-xl mb-6">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Omad Charxpalagi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Kafolatlangan Mukofotlar G'ildiragi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                G'ildirakni aylantiring! Har bir aylantirishda sizga qimmatbaho sovrin yoki xizmat paketi nasib etadi.
              </p>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              {/* Pointer at the top */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center drop-shadow-lg">
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 filter drop-shadow" />
              </div>

              {/* The Spinning Wheel */}
              <div
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none',
                }}
                className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-amber-500/80 shadow-2xl relative overflow-hidden flex items-center justify-center bg-slate-950"
              >
                {PRIZES.map((prize, idx) => {
                  const angle = (360 / PRIZES.length) * idx;
                  return (
                    <div
                      key={prize.id}
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '50% 100%',
                      }}
                      className="absolute top-0 left-0 right-0 h-1/2 flex flex-col items-center pt-3 select-none"
                    >
                      <div
                        className="text-[11px] font-bold text-center px-1"
                        style={{ color: prize.color }}
                      >
                        {prize.label}
                      </div>
                    </div>
                  );
                })}

                {/* Wheel Center Hub */}
                <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-amber-400 flex flex-col items-center justify-center shadow-2xl z-10">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span className="text-[10px] font-extrabold text-white">NEXUS</span>
                </div>
              </div>
            </div>

            {/* Spin button */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                onClick={handleSpinWheel}
                disabled={spinning}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                {spinning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    G'ildirak aylanmoqda...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4" />
                    G'ildirakni Aylantirish!
                  </>
                )}
              </button>

              {wonPrize && (
                <div className="mt-3 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-center animate-in zoom-in-95">
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                    Yutuqli Sovriningiz:
                  </span>
                  <span className="text-lg font-bold text-white mt-0.5 block">{wonPrize}</span>
                  <span className="text-xs text-slate-300">
                    Sizning profil hisobingizga muvaffaqiyatli biriktirildi!
                  </span>
                </div>
              )}
            </div>

            {/* Prize Catalog */}
            <div className="w-full max-w-3xl mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRIZES.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4" style={{ color: p.color }} />
                      <span className="text-xs font-bold text-white truncate">{p.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PERSONAL HOLOGRAPHIC VIP CARD */}
        {activeTab === 'card' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10 flex flex-col items-center">
            <div className="text-center max-w-xl mb-8">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Holografik VIP A'zolik Kartasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Sizning Eksklyuziv Nexus Guvohnomangiz
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ushbu karta sizning shaxsiy VIP maqomingizni tasdiqlaydi. Uni saqlab olishingiz mumkin.
              </p>
            </div>

            {/* The 3D Holographic Card */}
            <div className="w-full max-w-md perspective-1000 my-4">
              <div className="relative rounded-3xl p-7 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border-2 border-amber-400/50 shadow-2xl transform-style-preserve-3d transition-transform hover:scale-105 overflow-hidden">
                {/* Holographic light streak */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse pointer-events-none" />

                {/* Card Top: Chip and Brand */}
                <div className="flex items-start justify-between relative z-10 mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                      <span className="font-extrabold tracking-widest text-lg text-white">NEXUS PRIME</span>
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-amber-300 font-semibold">
                      VIP FOUNDER / CITIZEN
                    </span>
                  </div>

                  {/* Gold EMV Chip */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-400 to-yellow-200 border border-amber-600 shadow-md flex flex-col justify-around p-1">
                    <div className="h-0.5 bg-amber-700/60 rounded" />
                    <div className="h-0.5 bg-amber-700/60 rounded" />
                    <div className="h-0.5 bg-amber-700/60 rounded" />
                  </div>
                </div>

                {/* Card Number */}
                <div className="relative z-10 mb-6">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                    Karta Raqami (ID)
                  </span>
                  <div className="font-mono text-xl sm:text-2xl tracking-[0.25em] font-bold text-amber-300 drop-shadow">
                    {user.vipCardId || 'NX-2026-GOLD-001'}
                  </div>
                </div>

                {/* Card Bottom: Holder Name, Valid Thru, QR simulation */}
                <div className="flex items-end justify-between relative z-10 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                      Karta Egasi
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide uppercase">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-indigo-300 font-mono mt-0.5">
                      Berilgan sana: 2026-yil
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow">
                      {/* Simulated QR Code */}
                      <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                        <div className="bg-black rounded-xs" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-transparent" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-transparent" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-transparent" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-transparent" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-black rounded-xs" />
                        <div className="bg-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions for card */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  if (soundEnabled) playSuccessChime();
                  onShowToast('success', 'Karta saqlandi', `Guvohnoma ${user.vipCardId} qurilmangizga yuklandi!`);
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                Kartani Saqlash (PDF / Rasm)
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Men Nexus Prime VIP a'zosiman! Karta ID: ${user.vipCardId}`);
                  onShowToast('info', 'Nusxalandi', 'VIP Karta ma\'lumotlari nusxa olindi!');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Ulashish
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: STAR HUNT MINI GAME */}
        {activeTab === 'game' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center">
            <div className="text-center max-w-xl mb-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-fuchsia-400" />
                Nexus Yulduzlar Ovi
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                20-Soniyalik Bonus O'yini
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ekranda tushayotgan yulduz va sovg'alarni tezda cherting. Har bir tutgan narsangiz uchun ball va qo'shimcha tangalar beriladi!
              </p>
            </div>

            {/* Game Arena */}
            <div className="w-full max-w-2xl h-80 rounded-2xl bg-slate-950 border border-indigo-500/30 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              {/* Game Top HUD */}
              <div className="flex items-center justify-between text-xs z-20">
                <div className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Ball: <span className="text-white text-sm">{gameScore}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  Vaqt: <span className="text-white text-sm">{gameTimeLeft}s</span>
                </div>
              </div>

              {/* Falling items */}
              {gameActive && (
                <div className="absolute inset-0 z-10">
                  {fallingItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCatchItem(item.id, item.points)}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                      }}
                      className="absolute text-2xl sm:text-3xl hover:scale-125 active:scale-90 transition-transform cursor-pointer drop-shadow-lg animate-bounce"
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              )}

              {/* Start overlay if not active */}
              {!gameActive && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-30 p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center mb-3">
                    <Gamepad2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Yulduzlar Ovi Tayyor!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    {gameScore > 0
                      ? `Oldingi natijangiz: ${gameScore} ball! Qayta o'ynab rekordni yangilang.`
                      : 'Boshlash tugmasini bosing va tushayotgan sovg\'alarni cherting!'}
                  </p>
                  <button
                    onClick={startGame}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-fuchsia-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    O'yinni Boshlash
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
