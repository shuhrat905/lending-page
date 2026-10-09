import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Ro'yxatdan o'tish bilan ichkaridagi sovg'a va omad charxpalagini ko'rib hayratda qoldim! Haqiqatan ham kutilmagan ajoyib surpriz bo'ldi. Dizayn va tezlik esa juda yuqori darajada.",
    author: "Javohir Rustamov",
    role: "Senior Frontend Engineer",
    company: "FinTech Lab",
    avatarBg: "bg-indigo-600",
  },
  {
    quote: "Parolni tiklash funksiyasi real OTP kodi bilan tez va qulay ishlaydi. Interfeys qulay, animatsiyalar esa ortiqcha bezaklarsiz, juda nozik ishlangan.",
    author: "Nilufar Karimova",
    role: "Product Manager",
    company: "SmartCloud Uzbekistan",
    avatarBg: "bg-fuchsia-600",
  },
  {
    quote: "Holografik VIP karta va interaktiv mini o'yin g'oyasi ajoyib. Platforma foydalanuvchiga hissiyot beradi. Har bir detal o'z o'rnida o'ylangan.",
    author: "Bobur Mirzayev",
    role: "Startup Asoschisi",
    company: "NextGen Ventures",
    avatarBg: "bg-emerald-600",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 md:py-24 bg-slate-900/40 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            Mijozlarimiz Fikrlari
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Minglab foydalanuvchilar ishonchi
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Ekotizimimizdan foydalanayotgan yetakchi mutaxassislar va tadbirkorlar taassurotlari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <div className={`w-9 h-9 rounded-full ${item.avatarBg} flex items-center justify-center font-bold text-xs text-white`}>
                  {item.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.author}</h4>
                  <div className="text-[11px] text-slate-400">
                    <span>{item.role}</span>
                    <span className="mx-1">·</span>
                    <span className="text-indigo-400">{item.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
