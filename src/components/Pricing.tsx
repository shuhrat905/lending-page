import React, { useState } from 'react';
import { AuthMode } from '../types/auth';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenAuth: (mode: AuthMode) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenAuth }) => {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Boshlang'ich",
      desc: "Kichik loyihalar va individual foydalanuvchilar uchun",
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        "To'liq bepul ro'yxatdan o'tish",
        "Interaktiv sovg'a qutisi va surprizlar",
        "Omad charxpalagida 1 ta bepul aylantirish",
        "Shaxsiy raqamli a'zolik kartasi",
        "Asosiy xavfsizlik va parolni tiklash",
      ],
      highlighted: false,
      cta: "Bepul Boshlash",
    },
    {
      name: "Professional VIP",
      desc: "O'suvchi jamoalar va faol foydalanuvchilar uchun",
      priceMonthly: 29,
      priceAnnual: 19,
      features: [
        "Boshlang'ich tarifning barcha imtiyozlari",
        "Cheksiz omad charxpalagi aylantirishlari",
        "Holografik VIP oltin maqom kartasi",
        "+1,500 doimiy bonus Nexus tangalari",
        "Prioritetli 24/7 texnik yordam",
        "Kengaytirilgan AI va server quvvatlari",
      ],
      highlighted: true,
      cta: "VIP Rejimni Faollashtirish",
    },
    {
      name: "Korporativ",
      desc: "Katta kompaniyalar va maxsus talablar uchun",
      priceMonthly: 99,
      priceAnnual: 79,
      features: [
        "Barcha Professional imtiyozlar",
        "Maxsus ajratilgan infratuzilma",
        "Maxsus xavfsizlik auditi va SLA kafolati",
        "Shaxsiy muhandis biriktirilishi",
        "API orqali cheksiz webhook integratsiyalari",
      ],
      highlighted: false,
      cta: "Biz Bilan Bog'lanish",
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            Shaffof Tariflar
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Har qanday ehtiyoj uchun qulay yechimlar
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Yashirin to'lovlarsiz, istalgan vaqtda bekor qilish imkoniyati bilan.
          </p>

          {/* Interactive Toggle */}
          <div className="mt-6 inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !annual ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Oylik to'lov
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                annual ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yillik to'lov</span>
              <span className="text-[10px] text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.2 rounded">
                -30% Chegirma
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const price = annual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 md:-translate-y-2'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-[10px] font-extrabold uppercase tracking-widest text-white shadow">
                    ENG MASHHUR TANLOV
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.desc}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-mono text-4xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-slate-400">/oyiga</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs text-slate-300">
                    {plan.features.map((item, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onOpenAuth('register')}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-102'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
