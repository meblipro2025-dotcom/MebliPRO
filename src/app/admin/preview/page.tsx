"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { MoveRight, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { SiteProvider, SiteSettings } from "@/context/SiteContext";
import { ConfigProvider } from "@/context/ConfigContext";

const defaultSettings: SiteSettings = {
  phone: "+380 93 143 1843",
  email: "meblipro2025@gmail.com",
  telegram: "https://t.me/mebli_pro_admin",
  viber: "viber://add?number=380931431843",
  whatsapp: "https://wa.me/380931431843",
  instagram: "",
  logo_text: "MEBLI-PRO",
  logo_subtitle: "МАЙСТЕРНЯ МЕБЛІВ",
  show_logo_graphic: true,
  hero_title: "Меблі Преміум-Класу",
  hero_subtitle: "Кухні, шафи та гардеробні за індивідуальним проектом на Лівому березі Києва",
  about_label: "Про Майстра",
  about_title: "Майстерність, що\nнароджується\nбез посередників",
  about_image: "/images/kitchen_modern.png",
  experience_years: 15,
  about_text: "Олександр — приватний майстер. 15 років досвіду. Власне виробництво дозволяє робити меблі преміум-якості за ціною мас-маркету.",
  about: [
    "Олександр — приватний майстер з 15-річним досвідом. Власне виробництво дозволяє робити меблі преміум-якості за ціною мас-маркету.",
    "Працюю без посередників, тому контролюю кожен етап — від замірів до монтажу. Результат: функціональні меблі для сучасного інтер'єру на Троєщині, Лісовому масиві, Дарниці та Биківні."
  ],
  services: [
    {
      title: "Кухні (Blum/Hettich, фарбований МДФ)",
      desc: "Індивідуальні кухонні гарнітури, острови та високі шафи з преміальною фурнітурою Blum та Hettich. Фарбований МДФ будь-якого кольору.",
      bg: "/images/kitchen_modern.png",
    },
    {
      title: "Гардеробні системи",
      desc: "Шафи-купе, гардеробні, пенали з максимальним використанням простору. Системи зберігання під будь-які потреби.",
      bg: "/images/wardrobe_builtin.png",
    },
    {
      title: "Меблі для ванних кімнат",
      desc: "Вологостійкі матеріали, компактні рішення для маленьких ванних кімнат. Стійкість до вологи та температур.",
      bg: "/images/living_room_tv.png",
    },
  ],
  faq: [
    {
      question: "Які терміни виготовлення меблів?",
      answer: "Виготовлення займає від 14 до 45 днів залежно від складності проекту та матеріалів. Кухні — до 30 днів, шафи-купе — від 14 днів.",
    },
  ],
  benefits: [
    {
      title: "Офіційний ФОП",
      desc: "Працюю за договором. Жодних прихованих ризиків.",
    },
    {
      title: "Власне виробництво",
      desc: "Повний контроль якості та реальні терміни.",
    },
    {
      title: "Преміум фурнітура",
      desc: "Blum, Hettich — австрійська та німецька якість.",
    },
  ],
  highlights: [],
  blog_label: "Корисні статті",
  blog_title: "Блог\nМайстра",
  footer_description: "Професійне виготовлення меблів без посередників. Кухні, гардеробні, шафи-купе за індивідуальними проектами на Лівому березі Києва.",
  footer_location: "Безкоштовний замір: Троєщина, Лісовий масив, Дарниця, Воскресенка, Биківня",
};

