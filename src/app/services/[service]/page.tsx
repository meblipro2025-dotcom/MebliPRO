"use client";

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
    category: "kitchen",
    description: "Виготовляємо кухні будь-якої складності від простих прямих до складних острівних рішень. Працюємо з усіма матеріалами: ЛДСП, МДФ, шпон, пластик, акрил. Особлива спеціалізація — фарбовані фасади преміум-класу.",
    features: [
      "3D-проєктування кухні безкоштовно",
      "Преміум фурнітура Blum та Hettich з довічною гарантією",
      "Стільниці з кварцу, акрилу, масиву",
      "Вбудована та окремо стояча техніка",
      "Підсвітка робочої зони LED",
      "Гарантія на корпус 10 років"
    ],
    materials: ["ЛДСП Egger", "МДФ фарбований", "Пластик HPL", "Акрил", "Шпон", "Кварцові стільниці"],
    image: "/images/kitchen_modern.png"
  },
  shafi: {
    title: "Шафи та Гардеробні",
    category: "wardrobe",
    description: "Проєктуємо системи зберігання під ваш простір та потреби. Від компактних шаф-купе до великих гардеробних кімнат. Розраховуємо оптимальне наповнення: висувні штанги, кошики, полиці, тумбочки.",
    features: [
      "Шафи-купе з дзеркалами та піскоструєм",
      "Розпашні шафи з фрезерованими фасадами",
      "Вбудовані гардеробні системи",
      "Розсувні системи з доводчиками",
      "Підсвітка всередині шафи",
      "Професійний замір та монтаж"
    ],
    materials: ["ДСП", "Дзеркало", "Піскоструй", "МДФ фарба", "Шпон дуба"],
    image: "/images/wardrobe_builtin.png"
  },
  "lizhka-transformery": {
    title: "Ліжка-Трансформери",
    category: "bed",
    description: "Ідеальне рішення для маленьких квартир та студій. Система 3-в-1: повноцінне ліжко, шафа та диван в одному. Економія простору до 40% з комфортом на рівні звичайних меблів.",
    features: [
      "Система 3-в-1: ліжко + шафа + диван",
      "Газові амортизатори для легкого відкривання",
      "Ортопедичне ложе з ламелями",
      "Безпечні механізми з фіксацією",
      "Дизайн під інтер'єр кімнати",
      "Можливість вбудованого LED-підсвітки"
    ],
    materials: ["ЛДСП 18 мм", "Металевий каркас", "Ортопедичні ламелі", "Якісна фурнітура"],
    image: "/images/transformer1.jpg"
  },
  "pidvisni-stoly": {
    title: "Підвісні Столи",
    category: "tables",
    description: "Компактні рішення для кухонь та офісів з обмеженим простором. Столи-трансформери складаються в полицю або висуваються з тумби. Ідеально для кварир-студій.",
    features: [
      "Стіл складається в полицю",
      "Настінне кріплення без ніжок",
      "Витримує навантаження до 100 кг",
      "Розміри під ваш простір",
      "Сучасний мінімалістичний дизайн",
      "Можливість колірного рішення"
    ],
    materials: ["ЛДСП", "Металевий каркас", "Кріплення європейської якості"],
    image: "/images/471500883.webp"
  },
  "dityachi-kimnaty": {
    title: "Дитячі Кімнати",
    category: "children",
    description: "Комплексні рішення для дітей будь-якого віку. Враховуємо потреби дитини: ігрова зона, місце для навчання, зберігання іграшок, спальне місце. Використовуємо тільки безпечні матеріали.",
    features: [
      "Ліжка-горища з робочою зоною знизу",
      "Безпечні матеріали (емісія E0-E1)",
      "Заокруглені кути та ручки",
      "Яскраві кольори під захоплення дитини",
      "Зберігання іграшок та книжок",
      "Можливість 'дорослішання' меблів"
    ],
    materials: ["Еко-ДСП", "Безпечна фарба", "М'які матеріали", "Якісна фурнітура"],
    image: "/images/children_room.png"
  },
  "ofisni-mebli": {
    title: "Офісні Приміщення",
    category: "office",
    description: "Створюємо комфортні робочі простори для офісів будь-якого масштабу. Від домашнього кабінету до open-space. Ергономіка, функціональність та стиль — основні принципи.",
    features: [
      "Письмові столи з кабель-менеджментом",
      "Шафи для документів з замками",
      "Ресепшени та зони очікування",
      "Переговорні кімнати під ключ",
      "Системи зберігання для архівів",
      "Швидкі терміни виготовлення"
    ],
    materials: ["ЛДСП", "МДФ фарба", "Метал", "Скло", "Шпон"],
    image: "/images/office_desk.png"
  },
  "vyroby-zi-skla": {
    title: "Вироби зі Скла",
    category: "glass",
    description: "Виготовляємо скляні вироби будь-якої складності. Душові кабіни, міжкімнатні перегородки, скляні полиці, дзеркала. Використовуємо загартоване скло для безпеки.",
    features: [
      "Душові кабіни будь-якої конфігурації",
      "Міжкімнатні скляні перегородки",
      "Скляні полиці та стелажі",
      "Дзеркала з фацетом",
      "Піскоструйний малюнок на склі",
      "Фарбування скла в будь-який колір"
    ],
    materials: ["Загартоване скло 8-10 мм", "Фурнітура для скла", "Піскоструйна обробка"],
    image: "/images/luxury_kitchen.png"
  },
  stilnytsi: {
    title: "Стільниці",
    category: "countertops",
    description: "Виготовляємо стільниці для кухонь, ванних кімнат та офісів. Працюємо з кварцом, акрилом, масивом дерева. Будь-які форми: прямі, кутові, з вирізами під мийку.",
    features: [
      "Кварцові стільниці преміум-класу",
      "Акрилові безшовні стільниці",
      "Масив дерева (дуб, ясен, горіх)",
      "Вирізи під мийку та варочну панель",
      "Підгонка на місці",
      "Гарантія на кварц 15 років"
    ],
    materials: ["Кварц Caesarstone", "Акрил LG", "Масив дуба", "Масив ясеня"],
    image: "/images/kitchen_island.png"
  },
  "rozsuvni-systemy": {
    title: "Розсувні Системи",
    category: "sliding",
    description: "Професійні розсувні системи для шаф, перегородок та фасадів. Використовуємо якісну фурнітуру з доводчиками для безшумного та м'якого закривання.",
    features: [
      "Розсувні двері купе",
      "Скляні розсувні перегородки",
      "Доводчики для м'якого закривання",
      "Синхронний механізм відкривання",
      "Наповнення на замовлення",
      "Монтаж на будь-які поверхні"
    ],
    materials: ["Алюмінієві профілі", "Фурнітура Hettich", "Фурнітура Muller", "Ролики premium"],
    image: "/images/closet_white.png"
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
          <Link href="/#services" className="hover:text-[#D4AF37] transition-colors">Послуги</Link>
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
            href="/#services"
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
