import { CheckCircle2, Shield } from "lucide-react";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteContext";

export default function About() {
  const settings = useSiteSettings();
  const benefits = settings.benefits;
  const aboutText = settings.about.length > 0 ? settings.about : [settings.about_text];
  const aboutTitleLines = settings.about_title.split("\n").filter(Boolean);

  return (
    <section id="about" className="relative py-10 md:py-24 lg:py-32 px-4 md:px-6 z-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#050505] overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          <div className="w-full lg:w-[45%] mb-12 lg:mb-0 flex flex-col">
            <div className="relative w-full aspect-[4/5] overflow-hidden group border border-[#D4AF37]/30 bg-[#0a0a0a]">
              <Image 
                src={settings.about_image}
                alt={settings.about_title.replace(/\n/g, " ")}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 border-[0.5px] border-[#D4AF37]/20 m-4 pointer-events-none" />
            </div>

            <div className="mt-4 ml-auto w-28 h-28 sm:w-40 sm:h-40 glass-dark border border-[#D4AF37]/40 flex flex-col items-center justify-center shadow-2xl overflow-hidden backdrop-blur-xl relative">
              <div className="absolute inset-0 bg-[#D4AF37]/5" />
              <div className="flex items-center gap-1 mb-1 relative z-10">
                <span className="text-3xl sm:text-5xl font-heading text-white">{settings.experience_years}</span>
                <span className="text-2xl sm:text-4xl font-heading text-[#D4AF37]">+</span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 relative z-10">років досвіду</span>
            </div>
          </div>

          <div className="w-full lg:w-[55%]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-medium">{settings.about_label}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading mb-6 md:mb-8 tracking-tight text-white leading-[1.1]">
              {aboutTitleLines.map((line, index) => (
                <span key={line} className={index === aboutTitleLines.length - 1 ? "text-metallic-gold italic block" : "block"}>
                  {line}
                </span>
              ))}
            </h2>
            {aboutText.map((paragraph, index) => (
              <p key={index} className="text-zinc-400 font-light leading-relaxed mb-4 md:mb-6 text-base md:text-lg lg:text-xl border-l border-[#D4AF37]/30 pl-4 md:pl-6">
                {paragraph}
              </p>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-10">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="mt-1 flex-shrink-0">
                    {idx === 0 ? <Shield className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform" strokeWidth={1.5} /> : <CheckCircle2 className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform" strokeWidth={1.5} />}
                  </div>
                  <div>
                    <h4 className="font-heading text-xl mb-2 text-white">{item.title}</h4>
                    <p className="text-zinc-400 font-light text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
