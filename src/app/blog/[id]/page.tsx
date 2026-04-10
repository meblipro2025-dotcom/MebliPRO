import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog").select("*").eq("id", id).single();

  if (error) {
    console.error("Blog fetch error:", error.message);
    return null;
  }

  return data as BlogPost;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.id);

  if (!post) {
    return { title: "Статтю не знайдено | Mebli-PRO" };
  }

  return {
    title: `${post.title} | Mebli-PRO`,
    description: post.excerpt || post.title,
    openGraph: {
      title: `${post.title} | Mebli-PRO`,
      description: post.excerpt || post.title,
      images: [post.image_url || "/images/luxury_kitchen.png"],
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await getBlogPost(resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      
      {/* Article Hero */}
      <section className="relative h-[50vh] md:h-[60vh] w-full">
        <Image 
          src={post.image_url || '/images/luxury_kitchen.png'} 
          alt={post.title} 
          fill 
          className="object-cover opacity-60" 
          sizes="100vw" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-16">
            <div className="max-w-4xl">
              <Link href="/#blog" className="flex items-center gap-2 text-[#D4AF37] text-xs uppercase tracking-widest mb-6 md:mb-8 hover:gap-4 transition-all">
                <ArrowLeft className="w-4 h-4" /> Назад до блогу
              </Link>
              
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                {post.category && (
                  <span className="px-3 py-1 bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-widest">
                    {post.category}
                  </span>
                )}
                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(post.created_at).toLocaleDateString('uk-UA')}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-heading text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            
            <div className="lg:w-[65%] prose prose-invert prose-gold max-w-none">
              <div className="text-zinc-300 font-light text-base md:text-lg leading-relaxed space-y-6 md:space-y-8" 
                   dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <div className="mt-12 md:mt-16 p-6 md:p-8 glass-luxury border border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div>
                  <h4 className="text-lg md:text-xl font-heading text-white mb-2 uppercase tracking-tighter">Бажаєте такий проект?</h4>
                  <p className="text-zinc-400 text-sm font-light">Прорахуємо вартість за вашим планом за 24 години.</p>
                </div>
                <Link href="/#order" className="w-full md:w-auto px-8 h-14 bg-metallic-gold text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap inline-flex items-center justify-center">
                  Зробити Прорахунок
                </Link>
              </div>
            </div>

            <aside className="lg:w-[35%] space-y-8 md:space-y-12">
               <div className="glass-luxury p-6 md:p-8 border border-white/5">
                  <h3 className="text-xl font-heading text-white mb-6 uppercase tracking-widest border-b border-[#D4AF37]/20 pb-4">Майстер Олександр</h3>
                  <p className="text-zinc-400 text-sm font-light leading-relaxed mb-6">
                    Більше 5 років я створюю ексклюзивні меблі на Лівому березі Києва, поєднуючи сучасні матеріали та класичну надійність.
                  </p>
                  <div className="flex gap-4">
                    <button className="w-10 h-10 glass-dark rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a className="flex-grow h-10 glass-dark text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 hover:border-[#D4AF37]/50 transition-all" href="https://t.me/mebli_pro_admin">
                      <MessageSquare className="w-4 h-4" /> Запитати майстра
                    </a>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
