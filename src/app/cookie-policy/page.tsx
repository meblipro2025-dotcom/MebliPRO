"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
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
            <h1 className="text-3xl md:text-4xl font-heading text-white mb-8">Політика <span className="text-metallic-gold">Файлів Cookie</span></h1>
            
            <div className="space-y-6 text-sm font-light leading-relaxed text-zinc-300">
              <section>
                <h2 className="text-lg font-medium text-white mb-3">Що ми використовуємо</h2>
                <p>Наш сайт використовує сесійні та аналітичні файли Cookie для покращення вашого досвіду. Це невеликі текстові файли, які зберігаються на вашому пристрої. Ви можете відключити їх у налаштуваннях браузеру в будь-який момент.</p>
              </section>
              
              <section>
                <h2 className="text-lg font-medium text-white mb-3">Типи Cookie</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Необхідні</strong> — для коректної роботи сайту</li>
                  <li><strong className="text-white">Аналітичні</strong> — для розуміння відвідуваності (Umami Analytics)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-medium text-white mb-3">Як відключити</h2>
                <p>Ви можете відключити Cookie у налаштуваннях вашого браузера. Зверніть увагу, що деякі функції сайту можуть працювати некоректно без Cookie.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
