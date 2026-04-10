"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface ServiceItem {
  title: string;
  desc: string;
  bg: string;
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
