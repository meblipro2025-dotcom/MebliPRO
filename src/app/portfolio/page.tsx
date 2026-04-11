"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Home, Layout, Brush, Sofa, Monitor, Box, ZoomIn, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface GalleryProject {
  id: string;
  title: string;
  category: string;
  materials: string;
  image: string;
  description?: string;
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
  { id: "bed", name: "Ліжка-трансформери", icon: Sofa },
  { id: "office", name: "Офісні меблі", icon: Monitor },
  { id: "glass", name: "Вироби зі скла", icon: Box },
  { id: "countertops", name: "Стільниці", icon: Layout },
  { id: "sliding", name: "Розсувні системи", icon: LayoutGrid },
];

const allProjects: GalleryProject[] = [
  { id: "1", title: "Кухня Матова преміум", category: "kitchen", materials: "МДФ фарба матова, стільниця кварц, фурнітура Blum", description: "Кухня з фарбованими матовими фасадами та кварцовою стільницею. Повністю інтегрована техніка.", image: "/images/luxury_kitchen.png" },
  { id: "2", title: "Шафа-купе з дзеркалом", category: "wardrobe", materials: "Дзеркало, піскоструй, ДСП Egger", description: "Вбудована шафа-купе з дзеркальними дверима та піскоструйним малюнком.", image: "/images/closet_white.png" },
  { id: "3", title: "Вітальня в глянці", category: "living", materials: "Глянцеві фасади, LED-підсвітка", description: "Сучасна вітальня з глянцевими фасадами та системою LED-підсвітки.", image: "/images/modern_kitchen.png" },
  { id: "4", title: "Кухня з островом", category: "kitchen", materials: "Острівна кухня, кам'яна стільниця, барна стійка", description: "Просторна кухня з центральним островом та барною стійкою.", image: "/images/kitchen_island.png" },
  { id: "5", title: "Дитяча кімната", category: "children", materials: "Еко-фарба, м'які кути, безпечні матеріали", description: "Яскрава дитяча кімната з безпечними матеріалами та ігровою зоною.", image: "/images/kids_furniture.png" },
  { id: "6", title: "Передпокій з дзеркалом", category: "hallway", materials: "Шухляди, дзеркало в повний зріст", description: "Функціональний передпокій з великим дзеркалом та місцем для зберігання.", image: "/images/entryway_mirror.png" },
  { id: "7", title: "Письмовий стіл", category: "tables", materials: "Дуб масив, металеві ніжки", description: "Офісний стіл з масиву дуба на міцних металевих ніжках.", image: "/images/office_desk.png" },
  { id: "8", title: "Реставрація шафи", category: "restoration", materials: "Відновлення антикваріату, лакування", description: "Повне відновлення антикварної шафи зі збереженням оригінального декору.", image: "/images/restoration_wardrobe.png" },
  { id: "9", title: "Кухня з дерева", category: "kitchen", materials: "Масив дуба, фарбовані фасади", description: "Кухня з комбінованими фасадами: дерево + фарбований МДФ.", image: "/images/kitchen_wood.png" },
  { id: "10", title: "Гардеробна кімната", category: "wardrobe", materials: "Висувні системи, підсвітка, дзеркала", description: "Велика гардеробна з системами зберігання та підсвіткою.", image: "/images/walk_in_closet.png" },
  { id: "11", title: "Спальня комплект", category: "living", materials: "Ліжко, тумби, комод, шафа", description: "Повний комплект меблів для спальні в єдиному стилі.", image: "/images/bedroom_set.png" },
  { id: "12", title: "Кухня лофт", category: "kitchen", materials: "Бетон, дерево, метал", description: "Індустріальний стиль кухні з поєднанням бетону та дерева.", image: "/images/kitchen_loft.png" },
  { id: "13", title: "Шафа розпашна", category: "wardrobe", materials: "Розпашні двері, фрезерування", description: "Класична шафа з розпашними дверима та фрезерованими фасадами.", image: "/images/swing_wardrobe.png" },
  { id: "14", title: "Дитяча з ліжком-горищем", category: "children", materials: "Ліжко на другому рівні, робоча зона", description: "Двоярусне ліжко з робочою зоною та місцем для ігор.", image: "/images/bunk_bed.png" },
  { id: "15", title: "Стіл-трансформер", category: "tables", materials: "Розкладний, компактний, 2-в-1", description: "Компактний стіл-трансформер для маленьких квартир.", image: "/images/471500883.webp" },
  { id: "16", title: "Кухня мінімал", category: "kitchen", materials: "Без ручок, інтегрована техніка", description: "Мінімалістична кухня з прихованими ручками та інтегрованою технікою.", image: "/images/kitchen_minimal.png" },
  { id: "17", title: "Передпокій з тумбами", category: "hallway", materials: "Взуттєва шафа, вішалка, дзеркало", description: "Компактний передпокій з взуттєвою шафою та вішалкою.", image: "/images/entryway_cabinets.png" },
  { id: "18", title: "ТВ-зона", category: "living", materials: "Полиця для ТВ, система зберігання", description: "Стінка для ТВ з полицями та системами зберігання.", image: "/images/tv_unit.png" },
  { id: "19", title: "Кухня під вікно", category: "kitchen", materials: "Вбудована під підвіконня", description: "Кухня, вбудована під підвіконня для максимального використання простору.", image: "/images/kitchen_window.png" },
  { id: "20", title: "Шафа з кольоровими вставками", category: "wardrobe", materials: "Кольорові вставки, ДСП", description: "Сучасна шафа з яскравими кольоровими акцентами.", image: "/images/color_wardrobe.png" },
  { id: "21", title: "Ліжко з ящиками", category: "living", materials: "Підйомний механізм, ящики для білизни", description: "Функціональне ліжко з системою зберігання білизни.", image: "/images/storage_bed.png" },
  { id: "22", title: "Кухня кутова", category: "kitchen", materials: "Г-подібна планування", description: "Кутова кухня з ергономічним розташуванням робочих зон.", image: "/images/kitchen_corner.png" },
  { id: "23", title: "Кухонний стіл", category: "tables", materials: "Розсувний, 6-8 місць", description: "Розсувний стіл для великої родини або прийому гостей.", image: "/images/dining_table.png" },
  { id: "24", title: "Дитяча комплект", category: "children", materials: "Стіл, шафа, ліжко, полиці", description: "Повний комплект меблів для дитячої кімнати.", image: "/images/kids_room.png" },
  { id: "25", title: "Реставрація столу", category: "restoration", materials: "Шліфування, лакування, реставрація", description: "Відновлення старого столу зі шліфуванням та новим лакуванням.", image: "/images/table_restore.png" },
  { id: "26", title: "Шафа вбудована", category: "wardrobe", materials: "Вбудована система, дзеркала", description: "Вбудована шафа від підлоги до стелі з дзеркалами.", image: "/images/luxury_kitchen.png" },
  { id: "27", title: "Кухня двоколірна", category: "kitchen", materials: "Комбінація кольорів, фурнітура", description: "Сучасна кухня з контрастним поєднанням кольорів фасадів.", image: "/images/modern_kitchen.png" },
  { id: "28", title: "Тумба під ТВ", category: "living", materials: "Дерево, метал, скло", description: "Стильна тумба під телевізор з відкритими полицями.", image: "/images/tv_unit.png" },
  { id: "29", title: "Обідня зона", category: "tables", materials: "Стіл, стільці, винна шафа", description: "Повна обідня зона зі столом, стільцями та винною шафою.", image: "/images/dining_table.png" },
  { id: "30", title: "Дитяче ліжко", category: "children", materials: "Безпечні матеріали, ящики", description: "Зручне дитяче ліжко з бортиками та системою зберігання.", image: "/images/kids_furniture.png" },
  { id: "31", title: "Прихожа МДФ", category: "hallway", materials: "МДФ фарба, дзеркало", description: "Елегантна прихожа з фарбованими фасадами та великим дзеркалом.", image: "/images/entryway_mirror.png" },
  { id: "32", title: "Кухня з барною стійкою", category: "kitchen", materials: "Барна стійка, стільниця", description: "Кухня з острівною барною стійкою для сніданків.", image: "/images/kitchen_island.png" },
  { id: "33", title: "Гардероб графіт", category: "wardrobe", materials: "Графітові фасади, підсвітка", description: "Сучасний гардероб в темних тонах з LED-підсвіткою.", image: "/images/walk_in_closet.png" },
  { id: "34", title: "Комод", category: "living", materials: "Масив, фрезерування", description: "Класичний комод з масиву з фрезерованими фасадами.", image: "/images/bedroom_set.png" },
  { id: "35", title: "Стелаж для книг", category: "living", materials: "Метал, дерево, скло", description: "Відкритий стелаж для книг та декору.", image: "/images/tv_unit.png" },
];

function PortfolioContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [activeTab, setActiveTab] = useState(categoryFromUrl || "all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<GalleryProject[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        const dbProjects = (data || []).map((item: { id: string; title: string; category?: string; materials: string; image_urls?: string[]; description?: string }) => ({
          id: item.id,
          title: item.title,
          category: item.category || "all",
          materials: item.materials,
          description: item.description || "",
          image: Array.isArray(item.image_urls) && item.image_urls.length > 0 ? item.image_urls[0] : "/images/luxury_kitchen.png",
        }));
        setProjects(dbProjects.length > 5 ? dbProjects : [...dbProjects, ...allProjects.slice(0, 35 - dbProjects.length)]);
      } catch (err) {
        console.error("Помилка завантаження галереї:", err);
        setProjects(allProjects);
      }
    }
    loadProjects();
  }, []);
  
  // Update active tab when URL changes
  useEffect(() => {
    if (categoryFromUrl && categories.some(c => c.id === categoryFromUrl)) {
      setActiveTab(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredProjects = activeTab === "all" 
    ? projects 
    : projects.filter(p => p.category === activeTab);

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">Головна</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">Портфоліо</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-heading text-white mb-4">
            Портфоліо — <span className="text-[#D4AF37]">{projects.length}+ робіт</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Кожен проєкт — це унікальна історія. Перегляньте наші реалізовані роботи для натхнення або замовте щось схоже.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                activeTab === cat.id 
                ? "bg-[#D4AF37]/10 border-[#D4AF37] text-white" 
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative h-[280px] overflow-hidden bg-[#141414] rounded-lg border border-white/10 cursor-pointer"
              onClick={() => setLightboxImage(project.image)}
            >
              <div className="absolute inset-0">
                <Image 
                  src={project.image}
                  alt={`${project.title} — ${categories.find(c => c.id === project.category)?.name || 'Меблі'} на замовлення в Києві, Лівий берег`}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-wider">
                  {categories.find(c => c.id === project.category)?.name}
                </span>
                <h3 className="text-lg font-heading text-white mt-1">{project.title}</h3>
                <p className="text-zinc-400 text-xs mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.materials}
                </p>
              </div>
              
              <div className="absolute top-3 right-3 w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-400">У цій категорії поки немає робіт. Скоро додамо!</p>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Повернутися на головну
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }} 
              className="relative w-full max-w-5xl h-[85vh]"
            >
              <Image 
                src={lightboxImage} 
                alt="Портфоліо MEBLI-PRO — меблі на замовлення Київ" 
                fill 
                className="object-contain" 
                sizes="100vw"
              />
            </motion.div>
            <button 
              className="absolute top-6 right-6 text-white text-4xl hover:text-[#D4AF37] transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Export with Suspense for useSearchParams
export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><p className="text-zinc-400">Завантаження...</p></div>}>
      <PortfolioContent />
    </Suspense>
  );
}
