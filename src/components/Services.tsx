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
      desc: "Індивідуальні кухонні гарнітури, острови та високі шафи з системами зберігання. Преміум фурнітура Blum та Hettich.",
      bg: "/images/kitchen_modern.png",
      slug: "kukhni",
      category: "kitchen",
    },
    {
      id: "2",
      title: "Шафи та Гардеробні",
      desc: "Шафи-купе, гардеробні, пенали та платтяні кімнати з максимальним використанням простору.",
      bg: "/images/wardrobe_builtin.png",
      slug: "shafi",
      category: "wardrobe",
    },
    {
      id: "3",
      title: "Ліжка-Трансформери",
      desc: "Система 3-в-1: ліжко + шафа + диван. Ідеальне рішення для маленьких квартир та студій.",
      bg: "/images/transformer1.jpg",
      slug: "lizhka-transformery",
      category: "bed",
    },
    {
      id: "4",
      title: "Підвісні Столи",
      desc: "Компактні столи-трансформери, що складаються в полицю. Економія простору на кухні та в офісі.",
      bg: "/images/471500883.webp",
      slug: "pidvisni-stoly",
      category: "tables",
    },
    {
      id: "5",
      title: "Дитячі Кімнати",
      desc: "Комплексні рішення під ключ: ліжка-горища, робочі зони, ігрові майданчики з безпечних матеріалів.",
      bg: "/images/children_room.png",
      slug: "dityachi-kimnaty",
      category: "children",
    },
    {
      id: "6",
      title: "Офісні Приміщення",
      desc: "Офісні меблі преміум-класу: столи, шафи для документів, ресепшени, системи зберігання.",
      bg: "/images/office_desk.png",
      slug: "ofisni-mebli",
      category: "office",
    },
    {
      id: "7",
      title: "Вироби зі Скла",
      desc: "Скляні полиці, дзеркала, душові кабіни, міжкімнатні перегородки. Індивідуальні розміри.",
      bg: "/images/luxury_kitchen.png",
      slug: "vyroby-zi-skla",
      category: "glass",
    },
    {
      id: "8",
      title: "Стільниці",
      desc: "Кухонні та офісні стільниці з кварцу, акрилу, масиву дерева. Будь-які розміри та форми.",
      bg: "/images/kitchen_island.png",
      slug: "stilnytsi",
      category: "countertops",
    },
    {
      id: "9",
      title: "Розсувні Системи",
      desc: "Розсувні двері купе, перегородки, фасадні системи. Преміум механізми з доводчиками.",
      bg: "/images/closet_white.png",
      slug: "rozsuvni-systemy",
      category: "sliding",
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
              className="text-3xl md:text-4xl lg:text-6xl font-heading text-white tracking-tight"
            >
              Формуємо Простір <br />
              <span className="text-metallic-gold italic">Вашого Життя</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-zinc-400 max-w-sm font-light text-sm leading-relaxed"
          >
            Від класичних шаф до складних індивідуальних рішень — ми працюємо з усіма видами корпусних меблів, використовуючи ДСП, МДФ, шпон, скло та метал.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="group relative overflow-hidden rounded-none border border-white/10 bg-[#0a0a0a] aspect-[4/3] sm:aspect-[16/10]"
            >
              <Image 
                src={service.bg} 
                alt={service.title} 
                fill 
                className="object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-in-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 md:translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-heading text-white mb-2 md:mb-3 tracking-tight">{service.title}</h3>
                  <p className="text-sm font-light text-zinc-300 leading-relaxed mb-4 md:mb-6 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 md:line-clamp-none">
                    {service.desc}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={(e) => console.log('Navigating to:', `/services/${service.slug}`)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] opacity-100 transition-all duration-500 cursor-pointer hover:scale-105 z-20 relative"
                  >
                    Детальніше <MoveRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
