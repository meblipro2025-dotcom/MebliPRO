"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  author_name: string;
  text_content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [current, setCurrent] = useState(0);
  const visibleCount = 3;

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (data) setReviews(data);
    }
    load();
  }, []);

  if (reviews.length === 0) return null;

  const next = () => setCurrent((c) => (c + 1) % reviews.length);
  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length);

  const getVisible = () => {
    const result: Review[] = [];
    for (let i = 0; i < Math.min(visibleCount, reviews.length); i++) {
      result.push(reviews[(current + i) % reviews.length]);
    }
    return result;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("uk-UA", { month: "long", year: "numeric" });

  return (
    <section id="reviews" className="relative py-8 md:py-32 px-4 md:px-6 z-10 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-16 gap-4 md:gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">Відгуки клієнтів</span>
            </div>
            <motion.h2
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-heading text-white tracking-tight"
            >
              Що кажуть <span className="text-metallic-gold italic">Наші Клієнти</span>
            </motion.h2>
          </div>
          {reviews.length > visibleCount && (
            <div className="flex gap-3">
              <button onClick={prev} className="w-12 h-12 glass-luxury border border-white/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={next} className="w-12 h-12 glass-luxury border border-white/10 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all cursor-pointer">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {getVisible().map((review, idx) => (
              <motion.div
                key={`${review.id}-${current}`}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0 }}
                className="glass-luxury p-5 md:p-8 border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col overflow-hidden"
              >
                <Quote className="w-8 h-8 text-[#D4AF37]/30 mb-6" />
                <p className="text-zinc-300 font-light leading-relaxed mb-6 md:mb-8 flex-grow break-words overflow-hidden text-sm md:text-base line-clamp-6">
                  &ldquo;{review.text_content}&rdquo;
                </p>
                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{review.author_name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{formatDate(review.created_at)}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
