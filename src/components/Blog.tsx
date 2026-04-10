"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/context/SiteContext";

interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  layout_style: string;
  created_at: string;
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const settings = useSiteSettings();
  const blogTitleLines = settings.blog_title.split("\n").filter(Boolean);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const { data } = await supabase.from('blog').select('*').order('created_at', { ascending: false });
        setBlogPosts((data || []).map((item: BlogPost) => ({
          ...item,
          layout_style: item.layout_style || 'standard',
        })));
      } catch (err) {
        console.error("Помилка завантаження блогу:", err);
      } finally {
        setLoaded(true);
      }
    }
    loadBlogs();
  }, []);

  if (!loaded || blogPosts.length === 0) return null;

  return (
    <section id="blog" className="relative py-10 md:py-24 px-4 md:px-6 z-10 bg-[#0a0a0a]/50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-16 gap-4 md:gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">{settings.blog_label}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-white tracking-tight">
              {blogTitleLines.map((line, index) => (
                <span key={line} className={index === blogTitleLines.length - 1 ? "text-metallic-gold italic block" : "block"}>
                  {line}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post, idx) => (
            <Link key={post.id || idx} href={`/blog/${post.id}`}>
              <motion.article 
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className={`glass-luxury border border-white/5 group relative overflow-hidden flex flex-col h-full cursor-pointer transition-transform hover:scale-[1.01] ${post.layout_style === 'featured' ? 'lg:col-span-2' : ''}`}
              >
                <div className={`relative overflow-hidden h-40 md:h-48 w-full border-b border-white/5`}>
                  {post.image_url ? (
                    <Image 
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-zinc-500">Немає фото</div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30">
                    Стаття
                  </div>
                </div>

                <div className="p-5 md:p-6 lg:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3 md:mb-4 font-light">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.created_at).toLocaleDateString('uk-UA')}</div>
                  </div>
                  
                  <h3 className={`font-heading text-white mb-3 group-hover:text-[#D4AF37] transition-colors text-lg md:text-xl`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-zinc-400 font-light text-sm leading-relaxed mb-4 md:mb-6 flex-grow line-clamp-3">
                    {post.excerpt || post.content}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      Читати далі <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
