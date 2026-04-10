"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-32 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-luxury p-8 md:p-12 border border-white/5"
          >
            <h1 className="text-3xl md:text-4xl font-heading text-white mb-8">Політика <span className="text-metallic-gold">Конфіденційності</span></h1>
            
            <div className="space-y-6 text-sm font-light leading-relaxed text-zinc-300">
              <p className="text-zinc-500 italic">Останнє оновлення: 05 квітня 2026 року</p>
              
              <section>
                <h2 className="text-lg font-medium text-white mb-3">1. Загальні положення</h2>
                <p>Ця Політика розроблена відповідно до Закону України «Про захист персональних даних». Вона визначає порядок збору, зберігання та обробки даних користувачів сайту Mebli-PRO.</p>
              </section>

              <section>
                <h2 className="text-lg font-medium text-white mb-3">2. Які дані ми збираємо</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ім&#39;я та контактний номер телефону;</li>
                  <li>Технічні файли (фото ніш, креслення), які ви завантажуєте;</li>
                  <li>Дані файлів Cookie для аналітики відвідуваності.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-medium text-white mb-3">3. Мета обробки даних</h2>
                <p>Ваші дані використовуються виключно для надання консультацій, попереднього розрахунку вартості меблів та укладання договору на виготовлення продукції.</p>
              </section>

              <section>
                <h2 className="text-lg font-medium text-white mb-3">4. Ваші права</h2>
                <p>Ви маєте право знати, де зберігаються ваші дані, вимагати їх зміну або повне видалення з нашої бази за запитом на email: meblipro2025@gmail.com.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
