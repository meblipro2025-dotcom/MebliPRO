"use client";

import { motion } from "framer-motion";
import { Award, Factory, Wrench, Shield, Clock, MapPin, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: Award,
    title: "15+ років досвіду",
    desc: "Олександр — приватний майстер з власним виробництвом. Преміум-якість за ціною мас-маркету."
  },
  {
    icon: Factory,
    title: "Власне виробництво",
    desc: "Повний контроль якості та реальні терміни. Без посередників — ви спілкуєтесь одразу з майстром."
  },
  {
    icon: Wrench,
    title: "Blum / Hettich",
    desc: "Тільки перевірена європейська фурнітура. Матеріали Egger, Cleaf, фарбований МДФ."
  },
  {
    icon: Shield,
    title: "Гарантія 2 роки",
    desc: "Офіційний договір з фіксованою ціною. Сервісне обслуговування після монтажу."
  },
  {
    icon: Clock,
    title: "Від 21 дня",
    desc: "Швидке виготовлення без втрати якості. Точні терміни прописуємо в договорі."
  },
  {
    icon: MapPin,
    title: "Лівий берег Києва",
    desc: "Безкоштовний замір: Троєщина, Лісовий, Дарниця, Воскресенка, Биківня та інші райони."
  }
];

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-10 md:py-24 lg:py-32 px-4 md:px-6 z-10 bg-[#050505]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10 md:mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Переваги</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading mb-4 text-white tracking-tight"
          >
            Чому обирають <span className="text-metallic-gold italic">MEBLI-PRO</span>
          </motion.h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light">
            Працюємо без посередників — ви отримуєте якісні меблі за чесною ціною
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group glass-luxury p-6 md:p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500"
            >
              <div className="w-12 h-12 glass-dark border border-[#D4AF37]/30 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/10 transition-all">
                <benefit.icon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg md:text-xl font-heading text-white mb-3 tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8">
          {[
            "Офіційний ФОП",
            "Договір + акт",
            "Фіксована ціна",
            "Поетапна оплата"
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
