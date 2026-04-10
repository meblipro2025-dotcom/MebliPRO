"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Megaphone } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/context/SiteContext";

type BannerMode = "split" | "full-image" | "text-only";

export interface PromoConfig {
  isActive: boolean;
  mode: BannerMode;
  title: string;
  text: string;
  buttonText: string;
  image: string;
  imagePosition?: "left" | "right";
}

export default function PromoBanner({ overrideConfig }: { overrideConfig?: PromoConfig | null }) {
  const [isVisible, setIsVisible] = useState(true);
  const siteSettings = useSiteSettings();
  
  const b = siteSettings?.banner;
  
  const config = overrideConfig || (b ? {
    isActive: b.is_active === true,
    mode: b.template === 'image' ? 'full-image' : b.template === 'image_text' ? 'split' : 'text-only',
    title: b.title || "",
    text: b.text || "",
    buttonText: b.button_text || "Скористатися пропозицією",
    image: b.image_url || "",
    imagePosition: b.image_position === 'left' ? 'left' : 'right',
  } : null);

  if (!config || !config.isActive || !isVisible) return null;

  // Next/Image requires a valid src. If image mode requires image but it's empty, fallback to placeholder
  const safeImageSrc = config.image || "/images/kitchen_modern.png";

  const tgLink = `https://t.me/devcraft_ua?text=${encodeURIComponent("Вітаю. Я хотів би скористатися вашою рекламною пропозицією.")}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:right-6 md:w-[560px]"
      >
        <div className="glass-luxury border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          {/* Close Button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center glass-dark border border-white/10 text-white hover:border-[#D4AF37] transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {config.mode === "split" && (
            <div className={`flex flex-col md:flex-row ${config.imagePosition === 'left' ? 'md:flex-row-reverse' : ''}`}>
              <div className="relative w-full md:w-48 h-40 md:h-auto">
                <Image src={safeImageSrc} alt="Promo" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Megaphone className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Спеціальна Пропозиція</span>
                </div>
                <h3 className="text-2xl font-heading text-white">{config.title}</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">{config.text}</p>
                <a 
                  href={tgLink}
                  target="_blank"
                  className="inline-flex items-center gap-3 px-6 h-12 bg-metallic-gold text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  {config.buttonText} <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {config.mode === "full-image" && (
            <div className="relative h-80 group">
              <Image src={safeImageSrc} alt="Promo" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute inset-0 p-10 flex flex-col justify-end items-center text-center">
                <div className="glass-dark p-8 border border-white/10 backdrop-blur-md">
                   <h3 className="text-2xl font-heading text-white mb-4 uppercase tracking-tighter">{config.title}</h3>
                   <a 
                    href={tgLink}
                    target="_blank"
                    className="inline-flex items-center gap-3 px-8 h-12 bg-metallic-gold text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    {config.buttonText}
                  </a>
                </div>
              </div>
            </div>
          )}

          {config.mode === "text-only" && (
            <div className="p-10 text-center space-y-6">
              <div className="flex justify-center text-[#D4AF37] mb-2">
                <Megaphone className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-heading text-white tracking-tight">{config.title}</h3>
              <p className="text-zinc-400 font-light text-lg">{config.text}</p>
              <a 
                href={tgLink}
                target="_blank"
                className="inline-flex items-center gap-3 px-10 h-14 bg-metallic-gold text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
              >
                {config.buttonText} <Send className="w-4 h-4" />
              </a>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
