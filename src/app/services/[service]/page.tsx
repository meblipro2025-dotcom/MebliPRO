"use client";

export const dynamic = 'force-dynamic';

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Phone } from "lucide-react";

const servicesData: Record<string, {
  title: string;
  category: string;
  description: string;
  features: string[];
  materials: string[];
  image: string;
}> = {
  kukhni: {
    title: "Кухонні Меблі",
    category: "Кухні",
    description: "Індивідуальні кухонні гарнітури будь-якої складності. Ми створюємо ергономічні кухні з використанням фарбованого МДФ, шпону та найкращої фурнітури.",
    features: [
      "Безкоштовний 3D-проєкт",
      "Фурнітура Blum та Hettich",
      "Стільниці з кварцу та акрилу",
      "Врізка та встановлення техніки",
      "Гарантія на механізми 5 років"
    ],
    materials: ["Фарбований МДФ", "Шпон", "ЛДСП Egger", "Кварцовий агломерат"],
    image: "/images/kitchen_modern.png"
  },
  shafi: {
    title: "Шафи та Гардеробні",
    category: "Шафи",
    description: "Професійне проєктування систем зберігання: від невеликих вбудованих шаф до просторих гардеробних кімнат.",
    features: [
      "Розсувні системи з доводчиками",
      "Продумане внутрішнє наповнення",
      "Дзеркальні та комбіновані фасади",
      "Монтаж під саму стелю",
      "Використання алюмінієвих профілів"
    ],
    materials: ["Дзеркало", "Скло", "ДСП", "МДФ", "Алюміній"],
    image: "/images/wardrobe_builtin.png"
  },
  "lizhka-transformery": {
    title: "Ліжка-Трансформери",
    category: "Трансформери",
    description: "Найкраще рішення для економії простору. Повноцінне ліжко з ортопедичним матрацом, яке ховається в шафу.",
    features: [
      "Механізм 3-в-1: Ліжко + Диван + Шафу",
      "Газові амортизатори (Італія)",
      "Ортопедична ламельна основа",
      "Фіксація матраца ременями",
      "Безпечне використання для дітей"
    ],
    materials: ["Металевий каркас", "ЛДСП 18мм", "Тканина преміум"],
    image: "/images/transformer1.jpg"
  },
  "pidvisni-stoly": {
    title: "Підвісні Столи",
    category: "Трансформери",
    description: "Компактні робочі місця та обідні столи, що кріпляться до стіни і не мають ніжок.",
    features: [
      "Легке складання за 5 секунд",
      "Надійна металева конструкція",
      "Економія 2 м² площі",
      "Стильний дизайн у складеному вигляді",
      "Ідеально для смарт-кухонь"
    ],
    materials: ["МДФ", "Металевий кронштейн", "Полімерне покриття"],
    image: "/images/471500883.webp"
  },
  "dityachi-kimnaty": {
    title: "Дитячі Кімнати",
    category: "Дитячі",
    description: "Меблі, що ростуть разом з вашою дитиною. Висока увага до безпеки, кутів та екологічності матеріалів.",
    features: [
      "Заокруглені торці",
      "Екологічні матеріали E0",
      "Стійкість до подряпин",
      "Яскравий сучасний дизайн",
      "Оптимізація ігрової зони"
    ],
    materials: ["Еко-МДФ", "Натуральне дерево", "Якісний пластик"],
    image: "/images/children_room.png"
  },
  "ofisni-mebli": {
    title: "Офісні Меблі",
    category: "Інше",
    description: "Функціональні рішення для бізнесу та домашнього кабінету. Столи, стелажі та зони ресепшн.",
    features: [
      "Ергономічні робочі місця",
      "Приховані кабель-канали",
      "Стильні зони очікування",
      "Зносостійкі покриття",
      "Швидкі терміни виготовлення"
    ],
    materials: ["Метал", "ЛДСП преміум", "Скло", "Шпон"],
    image: "/images/office_desk.png"
  },
  "mebli-dlya-vannikh": {
    title: "Меблі для ванних",
    category: "Інше",
    description: "Вологостійкі меблі для ванної кімнати, що не розбухають від пари та води.",
    features: [
      "Абсолютна вологостійкість",
      "Навісні конструкції",
      "Стільниці під умивальник-чашу",
      "Фурнітура зі спецпокриттям",
      "Сховане зберігання комунікацій"
    ],
    materials: ["Кварцовий камінь", "Фарбований МДФ (PUR-кромка)", "Нержавійка"],
    image: "/images/living_room_tv.png"
  },
  vitalni: {
    title: "Вітальні та ТВ-зони",
    category: "Інше",
    description: "Центральне місце вашої оселі. Сучасні ТВ-стінки, підвісні тумби та декоративні рейки.",
    features: [
      "Мінімалістичний дизайн",
      "Приховане прокладання дротів",
      "Інтегроване LED-підсвічування",
      "Зона для PS/Xbox",
      "Фрезерування фасадів"
    ],
    materials: ["МДФ", "Декоративні рейки", "Скло", "LED-профіль"],
    image: "/images/kitchen_island.png"
  },
  restoration: {
    title: "Реставрація меблів",
    category: "Реставрація",
    description: "Професійне відновлення та модернізація ваших меблів. Від заміни роликів до перефарбування кухонних фасадів.",
    features: [
      "Повна заміна фурнітури",
      "Оновлення кольору фасадів",
      "Видалення подряпин та сколів",
      "Ремонт розсувних систем",
      "Друге життя ваших меблів"
    ],
    materials: ["Професійні лаки", "Нова фурнітура", "МДФ фасади"],
    image: "/images/luxury_kitchen.png"
  }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceSlug = params.service as string;
  const service = servicesData[serviceSlug];

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-white mb-4">Послугу не знайдено</h1>
          <Link href="/" className="text-[#D4AF37] hover:underline">Повернутися на головну</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Головна</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#D4AF37] transition-colors">Послуги</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">{service.title}</span>
        </nav>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-heading text-white mb-6">
              {service.title}
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              {service.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href={`/portfolio?category=${service.category}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#e5c248] transition-colors"
              >
                Переглянути приклади робіт <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/#calculator"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-bold rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
              >
                <Phone className="w-4 h-4" /> Замовити консультацію
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden"
          >
            <Image
              src={service.image}
              alt={`${service.title} — меблі на замовлення Київ, MEBLI-PRO`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-heading text-white mb-6 flex items-center gap-2">
              <Check className="w-5 h-5 text-[#D4AF37]" /> 
              Що ми пропонуємо
            </h2>
            <ul className="space-y-3">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-zinc-400">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-heading text-white mb-6">
              Матеріали
            </h2>
            <div className="flex flex-wrap gap-2">
              {service.materials.map((material, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-sm rounded-full"
                >
                  {material}
                </span>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-lg">
              <p className="text-sm text-zinc-400">
                <strong className="text-white">Безкоштовний замір</strong> на Лівому березі Києва (Троєщина, Дарниця, Позняки, Лісовий)
              </p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <Link 
            href="/services"
            className="flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 
            Повернутися до всіх послуг
          </Link>
          <Link 
            href={`/portfolio?category=${service.category}`}
            className="text-[#D4AF37] hover:underline"
          >
            Дивитись роботи категорії →
          </Link>
        </div>
      </div>
    </main>
  );
}
