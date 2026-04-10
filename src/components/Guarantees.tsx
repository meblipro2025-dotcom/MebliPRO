"use client";

import { motion } from "framer-motion";
import { FileText, Lock, RefreshCw, Headphones } from "lucide-react";

const guarantees = [
  {
    icon: FileText,
    title: "Офіційний договір",
    desc: "Усі умови прописані чорним по білому: терміни, матеріали, вартість. Жодних прихованих платежів."
  },
  {
    icon: Lock,
    title: "Фіксована ціна",
    desc: "Вартість не змінюється після підписання договору. Ви платите рівно стільки, скільки було погоджено."
  },
  {
    icon: RefreshCw,
    title: "Гарантія 2 роки",
    desc: "Безкоштовне усунення будь-яких виробничих дефектів протягом 24 місяців з моменту здачі."
  },
  {
    icon: Headphones,
    title: "Сервіс після монтажу",
    desc: "Залишились питання? Потрібна консультація? Завжди на зв'язку — вирішуємо швидко та оперативно."
  }
];

export default function Guarantees() {
  return (
    <section id="guarantees" className="relative py-10 md:py-24 lg:py-32 px-4 md:px-6 z-10 border-y border-white/5 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Наші гарантії</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading mb-4 text-white tracking-tight"
          >
            Працюємо <span className="text-metallic-gold italic">чесно та прозоро</span>
          </motion.h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light">
            Ваш спокій — наш пріоритет. Все офіційно, все з документами.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {guarantees.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto glass-luxury border border-[#D4AF37]/30 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/10 transition-all duration-500">
                <item.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-heading text-white mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-zinc-300 mb-4">
            Маєте сумніви? Перегляньте наші роботи та відгуки клієнтів
          </p>
          <a 
            href="#portfolio"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            Дивитись портфоліо
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
