"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { useSiteSettings } from "@/context/SiteContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Послуги", href: "#services" },
    { name: "Наші Роботи", href: "#portfolio" },
    { name: "Про Майстра", href: "#about" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      {/* Background layer for scroll */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${scrolled ? 'opacity-100 glass-dark border-b border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'opacity-0'}`} />
      
      <div className="container mx-auto px-6 relative z-10 flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-4 group">
          {/* Visual Logo */}
          {settings.show_logo_graphic && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:border-[#D4AF37] transition-colors duration-500">
              <Image 
                src="/images/logo_split.png" 
                alt={`${settings.logo_text} Logo`} 
                fill 
                className="object-cover" 
                unoptimized
              />
            </div>
          )}
          {/* Text Logo */}
          <div className="flex flex-col">
            <span className="text-2xl font-heading font-bold tracking-tight text-metallic-gold">
              {settings.logo_text}
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400">
              {settings.logo_subtitle}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-3">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={(e) => { e.preventDefault(); document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-5 py-2.5 rounded-sm text-sm uppercase tracking-widest text-zinc-300 hover:text-white glass-luxury hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* CONTACT & CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full glass-luxury flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-all">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-sm font-medium tracking-wider text-zinc-200 group-hover:text-white">{settings.phone}</span>
          </a>
          
          <button 
            onClick={(e) => { e.preventDefault(); document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-6 py-3 rounded-none bg-metallic-gold text-black uppercase tracking-widest text-xs font-bold hover:scale-[1.02] active:scale-95 transition-transform duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            Зробити Прорахунок
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="lg:hidden w-12 h-12 flex items-center justify-center glass-luxury text-[#D4AF37] active:scale-95 transition-transform cursor-pointer relative z-[60]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY - Simple CSS version for real devices */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[60px] z-[200] bg-black/95 lg:hidden"
          style={{ display: mobileMenuOpen ? 'flex' : 'none' }}
        >
          <div className="w-full flex flex-col gap-2 p-4 pt-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
                }}
                onClick={(e) => { 
                  e.preventDefault(); 
                  setMobileMenuOpen(false);
                  document.getElementById(link.href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="w-full p-5 bg-[#1a1a1a] border border-[#D4AF37]/30 text-center uppercase tracking-widest text-sm text-[#D4AF37] font-medium active:bg-[#D4AF37]/20"
              >
                {link.name}
              </button>
            ))}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }); 
              }}
              className="w-full mt-4 p-5 bg-[#D4AF37] text-black text-center uppercase tracking-widest text-sm font-bold active:opacity-80"
            >
              Зробити прорахунок
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
