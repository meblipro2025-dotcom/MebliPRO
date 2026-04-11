"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Ruler, Palette, Wrench, Check, ArrowRight, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/context/SiteContext";

const categories = [
  { id: "all", label: "Всі роботи" },
  { id: "Кухні", label: "Кухні" },
  { id: "Шафи", label: "Шафи" },
  { id: "Комоди", label: "Комоди та тумби" },
  { id: "Реставрація", label: "Реставрація" },
  { id: "Трансформери", label: "Трансформери" },
  { id: "Дитячі", label: "Дитячі кімнати" },
  { id: "Фасади", label: "Фасади" },
];

// Demo projects data
const demoProjects: Project[] = [
  // КУХНІ (3 кейси)
  {
    id: "demo-kitchen-1",
    title: "Кухня МДФ фарба в сучасному стилі",
    description: "Сучасна кухня для сім'ї з 3 осіб. П-образна планування з великим робочим простором та вбудованою технікою.",
    category: "Кухні",
    image_urls: ["/images/luxury_kitchen.png"],
    before_images: [],
    specifications: {
      facadeType: "МДФ фарба матова",
      countertop: "Кварц Silestone",
      furnitureCategory: "Преміум",
      kitchenShape: "П-подібна",
      style: "Modern"
    },
    price_from: 45000,
    price_to: 52000,
    price_note: "Орієнтовна вартість з фурнітурою Blum",
    materials: ["МДФ фарба", "Кварцова стільниця", "Фурнітура Blum"],
    furniture_brand: "Blum",
    slug: "kukhnya-mdf-farba-suchasna",
    is_published: true,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-kitchen-2",
    title: "Кухня Дерево+Шпон преміум класу",
    description: "Авторська кухня з натурального дуба з елементами шпону. Класичний дизайн з сучасною функціональністю.",
    category: "Кухні",
    image_urls: ["/images/kitchen1.jpg"],
    before_images: [],
    specifications: {
      facadeType: "Дуб натуральний + шпон горіх",
      countertop: "Масив дуба",
      furnitureCategory: "Преміум",
      kitchenShape: "Г-подібна",
      style: "Classic"
    },
    price_from: 78000,
    price_to: 95000,
    price_note: "Орієнтовна вартість під ключ",
    materials: ["Натуральне дерево", "Шпон горіха", "Масивна стільниця"],
    furniture_brand: "Hettich",
    slug: "kukhnya-derevo-shpon-premium",
    is_published: true,
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-kitchen-3",
    title: "Бюджетна кухня ЛДСП пряма",
    description: "Оптимальне рішення для невеликої кухні. Пряма планування з усім необхідним для комфортного готування.",
    category: "Кухні",
    image_urls: ["/images/kitchen2.jpg"],
    before_images: [],
    specifications: {
      facadeType: "ЛДСП Egger",
      countertop: "ДСП з плівкою ПВХ",
      furnitureCategory: "Бюджет",
      kitchenShape: "Пряма",
      style: "Modern"
    },
    price_from: 18000,
    price_to: 24000,
    price_note: "Орієнтовна вартість базової комплектації",
    materials: ["ЛДСП Egger", "Стільниця ПВХ", "Фурнітура Muller"],
    furniture_brand: "Muller",
    slug: "kukhnya-ldsp-budzhetna",
    is_published: true,
    is_featured: false,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // ШАФИ (3 кейси)
  {
    id: "demo-wardrobe-1",
    title: "Шафа-купе з дзеркалом та піскоструєм",
    description: "Велика розсувна шафа для спальні з комбінованим наповненням дверей.",
    category: "Шафи",
    image_urls: ["/images/wardrobe1.jpg"],
    before_images: [],
    specifications: {
      doorType: "Купе",
      doorFilling: "Дзеркало + Піскоструй",
      bodyMaterial: "ЛДСП",
      style: "Modern"
    },
    price_from: 22000,
    price_to: 28000,
    price_note: "Орієнтовна вартість з системою TopLine",
    materials: ["ЛДСП", "Дзеркало", "Піскоструйний малюнок"],
    furniture_brand: "Бюджет",
    slug: "shafa-kupe-dzerkalo-piskostruy",
    is_published: true,
    is_featured: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-wardrobe-2",
    title: "Розпашна шафа в класичному стилі",
    description: "Гардеробна шафа з розпашними дверима з фрезерованим МДФ та фарбуванням.",
    category: "Шафи",
    image_urls: ["/images/wardrobe2.jpg"],
    before_images: [],
    specifications: {
      doorType: "Розпашні",
      doorFilling: "МДФ фарба з фрезою",
      bodyMaterial: "МДФ",
      style: "Classic"
    },
    price_from: 35000,
    price_to: 42000,
    price_note: "Орієнковна вартість з внутрішнім наповненням",
    materials: ["МДФ фарба", "Масив прикрас", "Фурнітура Blum"],
    furniture_brand: "Blum",
    slug: "shafa-rozpashna-klasyka",
    is_published: true,
    is_featured: false,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-wardrobe-3",
    title: "Шафа-купе з комбінованими фасадами",
    description: "Сучасне рішення з поєднанням ЛДСП та дзеркальних вставок.",
    category: "Шафи",
    image_urls: ["/images/wardrobe3.jpg"],
    before_images: [],
    specifications: {
      doorType: "Купе",
      doorFilling: "Комбі (ЛДСП + Дзеркало)",
      bodyMaterial: "ЛДСП",
      style: "Modern"
    },
    price_from: 18000,
    price_to: 25000,
    price_note: "Орієнтовна вартість",
    materials: ["ЛДСП", "Дзеркало", "Система купе"],
    furniture_brand: "Середній",
    slug: "shafa-kupe-kombi",
    is_published: true,
    is_featured: false,
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // РЕСТАВРАЦІЯ (2 кейси)
  {
    id: "demo-restore-1",
    title: "Реставрація кухні 15-річної давнини",
    description: "Повне оновлення старої кухні: заміна фасадів, стільниці, фурнітури. Кухня стала як нова!",
    category: "Реставрація",
    image_urls: ["/images/restoration1.jpg"],
    before_images: ["/images/restoration1_before.jpg"],
    specifications: {
      beforeDescription: "Старі ДСП фасади в поганому стані, зношена стільниця, несправна фурнітура",
      afterDescription: "Нові МДФ фасади фарбовані, кварцова стільниця, фурнітура Blum з доводчиками",
      style: "Modern"
    },
    price_from: 25000,
    price_to: 32000,
    price_note: "Орієнтовна вартість реставрації",
    materials: ["МДФ фарба", "Кварц", "Фурнітура Blum"],
    furniture_brand: "Blum",
    slug: "restavratsiya-kukhni-15-richnoyi",
    is_published: true,
    is_featured: true,
    sort_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-restore-2",
    title: "Реставрація шафи з заміною механізмів",
    description: "Оновлення вбудованої шафи з заміною розсувної системи на сучасну та оновлення фасадів.",
    category: "Реставрація",
    image_urls: ["/images/restoration2.jpg"],
    before_images: ["/images/restoration2_before.jpg"],
    specifications: {
      beforeDescription: "Зношена система купе, заїдають двері, потерті фасади",
      afterDescription: "Нова система TopLine з доводчиками, фасади ЛДСП нового кольору",
      style: "Modern"
    },
    price_from: 12000,
    price_to: 18000,
    price_note: "Орієнтовна вартість",
    materials: ["ЛДСП", "Система TopLine"],
    furniture_brand: "Середній",
    slug: "restavratsiya-shafy-zamіna-mekhanizmiv",
    is_published: true,
    is_featured: false,
    sort_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // ДИТЯЧІ (2 кейси)
  {
    id: "demo-kids-1",
    title: "Дитяча кімната під ключ для двох дітей",
    description: "Комплексне рішення: ліжко-горище, робоча зона, шафа для одягу та ігрова зона.",
    category: "Дитячі",
    image_urls: ["/images/kids1.jpg"],
    before_images: [],
    specifications: {
      style: "Modern",
      color: "Білий + Блакитний"
    },
    price_from: 38000,
    price_to: 45000,
    price_note: "Орієнтовна вартість з ліжком-горище",
    materials: ["ЛДСП", "МДФ фарба", "Фурнітура з доводчиками"],
    furniture_brand: "Blum",
    slug: "dityacha-kіmnata-dviye-dіtey",
    is_published: true,
    is_featured: true,
    sort_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-kids-2",
    title: "Меблі для підлітка з робочою зоною",
    description: "Функціональна кімната з великим столом, полицями для книг та зручним ліжком.",
    category: "Дитячі",
    image_urls: ["/images/kids2.jpg"],
    before_images: [],
    specifications: {
      style: "Modern",
      color: "Дуб сонома + Білий"
    },
    price_from: 28000,
    price_to: 35000,
    price_note: "Орієнтовна вартість",
    materials: ["ЛДСП Egger", "Фурнітура Hettich"],
    furniture_brand: "Hettich",
    slug: "meblі-dlya-pіdlitka",
    is_published: true,
    is_featured: false,
    sort_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // ТРАНСФОРМЕРИ (2 кейси)
  {
    id: "demo-transform-1",
    title: "Ліжко-трансформер 3-в-1 з шафою",
    description: "Унікальне рішення для маленької квартири: вдень - диван та шафа, вночі - повноцінне ліжко.",
    category: "Трансформери",
    image_urls: ["/images/transformer1.jpg"],
    before_images: [],
    specifications: {
      mechanismType: "Шафа-ліжко вертикального відкривання",
      style: "Modern"
    },
    price_from: 42000,
    price_to: 55000,
    price_note: "Орієнтовна вартість з італійським механізмом",
    materials: ["ЛДСП", "МДФ", "Італійський механізм"],
    furniture_brand: "Преміум",
    slug: "lіzhko-transformer-3-v-1",
    is_published: true,
    is_featured: true,
    sort_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-transform-2",
    title: "Підвісний стіл-полиця для кухні",
    description: "Компактне рішення: стіл складається в полицю на стіні коли не потрібен. Ідеально для маленьких кухонь.",
    category: "Трансформери",
    image_urls: ["/images/471500883.webp"],
    before_images: [],
    specifications: {
      mechanismType: "Відкидний стіл з кріпленням до стіни",
      style: "Modern"
    },
    price_from: 4500,
    price_to: 6500,
    price_note: "Орієнтовна вартість з монтажем",
    materials: ["ЛДСП", "Німецькі петлі", "Кріплення"],
    furniture_brand: "Середній",
    slug: "pіdvіsniy-stil-politsya",
    is_published: true,
    is_featured: true,
    sort_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // ФАСАДИ (2 кейси)
  {
    id: "demo-facade-1",
    title: "Фасади МДФ фарба з фрезеруванням",
    description: "Виготовлення фасадів з фрезерованим профілем та фарбуванням в будь-який колір RAL.",
    category: "Фасади",
    image_urls: ["/images/facade1.jpg"],
    before_images: [],
    specifications: {
      facadeType: "МДФ фарба з фрезою",
      style: "Classic"
    },
    price_from: 1800,
    price_to: 2500,
    price_note: "Ціна за м² (орієнтовно)",
    materials: ["МДФ", "Фарба"],
    furniture_brand: "Н/Д",
    slug: "fasadi-mdf-farba-freza",
    is_published: true,
    is_featured: false,
    sort_order: 13,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-facade-2",
    title: "Фасади алюмінієва рама зі склом",
    description: "Сучасні фасади з алюмінієвим профілем та кольоровим склом. Ідеально для вбудованої техніки.",
    category: "Фасади",
    image_urls: ["/images/facade2.jpg"],
    before_images: [],
    specifications: {
      facadeType: "Алюмінієва рама + Скло",
      style: "Modern"
    },
    price_from: 3200,
    price_to: 4500,
    price_note: "Ціна за м² (орієнтовно)",
    materials: ["Алюміній", "Скло"],
    furniture_brand: "Н/Д",
    slug: "fasadi-aluminiy-sklo",
    is_published: true,
    is_featured: false,
    sort_order: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // КОМОДИ (1 кейс для прикладу)
  {
    id: "demo-comode-1",
    title: "Комод з прихованими направляючими",
    description: "Сучасний комод з 4 шухлядами на прихованих кульових направляючих з доводчиками.",
    category: "Комоди",
    image_urls: ["/images/comode1.jpg"],
    before_images: [],
    specifications: {
      drawersCount: 4,
      guidesType: "Приховані кулькові з доводчиками",
      swingFacadesCount: 0,
      style: "Modern"
    },
    price_from: 8500,
    price_to: 12000,
    price_note: "Орієнтовна вартість",
    materials: ["ЛДСП", "МДФ фасади", "Направляючі Hettich"],
    furniture_brand: "Hettich",
    slug: "komod-prihovanі-napravlyayuchі",
    is_published: true,
    is_featured: false,
    sort_order: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

function formatPrice(price?: number): string {
  if (!price) return "Ціна за запитом";
  return price.toLocaleString("uk-UA") + " ₴";
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error loading projects:", error);
        setProjects(demoProjects);
      } else if (data && data.length > 0) {
        setProjects(data as Project[]);
      } else {
        setProjects(demoProjects);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      setProjects(demoProjects);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const nextImage = () => {
    if (selectedProject) {
      const images = selectedProject.image_urls.length > 0 
        ? selectedProject.image_urls 
        : ["/images/placeholder.jpg"];
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      const images = selectedProject.image_urls.length > 0 
        ? selectedProject.image_urls 
        : ["/images/placeholder.jpg"];
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <section id="projects" className="py-20 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#D4AF37] text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
            Наші роботи
          </span>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-white mb-4">
            Каталог проєктів
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
            Реальні кейси з цінами та характеристиками. Кожен проєкт — це унікальне рішення для конкретного клієнта.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-[#D4AF37] text-black"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/5 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                >
                  {/* Image */}
                  <div 
                    className="relative h-56 overflow-hidden cursor-pointer"
                    onClick={() => openModal(project)}
                  >
                    <Image
                      src={project.image_urls[0] || "/images/placeholder.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#D4AF37]/90 text-black text-xs font-bold rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          ★ Топ
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading text-xl text-white mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Specifications Preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.specifications.facadeType && (
                        <span className="text-xs bg-white/5 text-zinc-300 px-2 py-1 rounded">
                          {project.specifications.facadeType}
                        </span>
                      )}
                      {project.specifications.style && (
                        <span className="text-xs bg-white/5 text-zinc-300 px-2 py-1 rounded">
                          {project.specifications.style}
                        </span>
                      )}
                      {project.furniture_brand && project.furniture_brand !== "Н/Д" && (
                        <span className="text-xs bg-white/5 text-zinc-300 px-2 py-1 rounded">
                          {project.furniture_brand}
                        </span>
                      )}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <span className="text-[#D4AF37] font-bold text-lg">
                          {project.price_exact 
                            ? formatPrice(project.price_exact)
                            : project.price_from 
                              ? `від ${formatPrice(project.price_from)}`
                              : "Ціна за запитом"
                          }
                        </span>
                        {project.price_note && (
                          <p className="text-zinc-500 text-xs mt-0.5">{project.price_note}</p>
                        )}
                      </div>
                      <button
                        onClick={() => openModal(project)}
                        className="flex items-center gap-1 text-sm text-white bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black px-4 py-2 rounded-lg transition-all duration-300"
                      >
                        Деталі <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">У цій категорії поки немає проєктів</p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#141414] rounded-2xl overflow-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid md:grid-cols-2 h-full max-h-[90vh] overflow-auto">
                {/* Image Gallery */}
                <div className="relative h-64 md:h-auto bg-black">
                  <Image
                    src={selectedProject.image_urls[currentImageIndex] || "/images/placeholder.jpg"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {selectedProject.image_urls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedProject.image_urls.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentImageIndex ? "bg-[#D4AF37]" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Before/After Toggle */}
                  {selectedProject.before_images.length > 0 && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={() => setCurrentImageIndex(0)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          currentImageIndex === 0
                            ? "bg-[#D4AF37] text-black"
                            : "bg-black/50 text-white"
                        }`}
                      >
                        Після
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(selectedProject.image_urls.length)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          currentImageIndex >= selectedProject.image_urls.length
                            ? "bg-[#D4AF37] text-black"
                            : "bg-black/50 text-white"
                        }`}
                      >
                        До
                      </button>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 overflow-auto">
                  <span className="text-[#D4AF37] text-sm font-medium tracking-wider uppercase">
                    {selectedProject.category}
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl text-white mt-2 mb-4">
                    {selectedProject.title}
                  </h2>
                  <p className="text-zinc-400 mb-6">
                    {selectedProject.description}
                  </p>

                  {/* Specifications */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-[#D4AF37]" /> Характеристики
                    </h3>
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      {selectedProject.specifications.facadeType && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Фасади:</span>
                          <span className="text-white">{selectedProject.specifications.facadeType}</span>
                        </div>
                      )}
                      {selectedProject.specifications.countertop && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Стільниця:</span>
                          <span className="text-white">{selectedProject.specifications.countertop}</span>
                        </div>
                      )}
                      {selectedProject.specifications.kitchenShape && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Форма:</span>
                          <span className="text-white">{selectedProject.specifications.kitchenShape}</span>
                        </div>
                      )}
                      {selectedProject.specifications.doorType && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Тип дверей:</span>
                          <span className="text-white">{selectedProject.specifications.doorType}</span>
                        </div>
                      )}
                      {selectedProject.specifications.doorFilling && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Наповнення:</span>
                          <span className="text-white">{selectedProject.specifications.doorFilling}</span>
                        </div>
                      )}
                      {selectedProject.specifications.drawersCount !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Кількість шухляд:</span>
                          <span className="text-white">{selectedProject.specifications.drawersCount}</span>
                        </div>
                      )}
                      {selectedProject.specifications.guidesType && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Направляючі:</span>
                          <span className="text-white">{selectedProject.specifications.guidesType}</span>
                        </div>
                      )}
                      {selectedProject.specifications.mechanismType && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Механізм:</span>
                          <span className="text-white">{selectedProject.specifications.mechanismType}</span>
                        </div>
                      )}
                      {selectedProject.specifications.style && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Стиль:</span>
                          <span className="text-white">{selectedProject.specifications.style}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Materials */}
                  {selectedProject.materials.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-white font-medium flex items-center gap-2 mb-3">
                        <Palette className="w-5 h-5 text-[#D4AF37]" /> Матеріали
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.materials.map((material, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-white/5 text-zinc-300 rounded-full text-sm"
                          >
                            <Check className="w-3 h-3 inline mr-1 text-[#D4AF37]" />
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Вартість:</span>
                      <span className="text-[#D4AF37] font-bold text-2xl">
                        {selectedProject.price_exact 
                          ? formatPrice(selectedProject.price_exact)
                          : selectedProject.price_from && selectedProject.price_to
                            ? `${formatPrice(selectedProject.price_from)} - ${formatPrice(selectedProject.price_to)}`
                            : selectedProject.price_from 
                              ? `від ${formatPrice(selectedProject.price_from)}`
                              : "Ціна за запитом"
                        }
                      </span>
                    </div>
                    {selectedProject.price_note && (
                      <p className="text-zinc-500 text-sm mt-2">{selectedProject.price_note}</p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => {
                      closeModal();
                      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-wider rounded-lg hover:bg-[#e5c248] transition-colors flex items-center justify-center gap-2"
                  >
                    ЗАМОВИТИ ПРОРАХУНОК <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
