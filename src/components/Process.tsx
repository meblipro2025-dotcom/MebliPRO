"use client";

import { motion } from "framer-motion";
import { 
  PhoneCall, 
  Ruler, 
  Palette, 
  FileText, 
  Hammer, 
  Truck, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "Заявка",
    description: "Залишаєте заявку на сайті або телефонуєте. Обговорюємо ваші побажання та бюджет.",
    duration: "5 хвилин"
  },
  {
    icon: Ruler,
    title: "Замір",
    description: "Виїжджаємо на об'єкт зі зразками матеріалів. Професійний замір та консультація на місці.",
    duration: "30-60 хв"
  },
  {
    icon: Palette,
    title: "3D-проєкт",
    description: "Створюємо детальну 3D-візуалізацію. Ви бачите майбутні меблі з усіх ракурсів.",
    duration: "1-3 дні"
  },
  {
    icon: FileText,
    title: "Договір",
    description: "Погоджуємо проєкт, терміни та вартість. Підписуємо договір з фіксацією ціни.",
    duration: "15 хвилин"
  },
  {
    icon: Hammer,
    title: "Виробництво",
    description: "Виготовляємо меблі на власному виробництві. Контроль якості на кожному етапі.",
    duration: "14-45 днів"
  },
  {
    icon: Truck,
    title: "Доставка",
    description: "Акуратно доставляємо меблі в зручний для вас час. Підйом на поверх включено.",
    duration: "За домовленістю"
  },
  {
    icon: CheckCircle,
    title: "Монтаж",
    description: "Професійна збірка та встановлення. Прибираємо за собою. Гарантія на роботи.",
    duration: "3-48 годин"
  }
];

export default function Process() {
  return (
    <section id="process" className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
            Як ми працюємо
          </span>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white mb-4">
            Процес <span className="text-[#D4AF37]">роботи</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
            Від заявки до готових меблів — 7 простих кроків. Прозорий процес без прихованих платежів.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="group bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] h-full">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <step.icon className="w-7 h-7 text-[#D4AF37]" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-lg text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
                    <ArrowRight className="w-3 h-3" />
                    <span>{step.duration}</span>
                  </div>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <ArrowRight className="w-5 h-5 text-[#D4AF37]/50 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button 
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#e5c248] transition-colors"
          >
            Розпочати проєкт
          </button>
        </motion.div>
      </div>
    </section>
  );
}
