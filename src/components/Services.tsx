"use client";

import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/context/SiteContext";

interface Service {
  id: string;
  title: string;
  desc: string;
  bg: string;
  slug: string;
  category: string;
}

export default function Services() {
  const settings = useSiteSettings();
  
  const defaultServices: Service[] = [
    {
      id: "1",
      title: "Кухонні Меблі",
      desc: "Індивідуальні кухонні гарнітури («МДФ фарба», «МДФ плівка», дерево) з преміум фурнітурою Blum/Hettich.",
      bg: "/images/kitchen_modern.png",
      slug: "kukhni",
      category: "Кухні",
    },
    {
      id: "2",
      title: "Шафи та Гардеробні",
      desc: "Вбудовані рішення: шафи-купе, гардеробні кімнати, розпашні системи «до стелі».",
      bg: "/images/wardrobe_builtin.png",
      slug: "shafi",
      category: "Шафи",
    },
    {
      id: "3",
      title: "Ліжка-Трансформери",
      desc: "Багатофункціональні системи 3-в-1 для смарт-квартир: Ліжко + Шафа + Диван.",
      bg: "/images/transformer1.jpg",
      slug: "lizhka-transformery",
      category: "Трансформери",
    },
    {
      id: "4",
      title: "Підвісні Столи",
      desc: "Компактні столи-трансформери, що складаються в стильну полицю, звільняючи простір.",
      bg: "/images/471500883.webp",
      slug: "pidvisni-stoly",
      category: "Трансформери",
    },
    {
      id: "5",
      title: "Дитячі Кімнати",
      desc: "ЕКО-матеріали та безпечний дизайн для дітей: ліжка, робочі зони та шафи.",
      bg: "/images/children_room.png",
      slug: "dityachi-kimnaty",
      category: "Дитячі",
    },
    {
      id: "6",
      title: "Офісні Меблі",
      desc: "Робочі місця, кабінети та ресепшени для вашого бізнесу за індивідуальними розмірами.",
      bg: "/images/office_desk.png",
      slug: "ofisni-mebli",
      category: "Інше",
    },
    {
      id: "7",
      title: "Меблі для ванних",
      desc: "Вологостійкі тумби, стільниці та пенали з кварцу чи фарбованого МДФ.",
      bg: "/images/living_room_tv.png",
      slug: "mebli-dlya-vannikh",
      category: "Інше",
    },
    {
      id: "8",
      title: "Вітальні та ТВ-зони",
      desc: "Сучасні меблі для відпочинку: ТВ-тумби, вітрини та декоративні стінні панелі.",
      bg: "/images/kitchen_island.png",
      slug: "vitalni",
      category: "Інше",
    },
    {
      id: "9",
      title: "Реставрація меблів",
      desc: "Оновлення ваших меблів: заміна фасадів, фурнітури та відновлення вигляду.",
      bg: "/images/luxury_kitchen.png",
      slug: "restoration",
      category: "Реставрація",
    },
  ];
  
  const services: Service[] = settings.services.length > 0 
    ? settings.services.map((s, idx) => ({ 
        ...s, 
        id: s.id || String(idx + 1),
        slug: s.slug || s.title.toLowerCase().replace(/\s+/g, '-'),
        category: s.category || 'other'
      })) as Service[]
    : defaultServices;

  return (
    <section id="services" className="relative py-10 md:py-24 lg:py-32 px-4 md:px-6 z-10">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-20 gap-4 md:gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="h-[1px] w-8 bg-[#D4AF37]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium">Наші Компетенції</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-heading text-white tracking-tight"
            >
              Створюємо Меблі <br />
              <span className="text-[#D4AF37] italic">Преміум-Класу</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-zinc-400 max-w-sm font-light text-sm leading-relaxed"
          >
            Від класичних шаф до складних індивідуальних рішень — ми працюємо з усіма видами корпусних меблів, використовуючи лише якісні матеріали.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-none border border-white/10 bg-[#0a0a0a] aspect-[4/3] sm:aspect-[16/10]"
            >
              <Image 
                src={service.bg} 
                alt={service.title} 
                fill 
                className="object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-in-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="text-xl md:text-2xl font-heading text-white mb-2 tracking-tight">{service.title}</h3>
                  <p className="text-sm font-light text-zinc-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                    {service.desc}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] hover:translate-x-1 transition-all duration-300"
                  >
                    Детальніше <MoveRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
