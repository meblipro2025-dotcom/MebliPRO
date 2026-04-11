"use client";

import { motion } from "framer-motion";
import { MoveRight, MapPin, Phone, Check } from "lucide-react";
import Image from "next/image";
import { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import WhyUs from "@/components/WhyUs";
import Guarantees from "@/components/Guarantees";
import Process from "@/components/Process";
import Hero3D from "@/components/Hero3D";
import MobileContactBar from "@/components/MobileContactBar";
import PromoBanner from "@/components/PromoBanner";
import { ConfigProvider } from "@/context/ConfigContext";
import { useSiteSettings } from "@/context/SiteContext";
import { recordEvent } from "@/lib/analytics";

// Lazy load heavy components for faster initial load
const Projects = dynamic(() => import("@/components/Projects"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const Reviews = dynamic(() => import("@/components/Reviews"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const Blog = dynamic(() => import("@/components/Blog"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});
const QuizCalculator = dynamic(() => import("@/components/QuizCalculator"), {
  loading: () => <SectionSkeleton />,
  ssr: false,
});

// Loading skeleton for lazy-loaded sections
function SectionSkeleton() {
  return (
    <div className="py-20 md:py-32 px-4">
      <div className="container mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const settings = useSiteSettings();

  useEffect(() => {
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    const source = referrer.includes('google') ? 'search' : referrer ? 'referral' : 'direct';
    recordEvent('page_view', {
      path: window.location.pathname,
      referrer,
      source,
    });
  }, []);
  
  return (
    <ConfigProvider>
      <div className="min-h-screen relative overflow-x-hidden">
      
      {/* Fixed Navbar */}
      <Navbar />

      {/* Cinematic Hero Section */}
      <section className="relative z-10 min-h-[100dvh] md:min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image 
            src="/images/luxury_kitchen.png" 
            alt={`${settings.hero_title} - ${settings.logo_text}`}
            fill 
            className="object-cover object-center scale-105"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzE0MTQxNCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzI1MjUyNSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-dark-bg)] via-[#000000aa] to-[#00000080]" />
        </div>

        {/* 3D Effect - hidden on mobile as it breaks text visibility */}
        <div className="hidden md:block absolute inset-0 z-10 mix-blend-color-dodge opacity-40">
          <Hero3D />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-30 pt-24 sm:pt-32 pb-16 sm:pb-24">
          <div className="max-w-4xl relative z-30">
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-30"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Власне виробництво • Київ (Лівий берег) • 15+ років</span>
              </div>
              
              <div className="bg-black/50 sm:bg-transparent p-4 sm:p-0 -mx-4 sm:mx-0 rounded-lg sm:rounded-none backdrop-blur-sm sm:backdrop-blur-none">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] drop-shadow-lg text-white">
                  Кухні та меблі на замовлення в Києві
                  <span className="block text-xl sm:text-3xl md:text-4xl lg:text-5xl mt-2 text-[#D4AF37]">Троєщина • Дарниця • Позняки • Лісовий</span>
                </h1>
                
                {/* USP Points */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-6">
                  {[
                    "Від 21 дня",
                    "Гарантія 2 роки",
                    "Безкоштовний дизайн"
                  ].map((usp, i) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-200">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-sm font-medium">{usp}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-base sm:text-lg text-zinc-100 max-w-2xl mb-6 sm:mb-8 font-light leading-relaxed border-l-2 border-[#D4AF37]/50 pl-4 sm:pl-6 drop-shadow-md">
                  Отримайте розрахунок вартості за 5 хвилин. Працюємо на Лівому березі: 
                  <strong className="text-[#D4AF37]">Троєщина</strong>, 
                  <strong className="text-[#D4AF37]">Лісовий</strong>, 
                  <strong className="text-[#D4AF37]">Дарниця</strong>, 
                  <strong className="text-[#D4AF37]">Биківня</strong>, 
                  <strong className="text-[#D4AF37]">Позняки</strong>, 
                  <strong className="text-[#D4AF37]">Осокорки</strong>, 
                  <strong className="text-[#D4AF37]">Харківська</strong> та інші райони Києва.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="group relative flex items-center justify-center gap-3 w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 bg-metallic-gold text-black uppercase tracking-widest text-xs font-bold rounded-none overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(191,149,63,0.3)] cursor-pointer"
                >
                  <span className="relative z-10">Розрахувати вартість</span>
                  <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
                
                <div className="flex items-center gap-6 text-sm text-zinc-400 uppercase tracking-widest">
                  <a href={`tel:${(settings.phone || "+380931431843").replace(/\s+/g, '')}`} className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
                    <span>{settings.phone || "+380 93 143 1843"}</span>
                  </a>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>м. Чернігівська, Лівобережна</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden xl:block absolute right-20 bottom-32 z-20 glass-luxury p-8 max-w-xs border-l-4 border-l-[#D4AF37]"
        >
          <div className="text-4xl text-metallic-gold font-heading mb-2">15+</div>
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-6">Років Досвіду</div>
          <p className="text-sm font-light text-zinc-300 leading-relaxed">
            Сотні реалізованих проектів. Тільки перевірені бренди: Egger, Cleaf, Blum. Лівий берег Києва.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pb-8"
        >
          <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.4em]">Гортайте</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse" />
        </motion.div>
      </section>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      {/* Page Sections */}
      <div className="relative z-20 bg-[var(--color-dark-bg)]">
        <WhyUs />
        <Services />
        <Projects />
        <Process />
        <About />
        <Timeline />
        <Guarantees />
        <FAQ />
        <Reviews />
        <QuizCalculator />
        <Blog />
        <Footer />
      </div>

      <PromoBanner />
      
      {/* Mobile Fixed Contact Bar - visible only on mobile */}
      <MobileContactBar />
    </div>
    </ConfigProvider>
  );
}
