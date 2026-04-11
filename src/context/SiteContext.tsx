"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface ServiceItem {
  id?: string;
  title: string;
  desc: string;
  bg: string;
  slug?: string;
  category?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BenefitItem {
  title: string;
  desc: string;
}

export interface HighlightItem {
  title: string;
  subtitle: string;
}

export interface ProjectSpecification {
  // Кухні
  facadeType?: string; // 'МДФ плівка', 'МДФ фарба', 'Дерево', 'ЛДСП', 'Шпон', 'Скло в рамі'
  countertop?: string; // 'Кварц', 'Акрил', 'ДСП', 'Масив'
  furnitureCategory?: string; // 'Бюджет', 'Середній', 'Преміум'
  kitchenShape?: string; // 'Пряма', 'Г-подібна', 'П-подібна', 'Острівна'
  
  // Шафи
  doorType?: string; // 'Розпашні', 'Купе'
  doorFilling?: string; // 'ЛДСП', 'Дзеркало', 'Піскоструй', 'Комбі'
  bodyMaterial?: string; // 'ЛДСП', 'ДСП', 'МДФ'
  
  // Комоди/Тумби
  drawersCount?: number;
  guidesType?: string; // 'Роликові', 'Кулькові', 'Приховані'
  swingFacadesCount?: number;
  
  // Реставрація
  beforeDescription?: string;
  afterDescription?: string;
  
  // Трансформери
  mechanismType?: string;
  
  // Загальні
  style?: string; // 'Modern', 'Classic', 'Loft'
  color?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Кухні' | 'Шафи' | 'Комоди' | 'Тумби' | 'Реставрація' | 'Трансформери' | 'Дитячі' | 'Фасади';
  image_urls: string[];
  before_images: string[];
  specifications: ProjectSpecification;
  price_from?: number;
  price_to?: number;
  price_exact?: number;
  price_note?: string;
  materials: string[];
  furniture_brand?: string;
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  phone: string;
  email: string;
  telegram: string;
  viber: string;
  whatsapp: string;
  instagram: string;
  logo_text: string;
  logo_subtitle: string;
  show_logo_graphic: boolean;
  hero_title: string;
  hero_subtitle: string;
  about_label: string;
  about_title: string;
  about_image: string;
  experience_years: number;
  about_text: string;
  about: string[];
  services: ServiceItem[];
  faq: FaqItem[];
  benefits: BenefitItem[];
  highlights: HighlightItem[];
  blog_label: string;
  blog_title: string;
  footer_description: string;
  footer_location: string;
  banner?: any;
}

const SiteContext = createContext<SiteSettings | null>(null);

export function SiteProvider({ children, settings }: { children: ReactNode; settings: SiteSettings }) {
  return (
    <SiteContext.Provider value={settings}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteProvider");
  }
  return context;
}
