"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-luxury p-8 md:p-16 border border-white/5 relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="text-8xl font-heading text-[#D4AF37]">M-PRO</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading text-white mb-8 tracking-tighter">Умови <span className="text-metallic-gold">Використання</span></h1>
            
            <div className="space-y-10 text-zinc-400 font-light leading-relaxed">
              <section>
                <p className="text-sm font-medium text-[#D4AF37] mb-2 uppercase tracking-widest">Останнє оновлення: 05 Квітня 2026</p>
                <p>Ці Умови використання регулюють ваші відносини з веб-сайтом Mebli-PRO (далі — «Сайт») та послугами, які надає ФОП Олександр (далі — «Майстер»). Будь ласка, уважно прочитайте цей документ перед використанням Сайту.</p>
              </section>

              <div className="h-[1px] w-full bg-white/5" />

              <section className="space-y-4">
                <h2 className="text-2xl font-heading text-white">1. Предмет договору</h2>
                <p>Mebli-PRO надає послуги з індивідуального проектування, виготовлення, доставки та монтажу корпусних меблів. Використання онлайн-калькулятора або форми зворотного зв’язку на Сайті є попереднім ознайомленням і не вважається укладенням договору купівлі-продажу.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-heading text-white">2. Порядок прорахунку вартості</h2>
                <p>Всі ціни, отримані через онлайн-калькулятор на Сайті, є <b>орієнтовними</b>. Остаточна вартість виробу фіксується виключно в офіційному Договорі після проведення точного виміру приміщення та вибору конкретних декорів плити та моделей фурнітури.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-heading text-white">3. Виїзд на замір</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Виїзд на замір у межах м. Київ здійснюється безкоштовно за умови подальшого замовлення виробу.</li>
                  <li>У разі відмови від замовлення після заміру, клієнт оплачує консультаційні послуги та транспортні витрати у розмірі 500 грн.</li>
                  <li>Виїзд по Київській області обговорюється індивідуально.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-heading text-white">4. Оплата та терміни</h2>
                <p>Терміни виготовлення зазвичай становлять від 14 до 45 робочих днів. Розрахунок здійснюється згідно з погодженим графіком платежів, зазначеним у Договорі. Mebli-PRO несе повну відповідальність за дотримання термінів, вказаних у специфікації.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-heading text-white">5. Відмова від відповідальності</h2>
                <p>Майстер не несе відповідальності за неточність даних, наданих Клієнтом самостійно через форми Сайту без професійного заміру. Кольори та текстури на екрані можуть відрізнятися від реальних зразків матеріалів.</p>
              </section>

              <div className="h-[1px] w-full bg-white/5" />

              <section className="pt-8 text-center border-t border-white/5">
                <p className="text-zinc-500 text-sm">Використовуючи цей сайт, ви погоджуєтесь з даними умовами. <br /> У разі виникнення питань, звертайтесь за телефоном: +380 93 143 18 43</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
