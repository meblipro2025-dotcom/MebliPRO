import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";
import { SiteProvider, SiteSettings } from "@/context/SiteContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "700", "900"], variable: "--font-playfair" });

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
  highlights: [
    {
      title: "Повний цикл виробництва",
      subtitle: "Створення меблів від проєкту до монтажу з контролем якості на кожному кроці.",
    },
    {
      title: "Гарантія на роботу",
      subtitle: "До 5 років сервісної підтримки та гарантійного обслуговування.",
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
    {
      title: "Реставрація меблів",
      desc: "Друге життя для ваших улюблених фасадів та фурнітури.",
    },
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
    {
      title: "Вітальні та передпокої",
      desc: "ТВ-зони, стінки для віталень, комплексні рішення для передпокою з дзеркалами та місцям для взуття.",
      bg: "/images/office_desk.png",
    },
    {
      title: "Дитячі та офісні зони",
      desc: "Зручні робочі місця для навчання та роботи. Ергономічні столи, полиці та системи зберігання.",
      bg: "/images/children_room.png",
    },
  ],
  faq: [
    {
      question: "Які терміни виготовлення меблів?",
      answer: "Виготовлення займає від 14 до 45 днів залежно від складності проекту та матеріалів. Кухні — до 30 днів, шафи-купе — від 14 днів.",
    },
    {
      question: "Чи є ви офіційним ФОП?",
      answer: "Так, працюю як ФОП і надаю договір з гарантіями на роботи. Офіційні розрахунки, прозорі умови.",
    },
    {
      question: "Чи виїзд на замір безкоштовний?",
      answer: "Так, безкоштовний замір на Троєщині, Лісовому масиві, Дарниці, Воскресенці та Биківні. При замовленні меблів виїзд не оплачується.",
    },
  ],
  blog_label: "Корисні статті",
  blog_title: "Блог\nМайстра",
  footer_description: "Професійне виготовлення меблів без посередників. Кухні, гардеробні, шафи-купе за індивідуальними проектами на Лівому березі Києва.",
  footer_location: "Безкоштовний замір: Троєщина, Лісовий масив, Дарниця, Воскресенка, Биківня",
};

async function getSiteSettings(): Promise<SiteSettings> {
  const [{ data: sData }, { data: bData }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'site').single(),
    supabase.from('site_settings').select('value').eq('key', 'banner').single()
  ]);

  return {
    ...defaultSettings,
    ...(sData?.value || {}),
    banner: bData?.value
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mebli-pro.com.ua";

  return {
    title: "MEBLI-PRO | Кухні та шафи на замовлення | Київ, Лівий берег",
    description: "Професійне виготовлення меблів без посередників. Кухні, гардеробні, шафи-купе. Працюємо на Троєщині, Лісовому, Дарниці, Воскресенці, Биківні. 15 років досвіду.",
    metadataBase: new URL(baseUrl),
    keywords: [
      "меблі на замовлення Київ",
      "корпусні меблі Лівий берег",
      "кухні на замовлення Троєщина",
      "шафи-купе Дарниця",
      "меблі Биківня",
      "меблевий майстер Київ",
      "індивідуальні меблі Київ",
      "кухні Blum Hettich Київ",
      "гардеробні системи Лівий берег",
      "меблі Воскресенка",
    ],
    openGraph: {
      title: settings.logo_text,
      description: settings.hero_subtitle,
      url: baseUrl,
      images: [
        {
          url: `${baseUrl}/images/luxury_kitchen.png`,
          width: 1200,
          height: 630,
          alt: `${settings.logo_text} — Кухні та меблі на замовлення в Києві, Троєщина, Дарниця`,
        },
      ],
    },
    twitter: {
      title: settings.logo_text,
      description: settings.hero_subtitle,
      images: [`${baseUrl}/images/luxury_kitchen.png`],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <SiteProvider settings={settings}>
          <Analytics />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": settings.logo_text,
                "image": "/images/luxury_kitchen.png",
                "description": settings.hero_subtitle,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Київ",
                  "addressRegion": "Київська область",
                  "addressCountry": "UA",
                  "streetAddress": "Лівий берег (Троєщина, Лісовий масив, Дарниця, Воскресенка, Биківня)"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "50.5156",
                  "longitude": "30.6139"
                },
                "areaServed": {
                  "@type": "GeoCircle",
                  "geoMidpoint": {
                    "@type": "GeoCoordinates",
                    "latitude": "50.5156",
                    "longitude": "30.6139"
                  },
                  "geoRadius": "15000",
                  "description": "Троєщина, Лісовий масив, Дарниця, Воскресенка, Биківня — Лівий берег Києва"
                },
                "telephone": settings.phone,
                "url": process.env.NEXT_PUBLIC_SITE_URL || "https://mebli-pro.com.ua",
              })
            }}
          />
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}

