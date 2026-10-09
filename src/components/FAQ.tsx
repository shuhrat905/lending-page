import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "Ro'yxatdan o'tish rostdan ham bepulmi?",
    a: "Ha, Nexus Prime platformasida ro'yxatdan o'tish mutlaqo bepul. Ro'yxatdan o'tganingiz zahoti sizga xush kelibsiz sovg'a qutisi, bonus tangalar va shaxsiy raqamli a'zolik guvohnomasi taqdim etiladi.",
  },
  {
    q: "Parolimni unutib qo'ysam qanday tiklayman?",
    a: "Kirish bo'limidagi 'Parolni unutdingizmi?' tugmasini bosing va emailingizni kiriting. Tizimimiz sizga 6 xonali maxfiy tasdiqlash kodini yuboradi. Kodni kiritib, darhol yangi parol o'rnatishingiz va tizimga kirishingiz mumkin.",
  },
  {
    q: "Ichkariga kirganda qanday surprizlar bor?",
    a: "Tizimga kirganingizda maxsus interaktiv surpriz xonasi ochiladi: 3D sovg'a qutisi (ochilganda konfeti va tantanali musiqa bilan), kafolatlangan yutuqli Omad Charxpalagi, maxsus holografik VIP karta va yulduzlar ovi mini-o'yini mavjud!",
  },
  {
    q: "Omad Charxpalagida qanday sovrinlar mavjud?",
    a: "Charxpalakda 1 yillik VIP status, 1,000,000 UZS vaucher, cheksiz server quvvatlari, oltin a'zolik nishoni va doimiy bonus tangalar kabi ko'plab qimmatbaho sovg'alar mavjud.",
  },
  {
    q: "Mening shaxsiy ma'lumotlarim qanday himoyalangan?",
    a: "Barcha foydalanuvchi ma'lumotlari zamonaviy xavfsizlik standartlari asosida shifrlangan holda saqlanadi. Sessiyangiz faqat sizning ruxsatingiz bilan ishlaydi va istalgan paytda 'Chiqish' orqali uni yakunlashingiz mumkin.",
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            Tez-tez beriladigan savollar
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Savollaringizga aniq javoblar
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Tizim haqida barcha muhim savollar va tushuntirishlar.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-indigo-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
