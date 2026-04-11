"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Home, Layout, Brush, Sofa, Monitor, Box, ZoomIn, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface GalleryProject {
  id: string;
  title: string;
  category: string;
  materials: string;
  image: string;
}

const categories = [
  { id: "all", name: "Всі роботи", icon: LayoutGrid },
  { id: "kitchen", name: "Кухні", icon: Home },
  { id: "wardrobe", name: "Шафи / Гардеробні", icon: Layout },
  { id: "living", name: "Вітальня / Спальня", icon: Sofa },
  { id: "tables", name: "Столи", icon: Monitor },
  { id: "hallway", name: "Передпокій", icon: Box },
  { id: "children", name: "Дитячі меблі", icon: Home },
  { id: "restoration", name: "Реставрація", icon: Brush },
];

// 25+ демо-робіт для gallery
const demoProjects: GalleryProject[] = [
  { id: "1", title: "Кухня Матова", category: "kitchen", materials: "МДФ фарба матова, стільниця кварц", image: "/images/luxury_kitchen.png" },
  { id: "2", title: "Шафа-купе Дзеркало", category: "wardrobe", materials: "Дзеркало, піскоструй, ДСП", image: "/images/closet_white.png" },
  { id: "3", title: "Вітальня Глянець", category: "living", materials: "Глянцеві фасади, LED-підсвітка", image: "/images/modern_kitchen.png" },
  { id: "4", title: "Кухня Острів", category: "kitchen", materials: "Острівна кухня, камінь", image: "/images/kitchen_island.png" },
  { id: "5", title: "Дитяча Кольорова", category: "children", materials: "Еко-фарба, м'які кути", image: "/images/kids_furniture.png" },
  { id: "6", title: "Передпокій Дзеркало", category: "hallway", materials: "Шухляди, дзеркало в повний зріст", image: "/images/entryway_mirror.png" },
  { id: "7", title: "Стіл Офісний", category: "tables", materials: "Дуб, металеві ніжки", image: "/images/office_desk.png" },
  { id: "8", title: "Реставрація Шафи", category: "restoration", materials: "Відновлення антикваріату", image: "/images/restoration_wardrobe.png" },
  { id: "9", title: "Кухня Дерево", category: "kitchen", materials: "Масив дуба, фарбовані фасади", image: "/images/kitchen_wood.png" },
  { id: "10", title: "Гардеробна Класик", category: "wardrobe", materials: "Висувні системи, підсвітка", image: "/images/walk_in_closet.png" },
  { id: "11", title: "Спальня Комплект", category: "living", materials: "Ліжко, тумби, комод", image: "/images/bedroom_set.png" },
  { id: "12", title: "Кухня Лофт", category: "kitchen", materials: "Бетон, дерево, метал", image: "/images/kitchen_loft.png" },
  { id: "13", title: "Шафа Розпашна", category: "wardrobe", materials: "Розпашні двері, фрезерування", image: "/images/swing_wardrobe.png" },
  { id: "14", title: "Дитяча Ліжко-горище", category: "children", materials: "Ліжко на другому рівні, робоча зона", image: "/images/bunk_bed.png" },
  { id: "15", title: "Стіл Трансформер", category: "tables", materials: "Розкладний, компактний", image: "/images/471500883.webp" },
  { id: "16", title: "Кухня Мінімал", category: "kitchen", materials: "Без ручок, інтегрована техніка", image: "/images/kitchen_minimal.png" },
  { id: "17", title: "Передпокій Тумби", category: "hallway", materials: "Взуттєва шафа, вішалка", image: "/images/entryway_cabinets.png" },
  { id: "18", title: "ТВ-Зона", category: "living", materials: "Полиця для ТВ, зберігання", image: "/images/tv_unit.png" },
  { id: "19", title: "Кухня Під Вікно", category: "kitchen", materials: "Вбудована під підвіконня", image: "/images/kitchen_window.png" },
  { id: "20", title: "Шафа Купе Кольорова", category: "wardrobe", materials: "Кольорові вставки", image: "/images/color_wardrobe.png" },
  { id: "21", title: "Ліжко з Ящиками", category: "living", materials: "Підйомний механізм, ящики", image: "/images/storage_bed.png" },
  { id: "22", title: "Кухня Кутова", category: "kitchen", materials: "Г-подібна планування", image: "/images/kitchen_corner.png" },
  { id: "23", title: "Стіл Кухонний", category: "tables", materials: "Розсувний, 6-8 місць", image: "/images/dining_table.png" },
  { id: "24", title: "Дитяча Стіл+Шафа", category: "children", materials: "Комплект меблів", image: "/images/kids_room.png" },
  { id: "25", title: "Реставрація Столу", category: "restoration", materials: "Шліфування, лакування", image: "/images/table_restore.png" },
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        const dbProjects = (data || []).map((item: { id: string; title: string; category?: string; materials: string; image_urls?: string[] }) => ({
          id: item.id,
          title: item.title,
          category: item.category || "all",
          materials: item.materials,
          image: Array.isArray(item.image_urls) && item.image_urls.length > 0 ? item.image_urls[0] : "/images/luxury_kitchen.png",
        }));
        // Якщо з БД мало даних — додаємо демо
        setProjects(dbProjects.length > 5 ? dbProjects : [...dbProjects, ...demoProjects.slice(0, 25 - dbProjects.length)]);
      } catch (err) {
        console.error("Помилка завантаження галереї:", err);
        setProjects(demoProjects);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = activeTab === "all" 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  // Показуємо тільки перші 6 на головній
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);
  const hasMore = filteredProjects.length > 6;

  return (
    <section id="portfolio" className="relative py-10 md:py-24 lg:py-32 px-4 md:px-6 z-10 glass-dark">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Портфоліо</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading mb-6 text-white tracking-tight"
          >
            Наші <span className="text-metallic-gold italic">Роботи</span>
          </motion.h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            Реалізовані за індивідуальними розмірами на Лівому березі Києва. 
            <strong className="text-[#D4AF37]"> {projects.length}+ проєктів</strong> — від ідеї до втілення.
          </p>
        </div>

        {/* Filters — scrollable on mobile */}
        <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:justify-center gap-2 md:gap-3 mb-12 max-w-4xl mx-auto pb-4 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setShowAll(false); }}
              className={`flex items-center gap-2 px-4 md:px-5 py-2.5 border transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === cat.id 
                ? "bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
                : "bg-transparent border-white/5 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              <cat.icon className={`w-3.5 h-3.5 ${activeTab === cat.id ? "text-[#D4AF37]" : ""}`} />
              <span className="text-[10px] tracking-widest uppercase font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative h-[300px] sm:h-[350px] md:h-[450px] overflow-hidden bg-[#0a0a0a] border border-white/10 cursor-pointer"
                onClick={() => setLightboxImage(project.image)}
              >
                <div className="absolute inset-0">
                  <Image 
                    src={project.image}
                    alt={`${project.title} — ${categories.find(c => c.id === project.category)?.name || 'Меблі'} на замовлення в Києві, Лівий берег — MEBLI-PRO`}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[#D4AF37] text-[9px] uppercase font-bold tracking-[0.2em] block mb-3 opacity-90">
                        {categories.find(c => c.id === project.category)?.name}
                      </span>
                      <h3 className="text-xl md:text-2xl font-heading mb-2 text-white tracking-tight">{project.title}</h3>
                      <p className="text-zinc-300 text-xs font-light line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{project.materials}</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 glass-dark border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-all text-[#D4AF37] shrink-0">
                      <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen pointer-events-none z-10" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        {hasMore && !showAll && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              href="/portfolio"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-wider rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group"
            >
              <span>Показати всі {filteredProjects.length} робіт</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}

        {/* Show more on current page (if not going to separate page) */}
        {hasMore && showAll && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAll(false)}
              className="text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              Показати менше
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-4xl h-[80vh]">
              <Image 
                src={lightboxImage} 
                alt="Портфоліо MEBLI-PRO — меблі на замовлення Київ, Троєщина, Дарниця, Позняки, Лівий берег" 
                fill 
                className="object-contain" 
                sizes="100vw" 
              />
            </motion.div>
            <button className="absolute top-6 right-6 text-white text-3xl hover:text-[#D4AF37] transition-colors">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
