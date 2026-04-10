"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useSiteSettings } from "@/context/SiteContext";

const fallbackFaqs = [
  {
    question: "Які терміни виготовлення меблів?",
    answer: "В середньому виготовлення займає від 14 до 45 днів залежно від складності проекту та наявності обраних матеріалів на складі. Точні терміни ми фіксуємо в договорі після узгодження 3D-проекту."
  },
  {
    question: "Скільки коштує виїзд на замір та консультація?",
    answer: "Виїзд на замір по Києву безкоштовний за умови подальшого укладання договору. Якщо замір потрібен без замовлення — вартість складає 500 грн (ця сума потім віднімається від вартості вашого замовлення)."
  },
  {
    question: "Чи працюєте ви офіційно за договором?",
    answer: "Так, я працюю як офіційний ФОП. Ми підписуємо договір, у якому чітко прописані терміни, специфікація матеріалів та мої гарантійні зобов'язання перед вами."
  },
  {
    question: "Яку фурнітуру та матеріали ви використовуєте?",
    answer: "Для корпусів я використовую якісні плити Egger або Cleaf. Щодо фурнітури — в пріоритеті австрійський бренд Blum або німецький Hettich. Це гарантує плавний хід та довговічність ваших меблів."
  },
  {
    question: "Чи займаєтеся ви реставрацією старих меблів?",
    answer: "Так, одна з моїх спеціалізацій — відновлення фасадів (фарбування або перетяжка плівкою), а також заміна старої фурнітури на сучасну з доводчиками."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const settings = useSiteSettings();
  const faqs = settings.faq.length > 0 ? settings.faq : fallbackFaqs;

  return (
    <section id="faq" className="relative py-8 md:py-24 px-4 md:px-6 z-10">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading mb-4 md:mb-6 tracking-tight">
            Часті <span className="text-metallic-gold italic">Запитання</span>
          </h2>
          <p className="text-zinc-400 font-light">Відповіді на те, що клієнти запитують найчастіше.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-none border transition-all duration-500 ${
                activeIndex === index ? "glass-luxury border-[#D4AF37]/50" : "glass-dark border-white/5 hover:border-[#D4AF37]/20"
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full p-4 md:p-8 flex items-center justify-between text-left outline-none"
              >
                <span className={`text-base md:text-lg font-heading pr-4 md:pr-8 transition-colors leading-snug ${activeIndex === index ? "text-white" : "text-zinc-300"}`}>{faq.question}</span>
                <div className={`p-2 rounded-none transition-colors ${activeIndex === index ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "bg-transparent text-zinc-500"}`}>
                  {activeIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-8 text-zinc-400 leading-relaxed font-light border-t border-white/5 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
