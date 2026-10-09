import React from 'react';
import {
  ShieldCheck,
  Zap,
  Gift,
  KeyRound,
  Cpu,
  Layers,
  Sparkles,
  Smartphone,
  Globe2,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Gift,
    title: "Eksklyuziv Surpriz Ekotizimi",
    description: "Tizimga kirganingizda ochiladigan interaktiv sovg'alar, omad g'ildiragi va shaxsiy VIP kartalar orqali haqiqiy hayratni his qiling.",
    highlightColor: "text-amber-400",
    borderColor: "hover:border-amber-500/40",
  },
  {
    icon: KeyRound,
    title: "Real Vaqtli Xavfsiz Autentifikatsiya",
    description: "Ro'yxatdan o'tish, kirish va parolni tiklash (6 xonali OTP avtomatlashtirilgan tekshiruvi) to'liq real rejimda ishlaydi.",
    highlightColor: "text-emerald-400",
    borderColor: "hover:border-emerald-500/40",
  },
  {
    icon: Zap,
    title: "Chaqmoq Tezligidagi Arxitektura",
    description: "Vite va zamonaviy frontend texnologiyalari asosida qurilgan bo'lib, sahifalar va animatsiyalar 60 FPS silliqlikda yuklanadi.",
    highlightColor: "text-indigo-400",
    borderColor: "hover:border-indigo-500/40",
  },
  {
    icon: ShieldCheck,
    title: "Mijoz Ma'lumotlari Himoyasi",
    description: "Barcha foydalanuvchi ma'lumotlari shifrlangan saqlash mexanizmi orqali himoyalanadi va ruxsatsiz kirishlardan to'siladi.",
    highlightColor: "text-fuchsia-400",
    borderColor: "hover:border-fuchsia-500/40",
  },
  {
    icon: Smartphone,
    title: "Mukammal Moslashuvchanlik (Responsive)",
    description: "Smartfonlar, planshetlar va katta monitorlarda bir xil qulaylik va professional ko'rinishni ta'minlaydi.",
    highlightColor: "text-sky-400",
    borderColor: "hover:border-sky-500/40",
  },
  {
    icon: Globe2,
    title: "Global Ekotizim Integratsiyasi",
    description: "Kelajakdagi API va xizmatlar bilan oson integratsiyalashuv uchun modulli komponentlar va standartlashtirilgan arxitektura.",
    highlightColor: "text-rose-400",
    borderColor: "hover:border-rose-500/40",
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2">
            Nega aynan Nexus Prime?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Innovatsion imkoniyatlar va texnologik ustunliklar
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Biz shunchaki chiroyli dizayn emas, balki real ishlaydigan xavfsiz mexanizmlar va foydalanuvchiga zavq beruvchi interaktiv muhit yaratdik.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={`p-7 rounded-2xl bg-slate-900/60 border border-slate-800 transition-all duration-300 hover:-translate-y-1 ${feat.borderColor} group`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${feat.highlightColor}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
