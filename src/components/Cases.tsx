"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Home, Layout, Sofa, Box, Brush, ZoomIn, X, ArrowLeft, ArrowRight, MapPin, Ruler, Wallet, CheckCircle2, Camera } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  materials: string;
  image_urls: string[];
  before_images?: string[];
  budget?: string;
  area_sqm?: number;
  task?: string;
  solution?: string;
}

const categories = [
  { id: "all", name: "Всі кейси", icon: LayoutGrid },
  { id: "kitchen", name: "Кухні", icon: Home },
  { id: "wardrobe", name: "Шафи / Гардеробні", icon: Layout },
  { id: "living", name: "Вітальня / Спальня", icon: Sofa },
  { id: "hallway", name: "Передпокій", icon: Box },
  { id: "restoration", name: "Реставрація", icon: Brush },
];

export default function Cases() {
  const [activeTab, setActiveTab] = useState("all");
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  useEffect(() => {
    async function loadCases() {
      try {
        const { data } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setCases(data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category || "all",
            materials: item.materials || "",
            image_urls: item.image_urls || [],
            before_images: item.before_images || [],
            budget: item.budget,
            area_sqm: item.area_sqm,
            task: item.task,
            solution: item.solution,
          })));
        }
      } catch (err) {
        console.error("Помилка завантаження кейсів:", err);
      }
    }
    loadCases();
  }, []);

  const filteredCases = activeTab === "all" 
    ? cases 
    : cases.filter(c => c.category === activeTab);

  const nextImage = () => {
    if (!selectedCase) return;
    const images = showBeforeAfter && selectedCase.before_images?.length 
      ? selectedCase.before_images 
      : selectedCase.image_urls;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!selectedCase) return;
    const images = showBeforeAfter && selectedCase.before_images?.length 
      ? selectedCase.before_images 
      : selectedCase.image_urls;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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
            className="text-3xl md:text-5xl font-heading mb-4 text-white tracking-tight"
          >
            Реальні <span className="text-metallic-gold italic">Кейси</span>
          </motion.h2>
          <p className="text-zinc-400 max-w-xl mx-auto font-light">
            Кожен проєкт — історія вирішення конкретних задач. Бюджет, терміни, матеріали — все прозоро.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-nowrap overflow-x-auto md:flex-wrap md:justify-center gap-2 md:gap-3 mb-12 max-w-4xl mx-auto pb-4 md:pb-0 scrollbar-hide">
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

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((caseItem) => (
              <motion.div
                key={caseItem.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedCase(caseItem);
                  setCurrentImageIndex(0);
                  setShowBeforeAfter(false);
                }}
              >
                <div className="relative h-[280px] md:h-[320px] overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500">
                  {/* Main Image */}
                  <div className="absolute inset-0">
                    {caseItem.image_urls[0] && (
                      <Image
                        src={caseItem.image_urls[0]}
                        alt={caseItem.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                  
                  {/* Before/After Badge */}
                  {caseItem.before_images && caseItem.before_images.length > 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#D4AF37]/90 text-black text-[10px] uppercase tracking-wider font-bold">
                      <Camera className="w-3 h-3 inline mr-1" />
                      До / Після
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    {/* Category */}
                    <span className="text-[#D4AF37] text-[9px] uppercase font-bold tracking-[0.2em] block mb-2">
                      {categories.find(c => c.id === caseItem.category)?.name}
                    </span>
                    
                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-heading text-white mb-3 tracking-tight">
                      {caseItem.title}
                    </h3>
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 text-[11px] text-zinc-300">
                      {caseItem.area_sqm && (
                        <div className="flex items-center gap-1">
                          <Ruler className="w-3 h-3 text-[#D4AF37]" />
                          <span>{caseItem.area_sqm} м²</span>
                        </div>
                      )}
                      {caseItem.budget && (
                        <div className="flex items-center gap-1">
                          <Wallet className="w-3 h-3 text-[#D4AF37]" />
                          <span>{caseItem.budget}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" />
                        <span>Київ</span>
                      </div>
                    </div>

                    {/* Task Preview */}
                    {caseItem.task && (
                      <p className="text-zinc-400 text-xs mt-3 line-clamp-2 font-light">
                        {caseItem.task}
                      </p>
                    )}
                  </div>

                  {/* Hover View Button */}
                  <div className="absolute top-4 right-4 w-10 h-10 glass-dark border border-[#D4AF37]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[#D4AF37]">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCases.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Кейси в цій категорії з'являться незабаром</p>
          </div>
        )}
      </div>

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 overflow-y-auto"
            onClick={() => setSelectedCase(null)}
          >
            <div className="min-h-screen px-4 py-8 md:py-12">
              <div className="max-w-6xl mx-auto">
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="fixed top-4 right-4 z-50 w-12 h-12 glass-dark border border-white/10 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-8">
                  <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-[0.3em] block mb-3">
                    {categories.find(c => c.id === selectedCase.category)?.name}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-heading text-white mb-4">
                    {selectedCase.title}
                  </h2>
                  
                  {/* Meta Grid */}
                  <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
                    {selectedCase.area_sqm && (
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#D4AF37]" />
                        <span>{selectedCase.area_sqm} м²</span>
                      </div>
                    )}
                    {selectedCase.budget && (
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-[#D4AF37]" />
                        <span>Бюджет: {selectedCase.budget}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span>Київ, Лівий берег</span>
                    </div>
                  </div>
                </div>

                {/* Image Gallery */}
                <div className="relative mb-8">
                  <div className="relative h-[300px] md:h-[500px] bg-[#0a0a0a] border border-white/10">
                    {(() => {
                      const images = showBeforeAfter && selectedCase.before_images?.length 
                        ? selectedCase.before_images 
                        : selectedCase.image_urls;
                      const currentImage = images[currentImageIndex];
                      
                      return currentImage ? (
                        <Image
                          src={currentImage}
                          alt={`${selectedCase.title} - фото ${currentImageIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="100vw"
                          priority
                        />
                      ) : null;
                    })()}
                    
                    {/* Before/After Toggle */}
                    {selectedCase.before_images && selectedCase.before_images.length > 0 && (
                      <div className="absolute top-4 left-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBeforeAfter(false);
                            setCurrentImageIndex(0);
                          }}
                          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all ${
                            !showBeforeAfter 
                              ? "bg-[#D4AF37] text-black" 
                              : "bg-black/50 text-white border border-white/20"
                          }`}
                        >
                          Після
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowBeforeAfter(true);
                            setCurrentImageIndex(0);
                          }}
                          className={`px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all ${
                            showBeforeAfter 
                              ? "bg-[#D4AF37] text-black" 
                              : "bg-black/50 text-white border border-white/20"
                          }`}
                        >
                          До
                        </button>
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {(() => {
                      const images = showBeforeAfter && selectedCase.before_images?.length 
                        ? selectedCase.before_images 
                        : selectedCase.image_urls;
                      return images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-dark border border-white/10 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-dark border border-white/10 flex items-center justify-center text-white hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </>
                      );
                    })()}

                    {/* Image Counter */}
                    {(() => {
                      const images = showBeforeAfter && selectedCase.before_images?.length 
                        ? selectedCase.before_images 
                        : selectedCase.image_urls;
                      return images.length > 1 && (
                        <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 text-white text-xs">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Thumbnails */}
                  {(() => {
                    const images = showBeforeAfter && selectedCase.before_images?.length 
                      ? selectedCase.before_images 
                      : selectedCase.image_urls;
                    return images.length > 1 && (
                      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                            className={`relative w-20 h-20 shrink-0 border-2 transition-all ${
                              idx === currentImageIndex 
                                ? "border-[#D4AF37]" 
                                : "border-white/10 hover:border-white/30"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Case Details */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  {selectedCase.task && (
                    <div className="glass-luxury p-6 border border-white/5">
                      <h3 className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Задача
                      </h3>
                      <p className="text-zinc-300 text-sm leading-relaxed font-light">
                        {selectedCase.task}
                      </p>
                    </div>
                  )}
                  
                  {selectedCase.solution && (
                    <div className="glass-luxury p-6 border border-white/5">
                      <h3 className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Рішення
                      </h3>
                      <p className="text-zinc-300 text-sm leading-relaxed font-light">
                        {selectedCase.solution}
                      </p>
                    </div>
                  )}
                </div>

                {/* Materials */}
                {selectedCase.materials && (
                  <div className="mt-6 glass-dark p-6 border border-white/5">
                    <h3 className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-bold mb-3">
                      Матеріали та фурнітура
                    </h3>
                    <p className="text-zinc-400 text-sm font-light">
                      {selectedCase.materials}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-8 text-center">
                  <a
                    href="#order"
                    onClick={() => setSelectedCase(null)}
                    className="inline-flex items-center gap-3 px-8 h-14 bg-metallic-gold text-black text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Хочу такі ж меблі
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
