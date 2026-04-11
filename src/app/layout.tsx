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
      title: "15+ Років Досвіду",
      subtitle: "Сотні успішно реалізованих проєктів будь-якої складності.",
    },
    {
      title: "Гарантія 2 Роки",
      subtitle: "Офіційний договір та повна відповідальність за якість.",
    },
  ],
  benefits: [
    {
      title: "Власне виробництво",
      desc: "Без посередників та переплат. Контроль на кожному етапі.",
    },
    {
      title: "Преміум фурнітура",
      desc: "Використовуємо лише перевірені бренди: Blum, Hettich, Muller.",
    },
    {
      title: "Безкоштовний замір",
      desc: "Виїзд майстра та консультація — 0 грн (Лівий берег).",
    },
    {
      title: "3D Дизайн-проєкт",
      desc: "Візуалізація ваших майбутніх меблів перед початком робіт.",
    },
  ],
  services: [
    {
      title: "Кухонні Меблі",
      desc: "Індивідуальні кухонні гарнітури («МДФ фарба», «МДФ плівка», дерево) з преміум фурнітурою.",
      bg: "/images/kitchen_modern.png",
      slug: "kukhni",
    },
    {
      title: "Шафи та Гардеробні",
      desc: "Вбудовані рішення: шафи-купе, гардеробні кімнати, розпашні системи «до стелі».",
      bg: "/images/wardrobe_builtin.png",
      slug: "shafi",
    },
    {
      title: "Ліжка-Трансформери",
      desc: "Багатофункціональні системи 3-в-1 для смарт-квартир: Ліжко + Шафа + Диван.",
      bg: "/images/transformer1.jpg",
      slug: "lizhka-transformery",
    },
    {
      title: "Підвісні Столи",
      desc: "Компактні столи-трансформери, що складаються в стильну полицю.",
      bg: "/images/471500883.webp",
      slug: "pidvisni-stoly",
    },
    {
      title: "Дитячі Кімнати",
      desc: "ЕКО-матеріали та безпечний дизайн для дітей: ліжка, робочі зони та шафи.",
      bg: "/images/children_room.png",
      slug: "dityachi-kimnaty",
    },
    {
      title: "Офісні Меблі",
      desc: "Робочі місця, кабінети та ресепшени для вашого бізнесу за індивідуальними розмірами.",
      bg: "/images/office_desk.png",
      slug: "ofisni-mebli",
    },
    {
      title: "Меблі для ванних",
      desc: "Вологостійкі тумби, стільниці та пенали з кварцу чи фарбованого МДФ.",
      bg: "/images/living_room_tv.png",
      slug: "mebli-dlya-vannikh",
    },
    {
      title: "Вітальні та ТВ-зони",
      desc: "Сучасні меблі для відпочинку: ТВ-тумби, вітрини та декоративні стінні панелі.",
      bg: "/images/kitchen_island.png",
      slug: "vitalni",
    },
    {
      title: "Реставрація меблів",
      desc: "Оновлення ваших меблів: заміна фасадів, фурнітури та відновлення вигляду.",
      bg: "/images/luxury_kitchen.png",
      slug: "restoration",
    },
  ],
  faq: [
    {
      question: "Які терміни виготовлення меблів?",
      answer: "Від 14 до 35 календарних днів залежно від фасадів та наявності матеріалів.",
    },
    {
      question: "Чи працюєте ви офіційно через ФОП?",
      answer: "Так, укладаємо договір з ФОП. Оплата частинами: аванс 60% та залишок 40%.",
    },
    {
      question: "Для яких районів безкоштовний замір?",
      answer: "Лівий берег: Троєщина, Лісовий масив, Дарниця, Позняки, Осокорки, Биківня.",
    },
    {
      question: "Чи робите ви дизайн-проєкт?",
      answer: "Так, після попереднього прорахунку та вимірів створюється 3D-модель ваших меблів.",
    },
    {
      question: "Яку фурнітуру ви рекомендуєте?",
      answer: "Для тривалої служби — Blum або Hettich. Muller — чудовий варіант за ціною/якістю.",
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meblipro.pp.ua";

  return {
    title: "MEBLI-PRO | Кухні та меблі на замовлення | Київ: Троєщина, Дарниця, Позняки, Осокорки",
    description: "Професійне виготовлення меблів без посередників. Кухні, гардеробні, шафи-купе. Працюємо: Троєщина, Лісовий масив, Дарниця, Биківня, Позняки, Осокорки, Харківська. 15 років досвіду.",
    metadataBase: new URL(baseUrl),
    keywords: [
      "меблі на замовлення Київ",
      "меблі на замовлення Лівий берег",
      "кухні на замовлення Троєщина",
      "шафи-купе Дарниця",
      "меблі Позняки Осокорки",
      "меблі Харківська Київ",
      "меблі Биківня Лісовий",
      "кухні Blum Hettich Київ",
      "гардеробні системи Київ",
      "меблі за індивідуальним проектом",
      "реставрація кухонь Київ"
    ],
    openGraph: {
      title: settings.logo_text + " | Меблі на замовлення в Києві",
      description: "Кухні, шафи, гардеробні за вашими розмірами на Лівому березі. Власне виробництво.",
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
