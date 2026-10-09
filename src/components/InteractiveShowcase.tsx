import React, { useState } from 'react';
import { AuthMode } from '../types/auth';
import { Calculator, Sparkles, TrendingUp, Clock, DollarSign, ArrowRight } from 'lucide-react';

interface ShowcaseProps {
  onOpenAuth: (mode: AuthMode) => void;
}

export const InteractiveShowcase: React.FC<ShowcaseProps> = ({ onOpenAuth }) => {
  const [usersCount, setUsersCount] = useState(15);
  const [tasksPerDay, setTasksPerDay] = useState(120);

  // Dynamic calculations
  const hoursSavedPerMonth = Math.round((usersCount * tasksPerDay * 0.15) * 22);
  const moneySaved = (hoursSavedPerMonth * 12).toLocaleString('uz-UZ');
  const bonusCoins = Math.min(2500, usersCount * 50 + tasksPerDay * 5);

  return (
    <section id="showcase" className="py-20 md:py-24 bg-slate-900/30 border-y border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left information */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
              Interaktiv Kalkulyator
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Platformaning biznesingizga ta'sirini hisoblang
            </h2>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Jamoangiz hajmi va kundalik operatsiyalar sonini belgilang. Nexus ekotizimi orqali qancha vaqt va xarajatni tejashingiz hamda qancha bonus tanga olishingizni real vaqtda ko'ring.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Jamoa a'zolari soni:</span>
                  <span className="font-bold text-white font-mono">{usersCount} kishi</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={usersCount}
                  onChange={(e) => setUsersCount(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Kunlik avtomatlashtiriladigan vazifalar:</span>
                  <span className="font-bold text-white font-mono">{tasksPerDay} ta</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  value={tasksPerDay}
                  onChange={(e) => setTasksPerDay(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right dynamic results card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  Oylik Tejamkorlik Ko'rsatkichlari
                </div>
                <span className="text-[11px] text-indigo-300 font-mono">Real-time Model</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Tejalgan vaqt</span>
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-white">
                    {hoursSavedPerMonth}
                    <span className="text-xs text-slate-400 font-normal ml-1">soat/oy</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Avtomatik jarayonlar hisobiga</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Tejalgan byudjet</span>
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">
                    ${moneySaved}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Operatsion xarajat qisqarishi</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 text-xs mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Bonus Tangalar</span>
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-amber-300">
                    +{bonusCoins}
                    <span className="text-xs text-amber-400 font-normal ml-1">NX</span>
                  </div>
                  <p className="text-[10px] text-amber-400/80 mt-1">Surpriz portalida ochiladi</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  Ushbu natijalarni amalda ko'rish uchun hoziroq tizimga kiring.
                </span>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/25 shrink-0"
                >
                  Ro'yxatdan o'tish
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