export default function PreviewPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [banner, setBanner] = useState<any>({
    is_active: false,
    template: "text",
    title: "",
    text: "",
    button_text: "",
    image_url: "",
    image_position: "right",
  });
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const prevFocusRef = useRef<string | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    if (!sectionId || sectionId === prevFocusRef.current) return;
    prevFocusRef.current = sectionId;

    const sectionMap: Record<string, string> = {
      hero: "preview-hero",
      banner: "preview-banner",
      about: "about",
      services: "services",
      faq: "faq",
      gallery_project: "portfolio",
      reviews: "preview-reviews",
      blog: "preview-blog",
      settings: "preview-hero",
    };

    // Also handle service_0, service_1, etc.
    let targetId = sectionMap[sectionId];
    if (!targetId && sectionId.startsWith("service_")) {
      targetId = "services";
    }
    if (!targetId && sectionId.startsWith("benefit_")) {
      targetId = "about";
    }
    if (!targetId && sectionId.startsWith("faq_")) {
      targetId = "faq";
    }

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      const { type, payload } = event.data;

      if (type === "UPDATE_SETTINGS") {
        if (payload.site) {
          setSettings((prev) => ({ ...prev, ...payload.site }));
        }
        if (payload.banner) {
          setBanner(payload.banner);
        }
      }

      if (type === "SCROLL_TO") {
        scrollToSection(payload.section);
      }

      if (type === "FOCUS_SECTION") {
        setFocusedSection(payload.section);
        scrollToSection(payload.section);
      }

      if (type === "BLUR_SECTION") {
        setFocusedSection(null);
        prevFocusRef.current = null;
      }
    };

    window.addEventListener("message", handler);

    // Signal parent that preview is ready
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => window.removeEventListener("message", handler);
  }, [scrollToSection]);

  const getFocusRing = (section: string) =>
    focusedSection === section
      ? "outline outline-2 outline-red-500 outline-offset-[-2px] shadow-[0_0_0_4px_rgba(239,68,68,0.25),inset_0_0_30px_rgba(239,68,68,0.08)] transition-all duration-200 relative z-10"
      : "transition-all duration-200";

  return (
    <SiteProvider settings={settings}>
      <ConfigProvider>
        <div className="min-h-screen relative bg-[var(--color-dark-bg)]">
          {/* Hero Section */}
          <section
            id="preview-hero"
            className={`relative min-h-[60vh] w-full flex items-center justify-center overflow-hidden ${getFocusRing("hero")}`}
          >
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src="/images/luxury_kitchen.png"
                alt={`${settings.hero_title} - ${settings.logo_text}`}
                fill
                className="object-cover object-center scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-[#000000a0] to-[#00000060]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark-bg)] via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-20 pt-20 pb-16">
              <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium">
                    Ексклюзивне Виробництво • Київ
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-heading mb-6 leading-[1.05]">
                  {settings.hero_title}
                </h1>

                <p className="text-base md:text-lg text-zinc-300 max-w-2xl mb-8 font-light leading-relaxed border-l border-[#D4AF37]/30 pl-6">
                  {settings.hero_subtitle}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button className="group relative flex items-center justify-center gap-3 h-14 px-8 bg-metallic-gold text-black uppercase tracking-widest text-xs font-bold rounded-none overflow-hidden transition-all">
                    <span className="relative z-10">Зробити Прорахунок</span>
                    <MoveRight className="w-4 h-4 relative z-10" />
                  </button>

                  <div className="flex items-center gap-6 text-sm text-zinc-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      <span>{settings.phone}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      <span>Київ</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

          {/* Page sections */}
          <div className="relative z-20 bg-[var(--color-dark-bg)]">
            <div className={getFocusRing("services")}>
              <Services />
            </div>
            <div id="preview-gallery" className={getFocusRing("gallery_project")}>
              <Gallery />
            </div>
            <div className={getFocusRing("about")}>
              <About />
            </div>
            <Timeline />
            <div className={getFocusRing("faq")}>
              <FAQ />
            </div>
            <div id="preview-reviews" className={getFocusRing("reviews")}>
              <Reviews />
            </div>
            <div id="preview-blog" className={getFocusRing("blog")}>
              <Blog />
            </div>
            <Footer />
          </div>

          {/* Promo Banner - controlled by admin */}
          {banner.is_active && (
            <div id="preview-banner" className={getFocusRing("banner")}>
              <PromoBanner overrideConfig={{
                isActive: banner.is_active === true,
                mode: banner.template === 'image' ? 'full-image' : banner.template === 'image_text' ? 'split' : 'text-only',
                title: banner.title || "",
                text: banner.text || "",
                buttonText: banner.button_text || "Скористатися пропозицією",
                image: banner.image_url || "",
                imagePosition: banner.image_position === 'left' ? 'left' : 'right',
              }} />
            </div>
          )}
        </div>
      </ConfigProvider>
    </SiteProvider>
  );
}
