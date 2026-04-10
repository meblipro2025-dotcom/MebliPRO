"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Ruler, Monitor, Wrench, Truck } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Заявка",
    desc: "Заповнюєте форму або пишете в Telegram. Обговорюємо ваші побажання, бюджет та терміни.",
    icon: ClipboardCheck,
  },
  {
    num: "02",
    title: "Виїзд на Замір",
    desc: "Приїжджаю до вас, залишаю професійні виміри та пропоную варіанти планування.",
    icon: Ruler,
  },
  {
    num: "03",
    title: "3D-Проект та Договір",
    desc: "Створюю детальну 3D-візуалізацію. Після затвердження — підписуємо офіційний договір.",
    icon: Monitor,
  },
  {
    num: "04",
    title: "Виготовлення",
    desc: "Від 14 до 45 днів. Матеріали Egger/Cleaf, фурнітура Blum. Контроль якості на кожному етапі.",
    icon: Wrench,
  },
  {
    num: "05",
    title: "Доставка та Монтаж",
    desc: "Професійна доставка та збірка на об'єкті. Перевірка кожного механізму. Здача під ключ.",
    icon: Truck,
  },
];

export default function Timeline() {
  return (
    <section id="process" className="relative py-10 md:py-32 px-4 md:px-6 z-10 bg-[#050505]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 md:mb-20">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Як ми працюємо</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading mb-6 text-white tracking-tight"
          >
            Від Ідеї до <span className="text-metallic-gold italic">Результату</span>
          </motion.h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light">
            Прозорий процес без сюрпризів. Ви контролюєте кожен етап.
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/20 to-transparent" />

          <div className="space-y-4 md:space-y-16">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Icon circle */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 md:w-16 md:h-16 glass-luxury border border-[#D4AF37]/40 flex items-center justify-center z-10 shrink-0">
                  <step.icon className="w-4 h-4 md:w-6 md:h-6 text-[#D4AF37]" />
                </div>

                {/* Content card */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-4rem)] min-w-0 ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="glass-luxury p-4 md:p-8 border border-white/5 group hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-2xl md:text-4xl font-heading text-[#D4AF37]/30 shrink-0">{step.num}</span>
                      <h3 className="text-base md:text-xl font-heading text-white uppercase tracking-tight leading-tight">{step.title}</h3>
                    </div>
                    <p className="text-zinc-400 font-light text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
