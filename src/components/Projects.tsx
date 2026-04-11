"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Ruler, Palette, Wrench, Check, ArrowRight, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/context/SiteContext";

const categories = [
  { id: "all", label: "Всі роботи" },
  { id: "Кухні", label: "Кухні" },
  { id: "Шафи", label: "Шафи" },
  { id: "Реставрація", label: "Реставрація" },
  { id: "Трансформери", label: "Трансформери" },
  { id: "Дитячі", label: "Дитячі кімнати" },
  { id: "Інше", label: "Інші вироби" },
];

// Demo projects data with real images
const demoProjects: Project[] = [
  {
    id: "demo-kitchen-1",
    title: "Кухня МДФ фарба в сучасному стилі",
    description: "Сучасна кухня для сім'ї з 3 осіб. П-образна планування з великим робочим простором та вбудованою технікою.",
    category: "Кухні",
    image_urls: ["/images/luxury_kitchen.png"],
    before_images: [],
    specifications: {
      facadeType: "МДФ фарба матова",
      countertop: "Кварц Silestone",
      furnitureCategory: "Преміум",
      kitchenShape: "П-подібна",
      style: "Modern"
    },
    price_from: 45000,
    price_to: 52000,
    price_note: "Орієнтовна вартість з фурнітурою Blum",
    materials: ["МДФ фарба", "Кварцова стільниця", "Фурнітура Blum"],
    furniture_brand: "Blum",
    slug: "kukhnya-mdf-farba-suchasna",
    is_published: true,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-kitchen-2",
    title: "Кухня з островом преміум класу",
    description: "Авторська кухня з вбудованим островом та стільницею з натурального каменю. Класичний дизайн з сучасною функціональністю.",
    category: "Кухні",
    image_urls: ["/images/kitchen_island.png"],
    before_images: [],
    specifications: {
      facadeType: "МДФ штильована",
      countertop: "Граніт",
      furnitureCategory: "Преміум",
      kitchenShape: "Острівна",
      style: "Modern"
    },
    price_from: 78000,
    price_to: 95000,
    price_note: "Орієнтовна вартість під ключ",
    materials: ["Натуральне дерево", "Шпон горіха", "Масивна стільниця"],
    furniture_brand: "Hettich",
    slug: "kukhnya-ostrov",
    is_published: true,
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-wardrobe-1",
    title: "Вбудована гардеробна система",
    description: "Продумана система зберігання для спальні з розсувними дверима та прихованими полицями.",
    category: "Шафи",
    image_urls: ["/images/wardrobe_builtin.png"],
    before_images: [],
    specifications: {
      doorType: "Купе",
      doorFilling: "МДФ + Дзеркало",
      bodyMaterial: "ЛДСП",
      style: "Modern"
    },
    price_from: 22000,
    price_to: 28000,
    price_note: "Орієнтовна вартість",
    materials: ["ЛДСП", "Дзеркало", "Система купе"],
    furniture_brand: "Середній",
    slug: "wardrobe-builtin-lux",
    is_published: true,
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-transform-1",
    title: "Ліжко-трансформер 3-в-1",
    description: "Повноцінне ліжко, яке ховається в шафу, звільняючи місце для дивана. Ідеально для смарт-житла.",
    category: "Трансформери",
    image_urls: ["/images/transformer1.jpg"],
    before_images: [],
    specifications: {
      mechanismType: "Шафа-ліжко вертикального відкривання",
      style: "Modern"
    },
    price_from: 42000,
    price_to: 55000,
    price_note: "Орієнтовна вартість з механізмом",
    materials: ["ЛДСП", "МДФ", "Італійський механізм"],
    furniture_brand: "Преміум",
    slug: "transform-bed-3in1",
    is_published: true,
    is_featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-kids-1",
    title: "Дитяча для двох дітей",
    description: "Функціональне рішення з багатоярусним ліжком та робочою зоною. Безпечні матеріали.",
    category: "Дитячі",
    image_urls: ["/images/children_room.png"],
    before_images: [],
    specifications: {
      style: "Modern",
      color: "Білий + Пастель"
    },
    price_from: 35000,
    materials: ["Еко-ЛДСП", "МДФ"],
    slug: "kids-room-modern",
    is_published: true,
    is_featured: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-transform-2",
    title: "Підвісний стіл-трансформер",
    description: "Компактний стіл, що кріпиться до стіни і складається в тонку полицю.",
    category: "Трансформери",
    image_urls: ["/images/471500883.webp"],
    before_images: [],
    specifications: {
      mechanismType: "Відкидний",
      style: "Modern"
    },
    price_from: 4500,
    price_to: 6500,
    price_note: "Ціна з монтажем",
    materials: ["ЛДСП", "Метал"],
    furniture_brand: "Середній",
    slug: "wall-table-transform",
    is_published: true,
    is_featured: false,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

function formatPrice(price?: number): string {
  if (!price) return "Ціна за запитом";
  return price.toLocaleString("uk-UA") + " ₴";
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) {
        setProjects(demoProjects);
      } else if (data && data.length > 0) {
        setProjects(data as Project[]);
      } else {
        setProjects(demoProjects);
      }
    } catch (err) {
      setProjects(demoProjects);
    } finally {
      setLoading(false);
    }
  };

  const baseFiltered = selectedCategory === "all"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);
    
  const filteredProjects = showAll ? baseFiltered : baseFiltered.slice(0, 6);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const nextImage = () => {
    if (selectedProject) {
      const images = selectedProject.image_urls.length > 0 
        ? selectedProject.image_urls 
        : ["/images/placeholder.jpg"];
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const images = selectedProject.image_urls.length > 0 
        ? selectedProject.image_urls 
        : ["/images/placeholder.jpg"];
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
            Наші роботи
          </span>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white mb-4">
            Каталог проєктів
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
            Реальні кейси з цінами та характеристиками. Кожен проєкт — це унікальне рішення для конкретного клієнта.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setShowAll(false); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-[#D4AF37] text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => openModal(project)}>
                    <Image
                      src={project.image_urls[0] || "/images/placeholder.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#D4AF37]/90 text-black text-xs font-bold rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading text-xl text-white mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors cursor-pointer" onClick={() => openModal(project)}>
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <span className="text-[#D4AF37] font-bold text-lg">
                          {project.price_exact ? formatPrice(project.price_exact) : project.price_from ? `від ${formatPrice(project.price_from)}` : "Ціна за запитом"}
                        </span>
                      </div>
                      <button
                        onClick={() => openModal(project)}
                        className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black px-4 py-2 rounded-sm transition-all duration-300"
                      >
                        Замовити прорахунок <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View All Button */}
        {!loading && baseFiltered.length > 6 && !showAll && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="px-10 py-4 border border-[#D4AF37] text-[#D4AF37] uppercase tracking-widest text-xs font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              Переглянути всі проєкти
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">У цій категорії поки немає проєктів</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-hidden"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"><X /></button>
              <div className="grid md:grid-cols-2 h-full max-h-[90vh] overflow-auto">
                <div className="relative h-64 md:h-auto bg-black">
                  <Image src={selectedProject.image_urls[currentImageIndex] || "/images/placeholder.jpg"} alt={selectedProject.title} fill className="object-cover" />
                  {selectedProject.image_urls.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full"><ChevronLeft /></button>
                      <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full"><ChevronRight /></button>
                    </>
                  )}
                </div>
                <div className="p-6 md:p-8 overflow-auto">
                  <span className="text-[#D4AF37] text-sm uppercase">{selectedProject.category}</span>
                  <h2 className="font-heading text-2xl md:text-3xl text-white mt-2 mb-4">{selectedProject.title}</h2>
                  <p className="text-zinc-400 mb-6">{selectedProject.description}</p>
                  
                  <div className="bg-white/5 rounded-lg p-4 space-y-2 mb-6">
                    {Object.entries(selectedProject.specifications).map(([key, value]) => (
                      value && <div key={key} className="flex justify-between text-sm"><span className="text-zinc-400">{key}:</span><span className="text-white">{String(value)}</span></div>
                    ))}
                  </div>

                  <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center"><span className="text-zinc-400">Вартість:</span><span className="text-[#D4AF37] font-bold text-2xl">{selectedProject.price_exact ? formatPrice(selectedProject.price_exact) : `від ${formatPrice(selectedProject.price_from)}`}</span></div>
                  </div>

                  <button 
                    onClick={() => { closeModal(); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#e5c248] transition-colors"
                  >
                    ЗАМОВИТИ ПРОРАХУНОК
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
