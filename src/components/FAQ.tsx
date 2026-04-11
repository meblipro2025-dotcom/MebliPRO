"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useSiteSettings } from "@/context/SiteContext";

const fallbackFaqs = [
  {
    question: "Чи безкоштовний виїзд замірника?",
    answer: "Так, виїзд замірника безкоштовний при замовленні меблів. Майстер приїде зі зразками матеріалів, зробить професійний замір та проконсультує на місці. Якщо ви вирішите не замовляти — виїзд 500 грн."
  },
  {
    question: "Який термін виготовлення кухні?",
    answer: "Зазвичай від 21 до 45 робочих днів залежно від фасадів. ЛДСП та плівкові фасади — 14-21 день, фарбований МДФ — 25-35 днів, шпон або скло — 35-45 днів. Точні терміни фіксуємо в договорі."
  },
  {
    question: "Яку фурнітуру ви використовуєте?",
    answer: "Працюємо з Blum, Hettich, Muller та іншими залежно від бюджету. Преміум-сегмент — Blum з довічною гарантією, середній — Hettich, бюджетний — Muller чи вітчизняні виробники. Всі механізми з доводчиками."
  },
  {
    question: "Чи надаєте ви гарантію?",
    answer: "Так, офіційна гарантія на корпуси та механізми від 2 років. Фурнітура Blum має довічну гарантію виробника. Гарантійне обслуговування — безкоштовно, післягарантійне — за собівартістю матеріалів."
  },
  {
    question: "Чи можна замовити меблі за моїм власним ескізом?",
    answer: "Так, ми реалізуємо проєкти будь-якої складності. Працюю за вашими ескізами, кресленнями чи фото з Pinterest. Допоможу адаптувати ідею під ваш простір та бюджет. Консультація щодо оптимізації — безкоштовно."
  },
  {
    question: "Які матеріали фасадів зараз найбільш популярні?",
    answer: "Фарбований МДФ (матовий та глянцевий), акрилові панелі та ДСП преміум-сегменту. Для кухонь — фарбований МДФ легко мити, акрил — найміцніший. Для шаф — плівка бюджетна, шпон — преміум."
  },
  {
    question: "Чи робите ви монтаж і підключення техніки?",
    answer: "Ми встановлюємо меблі та врізаємо техніку «під ключ». Монтаж входить у вартість. Середній час — кухня 1-2 дні, шафа 3-5 годин. Підключення варочної поверхні та духовки — безкоштовно."
  },
  {
    question: "Чи можна змінити проєкт після підписання договору?",
    answer: "Так, до моменту закупівлі матеріалів можна вносити зміни безкоштовно. Після початку виробництва — можливі незначні зміни (колір фурнітури, ручки). Зміни корпусу після розкрою — обговорюються окремо."
  },
  {
    question: "Як відбувається оплата?",
    answer: "Зазвичай 70% передоплата, 30% після встановлення. Для постійних клієнтів та великих проектів — гнучкі умови: 30/40/30. Оплата готівкою, на карту або на розрахунковий рахунок ФОП."
  },
  {
    question: "Чи працюєте ви в області?",
    answer: "Так, виїжджаємо по всьому регіону — Бровари, Бориспіль, Вишгород, Ірпінь, Буча. Доставка за місто — 15-25 грн/км. Монтаж проводимо в будь-якій точці Київської області."
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
