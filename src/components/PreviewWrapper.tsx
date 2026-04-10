"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Megaphone } from "lucide-react";
import Image from "next/image";

interface PreviewWrapperProps {
  banner: any;
  siteSettings: any;
  focusedField: string | null;
}

export default function PreviewWrapper({ banner, siteSettings, focusedField }: PreviewWrapperProps) {
  const getBannerRing = () => focusedField === 'banner' ? 'ring ring-[#5b8cff] ring-offset-2 ring-offset-black/40' : '';
  const getHeroRing = () => focusedField === 'hero' ? 'ring ring-[#5b8cff] ring-offset-2 ring-offset-black/40' : '';

  return (
    <div className="space-y-6 bg-black/50 p-4 rounded-2xl">
      {/* BANNER PREVIEW */}
      <div className={`border border-white/10 rounded-2xl overflow-hidden bg-[#080808] ${getBannerRing()}`}>
        <div className="p-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold">Промо-Банер Превʼю</span>
        </div>
        {banner.is_active ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-xl pointer-events-none"
            >
              <div className="glass-luxury border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                {banner.template === "split" && banner.image_url && (
                  <div className={`flex flex-col md:flex-row ${banner.image_position === 'left' ? 'md:flex-row-reverse' : ''}`}>
                    <div className="relative w-full md:w-48 h-40 md:h-auto">
                      <img src={banner.image_url} alt="Promo" className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-2 text-[#D4AF37]">
                        <Megaphone className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Спеціальна Пропозиція</span>
                      </div>
                      <h3 className="text-2xl font-heading text-white">{banner.title || 'Заголовок'}</h3>
                      <p className="text-zinc-400 text-sm font-light leading-relaxed">{banner.text || 'Текст'}</p>
                      <button className="inline-flex items-center gap-3 px-6 h-12 bg-metallic-gold text-black text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                        {banner.button_text || 'Кнопка'} <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="p-4 text-red-200 text-sm">Банер вимкнено</div>
        )}
      </div>

      {/* HERO PREVIEW */}
      <div className={`border border-white/10 rounded-2xl overflow-hidden bg-[#080808] p-6 ${getHeroRing()}`}>
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-4">Hero Превʼю</span>
        <h1 className="text-4xl font-heading text-white mb-4">{siteSettings.hero_title || 'Меблі Преміум-Класу'}</h1>
        <p className="text-zinc-400 leading-relaxed text-lg">{siteSettings.hero_subtitle || 'Кухні та гардеробні за індивідуальним проектом'}</p>
      </div>

      {/* SERVICES PREVIEW */}
      {(siteSettings.services || []).length > 0 && (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#080808] p-6">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-4">Послуги Превʼю</span>
          <div className="grid grid-cols-1 gap-4">
            {(siteSettings.services || []).slice(0, 3).map((service: any, idx: number) => (
              <div key={idx} className="border border-white/10 p-4 rounded-lg bg-[#0f0f0f]">
                <h4 className="text-lg font-semibold text-white mb-2">{service.title || 'Послуга'}</h4>
                <p className="text-zinc-400 text-sm">{service.desc || 'Опис послуги'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
