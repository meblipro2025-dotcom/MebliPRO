"use client";

import { Camera, Globe, Send, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useSiteSettings } from "@/context/SiteContext";
import { recordEvent } from "@/lib/analytics";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = useSiteSettings();

  return (
    <footer className="relative pt-12 md:pt-16 pb-24 md:pb-8 px-4 md:px-6 border-t border-[#D4AF37]/20 z-10 glass-dark">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-heading font-black text-metallic-gold">
              {settings.logo_text}
            </h3>
            <p className="text-zinc-400 font-light text-sm leading-relaxed">
              {settings.footer_description}
            </p>
            <div className="flex gap-4">
              {settings.instagram && (
                <Link href={settings.instagram} className="w-10 h-10 rounded-none glass-luxury flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                  <Camera className="w-4 h-4" />
                </Link>
              )}
              {settings.telegram && (
                <Link href={settings.telegram} className="w-10 h-10 rounded-none glass-luxury flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                  <Send className="w-4 h-4" />
                </Link>
              )}
              <Link href="#" className="w-10 h-10 rounded-none glass-luxury flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all">
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-heading text-white uppercase tracking-widest text-[12px]">Навігація</h4>
            <ul className="space-y-4 text-zinc-400 font-light">
              <li><Link href="#services" className="hover:text-[#D4AF37] transition-colors">Наші послуги</Link></li>
              <li><Link href="#about" className="hover:text-[#D4AF37] transition-colors">Про майстра</Link></li>
              <li><Link href="#faq" className="hover:text-[#D4AF37] transition-colors">Питання-відповідь</Link></li>
              <li><Link href="#order" className="hover:text-[#D4AF37] transition-colors">Зробити прорахунок</Link></li>
            </ul>
          </div>

          {/* Areas of Service (SEO) */}
          <div className="space-y-6">
            <h4 className="text-lg font-heading text-white uppercase tracking-widest text-[12px]">Райони обслуговування</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-zinc-500 font-light uppercase tracking-tighter">
              <span>Биківня</span>
              <span>Лісовий</span>
              <span>Чернігівська</span>
              <span>Дарниця</span>
              <span>Лівобережна</span>
              <span>Позняки</span>
              <span>Харківська</span>
              <span>Осокорки</span>
              <span>Троєщина</span>
              <span>Деснянський</span>
              <span>Дніпровський</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-heading text-white uppercase tracking-widest text-[12px]">Контакти майстра</h4>
            <ul className="space-y-4 text-zinc-400 font-light">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                  onClick={() => recordEvent('contact_click', { path: window.location.pathname, source: 'phone' })}
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                  onClick={() => recordEvent('contact_click', { path: window.location.pathname, source: 'email' })}
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{settings.footer_location}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-zinc-500 uppercase tracking-widest">
          <p>© {currentYear} {settings.logo_text}. Усі права захищені.</p>
          <p>Створено Олександром</p>
        </div>
      </div>
    </footer>
  );
}
