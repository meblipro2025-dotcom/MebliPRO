export const dynamic = 'force-dynamic';

"use client";

import { motion } from "framer-motion";
import { MoveRight, Home, Layout, Sofa, Monitor, Box, Brush, ChefHat, BedDouble, Table2, Baby, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Service {
  id: string;
  title: string;
  desc: string;
  bg: string;
  slug: string;
  icon: React.ElementType;
}

const services: Service[] = [
  {
    id: "1",
    title: "Кухонні Меблі",
    desc: "Індивідуальні кухонні гарнітури, острови та високі шафи з системами зберігання. Преміум фурнітура Blum та Hettich.",
    bg: "/images/kitchen_modern.png",
    slug: "kukhni",
    icon: ChefHat,
  },
  {
    id: "2",
    title: "Шафи та Гардеробні",
    desc: "Шафи-купе, гардеробні, пенали та платтяні кімнати з максимальним використанням простору.",
    bg: "/images/wardrobe_builtin.png",
    slug: "shafi",
    icon: Layout,
  },
  {
    id: "3",
    title: "Ліжка-Трансформери",
    desc: "Система 3-в-1: ліжко + шафа + диван. Ідеальне рішення для маленьких квартир та студій.",
    bg: "/images/transformer1.jpg",
    slug: "lizhka-transformery",
    icon: BedDouble,
  },
  {
    id: "4",
    title: "Підвісні Столи",
    desc: "Компактні столи-трансформери, що складаються в полицю. Економія простору на кухні та в офісі.",
    bg: "/images/471500883.webp",
    slug: "pidvisni-stoly",
    icon: Table2,
  },
  {
    id: "5",
    title: "Дитячі Кімнати",
    desc: "Комплексні рішення під ключ: ліжка-горища, робочі зони, ігрові майданчики з безпечних матеріалів.",
    bg: "/images/children_room.png",
    slug: "dityachi-kimnaty",
    icon: Baby,
  },
  {
    id: "6",
    title: "Офісні Приміщення",
    desc: "Офісні меблі преміум-класу: столи, шафи для документів, ресепшени, системи зберігання.",
    bg: "/images/office_desk.png",
    slug: "ofisni-mebli",
    icon: Monitor,
  },
  {
    id: "7",
    title: "Вироби зі Скла",
    desc: "Скляні полиці, дзеркала, душові кабіни, міжкімнатні перегородки. Індивідуальні розміри.",
    bg: "/images/luxury_kitchen.png",
    slug: "vyroby-zi-skla",
    icon: Box,
  },
  {
    id: "8",
    title: "Стільниці",
    desc: "Кухонні та офісні стільниці з кварцу, акрилу, масиву дерева. Будь-які розміри та форми.",
    bg: "/images/kitchen_island.png",
    slug: "stilnytsi",
    icon: Sofa,
  },
  {
    id: "9",
    title: "Розсувні Системи",
    desc: "Розсувні двері купе, перегородки, фасадні системи. Преміум механізми з доводчиками.",
    bg: "/images/closet_white.png",
    slug: "rozsuvni-systemy",
    icon: HelpCircle,
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Головна</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">Послуги</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-heading text-white mb-4"
          >
            Наші <span className="text-[#D4AF37]">Послуги</span>
          </motion.h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Виготовляємо меблі на замовлення будь-якої складності. Від ідеї до встановлення — повний цикл робіт.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative h-[280px] md:h-[320px] overflow-hidden bg-[#141414] border border-white/10 rounded-xl cursor-pointer"
            >
              <div className="absolute inset-0">
                <Image
                  src={service.bg}
                  alt={service.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[#D4AF37] text-xs uppercase tracking-wider font-medium">
                    Послуга #{service.id}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-heading text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {service.desc}
                </p>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  Детальніше <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-zinc-400 mb-6">
            Не знайшли потрібну послугу? Ми виготовляємо будь-які меблі на замовлення!
          </p>
          <Link
            href="/#calculator"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#e5c248] transition-colors"
          >
            Отримати консультацію <MoveRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
