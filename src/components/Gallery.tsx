"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Home, Layout, Brush, Sofa, Monitor, Box, ZoomIn } from "lucide-react";
import Image from "next/image";
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

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [projects, setProjects] = useState<GalleryProject[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        setProjects((data || []).map((item: { id: string; title: string; category?: string; materials: string; image_urls?: string[] }) => ({
          id: item.id,
          title: item.title,
          category: item.category || "all",
          materials: item.materials,
          image: Array.isArray(item.image_urls) && item.image_urls.length > 0 ? item.image_urls[0] : "/images/luxury_kitchen.png",
        })));
      } catch (err) {
        console.error("Помилка завантаження галереї:", err);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = activeTab === "all" 
    ? projects 
    : projects.filter(p => p.category === activeTab);

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
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading mb-6 text-white tracking-tight"
          >
            Наші <span className="text-metallic-gold italic">Роботи</span>
          </motion.h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light leading-relaxed">
            Реалізовані за індивідуальними розмірами на Лівому березі Києва. Кожне фото — результат кропіткої роботи майстра.
          </p>
        </div>

        {/* Filters — scrollable on mobile */}
        <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:justify-center gap-2 md:gap-3 mb-16 max-w-4xl mx-auto pb-4 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
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
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0 }}
                className="group relative h-[300px] sm:h-[350px] md:h-[450px] overflow-hidden bg-[#0a0a0a] border border-white/10 cursor-pointer"
                onClick={() => setLightboxImage(project.image)}
              >
                <div className="absolute inset-0">
                  <Image 
                    src={project.image}
                    alt={`${project.title} — ${categories.find(c => c.id === project.category)?.name || 'Меблі'} на замовлення в Києві, Лівий берег`}
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
              <Image src={lightboxImage} alt={`Портфоліо MEBLI-PRO — меблі на замовлення Київ, Троєщина, Лівий берег`} fill className="object-contain" sizes="100vw" />
            </motion.div>
            <button className="absolute top-6 right-6 text-white text-3xl hover:text-[#D4AF37] transition-colors">&times;</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
